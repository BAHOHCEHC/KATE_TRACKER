// const Category = require('../models/Client')
const Client = require('../models/Client')
const Task = require('../models/Task')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
  try {
    // const categories = await Category.find({user: req.user.id})
    // res.status(200).json(categories)
    const clients = await Client.find({user: req.user.id})
    res.status(200).json(clients)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function(req, res) {
  try {
    // const category = await Category.findById(req.params.id)
    // res.status(200).json(category)
    const client = await Client.findById(req.params.id)
    res.status(200).json(client)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function(req, res) {
  try {
    // await Category.remove({_id: req.params.id})
    // await Position.remove({category: req.params.id})
    await Client.remove({_id: req.params.id})
    await Task.remove({client: req.params.id})
    res.status(200).json({
      message: 'Категория удалена.'
    })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function(req, res) {
  const client = new Client({
  // const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : ''
  })

  try {
    // await category.save()
    // res.status(201).json(category)
    await client.save()
    res.status(201).json(client)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function(req, res) {
  const updated = {
    name: req.body.name
  }

  if (req.file) {
    updated.imageSrc = req.file.path
  }

  try {
    // const category = await Category.findOneAndUpdate(
    const client = await Client.findOneAndUpdate(
      {_id: req.params.id},
      {$set: updated},
      {new: true}
    )
    // res.status(200).json(category)
    res.status(200).json(client)
  } catch (e) {
    errorHandler(res, e)
  }
}