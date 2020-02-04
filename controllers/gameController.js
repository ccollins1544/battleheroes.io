const db = require("../models");

// Defining methods for the gameController
module.exports = {
  startGame: function (req, res) {
    let instigator_id = req.params.user_id;
    let { instigator_hero_id, instigator_hero_hp } = req.body;
    let players = [ instigator_id ];
    let heroes = [ instigator_hero_id ];

    db.Game.findOne({
      instigator_id: instigator_id,
      in_game: true,
    })
    .then(inGame => {
      if(inGame){
        res.json({
          error: `Sorry, you are already in a game. Please finish your current game before starting another one.`
        })
      }
    })
    .then(notInGame => {

      let newGame = {
        instigator_id, 
        instigator_hero_id, 
        instigator_hero_hp,
        players,
        heroes, 
        in_game: false,
        turn_count: 0,
      };

      return db.Game.create(newGame).catch(err => res.status(422).json(err))
    })
    .then(startedGame => {

      db.User.findOneAndUpdate(
        { '_id': startedGame.instigator_id },
        { 
          $push: { 'game': startedGame._id },
          $set: { 'game_status': 1, 'heroes': startedGame.instigator_hero_id }
        },
        { new: true }
      )
      .then(dbModel => console.log("updated users game and game_status", dbModel));

      return startedGame;
    })
    .then(startedGame => res.json(startedGame))
    .catch(err => res.status(422).json(err));
  },

  searchChallenge: function (req, res) {
    let { user_id } = req.body;

    db.User.find({
      'game_status': { $in: [ 0, 1 ] }, 
      '_id': { $ne: user_id }
    })
    .then(dbPlayers => res.json(dbPlayers))
    .catch(err => res.status(422).json(err));
  },

  sendChallenge: function (req, res) {

  },
};