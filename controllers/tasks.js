const Task = require('../models/Task');
const errorHandler = require('../utils/errorHandler');
const moment = require('moment');

module.exports.getByClientName = async function(req, res) {
	try {
		const tasks = await Task.find({
			clientName: req.params.clientName, // clientId в роутах /:clientName'
			user: req.user.id //из passporta тянем юзера id
		});
		res.status(200).json(tasks);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.create = async function(req, res) {
	try {
		const task = await new Task({
			name: req.body.name,
			cost: req.body.cost,
			clientName: req.body.clientName,
			clientId: req.body.clientId,
			user: req.body.user,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			wastedTime: req.body.wastedTime,
			totalMoney: req.body.totalMoney,
			startDay: req.body.startDay,
			formatTime: req.body.formatTime
		}).save();
		res.status(201).json({
			message: 'Задача была создана!!!'
		});
		// res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.remove = async function(req, res) {
	try {
		await Task.deleteOne({ _id: req.params.id });
		res.status(200).json({
			message: 'Задача была удалена!!!'
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
		res.status(200).json({
			message: 'Задача обновлена!!!'
		});
		// res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};
