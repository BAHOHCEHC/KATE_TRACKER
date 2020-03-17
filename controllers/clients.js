// const Category = require('../models/Client')
const Client = require("../models/Client");
const Task = require("../models/Task");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function(req, res) {
  try {
    const clients = await Client.find({ user: req.user.id });
    // const clients = [];
    res.status(200).json(clients);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getByName = async function(req, res) {
  try {
    const client = await Client.find({ name: req.params.name });
    res.status(200).json(client);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async function(req, res) {
  try {
    await Client.remove({ _id: req.params.id });
    await Task.remove({ client: req.params.id }); //по полю клиентов в модели Task
    res.status(200).json({
      message: "Клиент удален.Вместе со всеми тасками!!!"
      // message: 'Категория удалена.'
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  const client = new Client({
    name: req.body.name,
    tarif: req.body.tarif,
    currency: req.body.currency,
    user: req.user.id,
    taskList: req.body.taskList
  });

  try {
    await client.save();
    res.status(201).json(client);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  const updated = {
		totalHours: +req.body.totalHours,
		totalPayment: +req.body.totalPayment
  };
  console.log('************************************', updated);
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
    res.status(200).json(client);
  } catch (e) {
    errorHandler(res, e);
  }
};
