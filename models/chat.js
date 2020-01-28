const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// chatbox schema  
const chatSchema = new Schema({
  message: String,
  sender: String,
  date: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
