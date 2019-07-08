const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  // const positionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    default: 10
  },
  client: {  //по этому полю удаляется таски у клиента при удалении клиента
    type: String,
  },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
  wastedTime: {
    type: Number
  },
  totalMoney: {
    type: Number
  },
  user: {
    ref: "users",
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model("tasks", taskSchema);
// module.exports = mongoose.model('positions', positionSchema)
