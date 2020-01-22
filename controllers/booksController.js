const db = require("../models");

// Defining methods for the booksController
module.exports = {
  findAll: function (req, res) {
    db.Book.find(req.query)
      .sort({
        date: -1
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  findByTitle: function (req, res) {
    db.Book.find({
        title: req.params.id
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  create: function (req, res) {
    db.Book.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  remove: function (req, res) {
    db.Book.findById({
        _id: req.params.id
      })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};