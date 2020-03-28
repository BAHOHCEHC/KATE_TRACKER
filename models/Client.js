const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const categorySchema = new Schema({
const clientSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	user: {
		ref: 'users',
		type: Schema.Types.ObjectId
	},
	tarif: {
		type: Number,
		default: 10
	},
	currency: {
		type: String
	},
	totalHours: {
		type: Number,
		default: 0
	},
	totalPayment: {
		type: Number,
		default: 0
	},
	taskList: [
		{
			name: {
				type: String
			},
			wasteTime: {
				type: Number
			},
			totalCost: {
				type: Number
			}
		}
	],
	default: []
});

module.exports = mongoose.model('clients', clientSchema)