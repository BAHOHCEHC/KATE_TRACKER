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
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('clients', clientSchema)
// module.exports = mongoose.model('categories', categorySchema)