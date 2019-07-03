// const Position = require("../models/Task");
const Task = require("../models/Task");
const errorHandler = require("../utils/errorHandler");

// module.exports.getByCategoryId = async function(req, res) {
module.exports.getByClientId = async function(req, res) {
  try {
    // const positions = await Position.find({
    const tasks = await Task.find({
      // category: req.params.categoryId,
      client: req.params.clientId,
      user: req.user.id
    });
    res.status(200).json(tasks);
    // res.status(200).json(positions)
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  try {
    // const position = await new Position({
    const task = await new Task({
      name: req.body.name,
      cost: req.body.cost,
      client: req.body.client,
      // category: req.body.category,
      user: req.user.id
    }).save();
    // res.status(201).json(position);
    res.status(201).json(task);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async function(req, res) {
  try {
    // await Position.remove({ _id: req.params.id });
    await Task.remove({ _id: req.params.id });
    res.status(200).json({
      message: "Позиция была удалена."
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  try {
    // const position = await Position.findOneAndUpdate(
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(task);
    // res.status(200).json(position);
  } catch (e) {
    errorHandler(res, e);
  }
};
