const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const categorySchema = new Schema({
const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: ''
  },
  tarif: {
    type: Number,
    default: 10
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
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
  ]
})

module.exports = mongoose.model('clients', clientSchema)
// module.exports = mongoose.model('categories', categorySchema)