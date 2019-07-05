const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  // date: {
  //   type: Date
  // },
  start: {
    // type: String,
    type: Date
  },
  end: {
    // type: String,
    type: Date
  },
  order: {
    type: Number,
    required: true
  },
  list: [
    {
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      cost: {
        type: Number
      }
    }
  ],
  user: {
    ref: "users",
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model("orders", orderSchema);
