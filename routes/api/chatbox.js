const express = require("express");
const router = express.Router();
// route for chatbox
router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  connectdb.then(db => {
    Chats.find({}).then(chat => {
      res.json(chat);
    });
  });
});

// We are creating a new document and saving it into the Chat collection in the database.
socket.on("connection", socket  =>  {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });  

  socket.on("chat message", function(msg) {
    console.log("message: "  +  msg);
    
    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg  });
    
    //save chat to the database
    connect.then(db  =>  {
      console.log("connected correctly to the server");
      let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
      chatMessage.save();
    });
  });
});

module.exports = router;