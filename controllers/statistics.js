const Client = require('../models/Client');
const errorHandler = require('../utils/errorHandler');

module.exports.getStatisticByName = async function (req, res) {	
	try {
		const client = await Client.find({ name: req.params.name });
		res.status(200).json(client);
	} catch (e) {
		errorHandler(res, e);
	}
};