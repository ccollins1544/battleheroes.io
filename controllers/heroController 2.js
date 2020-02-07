const db = require("../models");

// Defining methods for the heroController
module.exports = {
  findById: function (req, res) {
    db.Heroes.findOne({
        _id: req.params.hero_id
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};