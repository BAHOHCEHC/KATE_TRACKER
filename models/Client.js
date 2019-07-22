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
  imageSrc: {
    type: String,
    default: ''
  },
  tarif: {
    type: Number,
    default: 10
  },
  totalHours: {
    type: Number,
  },
  totalPayment: {
    type: Number,
  },
  // curency: {
  //   type: String,
  // },
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
  ]
})

module.exports = mongoose.model('clients', clientSchema)
// module.exports = mongoose.model('categories', categorySchema)