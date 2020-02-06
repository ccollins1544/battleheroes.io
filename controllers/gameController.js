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
        return inGame;
      }

      return db.User.findOne(
        { '_id': instigator_id },
        {
          active_game: 1
        }
      ).catch(err => res.status(422).json(err));

    })
    .then(userResponse => {
      
      if(userResponse){
        return db.Game.findOne(
          { '_id': userResponse.active_game }
        )
        .catch(err => res.status(422).json(err));
      }

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

      db.User.find({
        '_id': startedGame.instigator_id,
        'games': startedGame._id
      }).then(wasStarted =>{
        if(wasStarted.length === 0 ){
          db.User.findOneAndUpdate(
            { '_id': startedGame.instigator_id },
            { 
              $push: { 'games': startedGame._id },
              $set: { 
                'active_game': startedGame._id, 
                'game_status': 1, 
                'hero': startedGame.instigator_hero_id 
              }
            },
            { new: true }
          )
          .then(dbModel => console.log("updated users game and game_status", dbModel));
        }
      });

      return startedGame;
    })
    .then(startedGame => res.json(startedGame))
    .catch(err => res.status(422).json(err));
  },

  searchChallenge: function (req, res) {
    let { user_id } = req.body;

    db.User.find({
      $and : [
        { $or: [
          { 'game_status': { $in: [ 0, 1 ] } }, 
          { 'game_status': { $exists: false } }
        ]},
        {
          '_id': { $ne: user_id }
        }
      ]
    })
    .then(dbPlayers => res.json(dbPlayers))
    .catch(err => res.status(422).json(err));
  },

  sendChallenge: function (req, res) {

  },
};