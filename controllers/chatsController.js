const db = require("../models");

// Defining methods for the booksController
module.exports = {
  findAll: function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    db.Chat.find({})
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  findBySender: (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    db.Chat.find({
      sender: req.params.sender
    })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  saveChat: (req, res) => {
    let sender = req.params.sender
    let { message } =  req.body;
    res.statusCode = 200;

    let chatMessage = new db.Chat({ message: message, sender: sender });
    chatMessage.save().catch(err => res.status(422).json(err));
  },

};
