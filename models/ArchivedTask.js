const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	cost: {
		type: Number,
		required: true,
		default: 10
	},
	clientName: {
		type: String
	},
	clientId: {
		//по этому полю удаляется таски у клиента при удалении клиента
		type: String
	},
	startTime: {
		type: Date
	},
	endTime: {
		type: Date
	},
	startDay: {
		type: String
	},
	wastedTime: {
		type: Number
	},
	totalMoney: {
		type: Number
	},
	user: {
		ref: 'users',
		type: Schema.Types.ObjectId
	},
	formatTime: {
		type: String
	}
});

module.exports = mongoose.model("archivedTasks", taskSchema, "archivedTasks");
