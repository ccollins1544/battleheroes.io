const mongoose = require("mongoose");
const Schema = mongoose.Schema;
<<<<<<< HEAD
// chatbox schema  
const chatSchema = new Schema({
  message: String,
  sender: String,
  date: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

=======

const chatSchema = new Schema({
  message: {
    type: String
  },
  sender: {
    type: String
  }
},
{
  timestamps: true
}
);

let Chat = mongoose.model("Chat", chatSchema);
>>>>>>> 630e13b780f13946ff0097e40e32504f0d796555
module.exports = Chat;
