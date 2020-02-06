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

  /*
  req.params.hero_id
  let updateHeroData = { 
    user_id: userState.user_id,
    game_id: userState.game_id,
    instigator_hero_hp: instigator_hero_hp,
  } */ 

  updateHero: function (req, res){
    
    db.User.findOne({ '_id': req.body.user_id })
    .then(userModel => {
      console.log("FIRST", userModel);
      // var bulkGame = db.Game.initializeOrderBulkOp();

      db.Game.findOneAndUpdate(
        { '_id': req.body.game_id },
        { $pull: { 'heroes': userModel.hero } }
      ).then(pullResponse => {
        console.log("pullResponse", pullResponse);

        return db.Game.findOneAndUpdate(
          { '_id': req.body.game_id },
          { 
            $push: { 'heroes': req.params.hero_id }, 
            $set: { 'instigator_hero_id': req.params.hero_id }
          }
        );
      })

    })
    .then(gameModel => {
      console.log("gameModel", gameModel); 

      return db.User.updateOne(
        { '_id': req.body.user_id }, 
        { $set: {'hero': req.params.hero_id } },
        { upsert: true }
        )
    })
    .then(userModel => res.json(userModel))
    .catch(err => res.status(422).json(err));
    
  },

};