const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  // const positionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    default: 10
  },
  client: {
    ref: "clients",
    type: Schema.Types.ObjectId
  },
  // category: {
  //   ref: 'categories',
  //   type: Schema.Types.ObjectId
  // },
  user: {
    ref: "users",
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model("positions", taskSchema);
// module.exports = mongoose.model('positions', positionSchema)
