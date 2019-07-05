// const Position = require("../models/Task");
const Task = require("../models/Task");
const errorHandler = require("../utils/errorHandler");
const moment = require("moment");

// module.exports.getByCategoryId = async function(req, res) {
module.exports.getByClientId = async function(req, res) {
  try {
    // const positions = await Position.find({
    const tasks = await Task.find({
      // category: req.params.categoryId,
      client: req.params.clientId, // clientId в роутах /:clientId'
      user: req.user.id //из passporta тянем юзера id
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
    const startus = moment(req.body.start, "DD.MM.YYYY HH:mm");
    const endus = moment(req.body.end, "DD.MM.YYYY HH:mm");
    const betweenDifferenceM = startus.diff(endus, "minutes");
    const wasteTime = Math.abs(+betweenDifferenceM) / 60;

    const task = await new Task({
      name: req.body.name,
      cost: req.body.cost,
      client: req.body.client,
      // category: req.body.category,
      start: moment(req.body.start).format("DD.MM.YYYY HH:mm"), //start
      end: moment(req.body.end).format("DD.MM.YYYY HH:mm"), //end
      user: req.user.id,
      wastedTime: wasteTime,
      totalMoney: Math.ceil(wasteTime*req.body.cost)
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
      // message: "Позиция была удалена."
      message: "Задача была удалена!!!"
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  try {
    // const position = await Position.findOneAndUpdate(
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id }, //по id ищем таску
      { $set: req.body }, //новый объект оновляем
      { new: true } //флаг true для мангуса означает обновить
    );
    res.status(200).json(task);
    // res.status(200).json(position);
  } catch (e) {
    errorHandler(res, e);
  }
};
