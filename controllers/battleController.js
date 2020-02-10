const db = require("../models");

// Defining methods for the gameController
module.exports = {
  
  // GET /api/battle/progress
  gameProgress: function(req, res){
    console.log("gameProgress: All the params", req.params);
    console.log("All the things", req.body);
    res.status(200).send("A OK !");
  },

  // POST /api/battle/accept
  acceptGame: function(req, res){
    let { game_id, rival_id, rival_hero_id, rival_hero_hp, true_rival } = req.body;

    db.Game.findOneAndUpdate(
      { '_id': game_id },
      {
        $push: { 'players': rival_id },
        $addToSet: { 'heroes': rival_hero_id },
        $set: {
          'rival_id': rival_id,
          'rival_hero_id': rival_hero_id,
          'rival_hero_hp': rival_hero_hp,
          'true_rival': true_rival
        }
      },
      { new: true }
    ).then(acceptedGame => {
      db.User.findOneAndUpdate(
        { '_id': rival_id },
        {
          $set: {
            'active_game': game_id,
            'game_status': 2,
            'hero': rival_hero_id
          }
        },
        { new: true }
      )
      .then(dbModel => console.log("updated users game and game_status", dbModel));
      
      return acceptedGame;
    }).then(acceptedGame => res.json(acceptedGame))
    .catch(err => res.status(422).json(err));
  },

  readyGame: function(req, res){
    let { game_id } = req.params;
    let { rival_id, rival_hero_id, rival_hero_hp } = req.body;

    db.Game.findOneAndUpdate(
      { '_id': game_id },
      { 
        $push: { 'players': rival_id },
        $addToSet: { 'heroes': rival_hero_id },
        $set: {
          'rival_id': rival_id,
          'rival_hero_id': rival_hero_id,
          'rival_hero_hp': rival_hero_hp,
          'in_game': true 
        }
      },
      { new: true }
    ).then(async gameModel => {
      
      await gameModel.players.forEach(player => {
        db.User.findOneAndUpdate(
          { '_id': player },
          { 
            $set: {
              'game_status': 3,
              'active_game': gameModel._id
            },
            $addToSet: { 'games': gameModel._id },
          },
          { new: true }
        ).then(userModel => console.log("await game_status 3", userModel));
      });

      return gameModel;
    }).then(acceptedGame => res.json(acceptedGame))
    .catch(err => res.status(422).json(err));
  },

  // PATCH /api/battle/accept
  attackPlayer: function(req, res){
    let { game_id, 
      rival_id, rival_hero_id, rival_hero_hp, 
      ally_id, ally_hero_id, ally_hero_hp 
    } = req.body;

    if(rival_hero_id && rival_hero_hp){
      db.Game.findOneAndUpdate(
        { '_id': game_id },
        {
          $set: {
            'rival_hero_id': rival_hero_id,
            'rival_hero_hp': rival_hero_hp,
            'player_turn': rival_id,
          },
          $inc: { 'turn_count': 1 }
        },
        { new: true }
      ).then(attacked => res.json(attacked))
      .catch(err => res.status(422).json(err));
    
    }else{
      db.Game.findOneAndUpdate(
        { '_id': game_id },
        {
          $set: {
            'instigator_hero_id': ally_hero_id,
            'instigator_hero_hp': ally_hero_hp,
            'player_turn': ally_id,
          },
          $inc: { 'turn_count': 1 }
        },
        { new: true }
      ).then(attacked => res.json(attacked))
      .catch(err => res.status(422).json(err));
    }
  }

};