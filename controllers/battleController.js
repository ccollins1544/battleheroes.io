const db = require("../models");
const Firebase = require("../utils/Firebase");
let colors = require("colors");

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

    let gameRef = Firebase.database().ref('/games/');
    let found_opponent_ref = false;
    let found_my_ref = false;

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
    }).then(acceptedGame => {

      // Push updates to firebase
      gameRef.once('value', (snapshot) => {
        if(snapshot.hasChildren()){
          snapshot.forEach(function(innerSnap) {
            if(innerSnap.val().hasOwnProperty('user_id')){

              if(innerSnap.val()['user_id'] == rival_id ){
                found_my_ref = innerSnap.key;
              }else if(innerSnap.val()['user_id'] == acceptedGame.instigator_id ) {
                found_opponent_ref = innerSnap.key;
              }

            }
          })
        }
      }).then(snap => {

        if(found_opponent_ref){
          console.log("Found!".green);
          Firebase.database().ref('/games/' + found_opponent_ref + '/players').push(rival_id);
          return Firebase.database().ref('/games/' + found_opponent_ref + '/heroes').push(rival_hero_id);

        }else{
          console.log("Sorry we couldn't find that rival. They must have gone offline.".red);
          return false;
        }

      }).then(snap => {
        console.log("Pushed".yellow)
        console.log(snap.path);
  
        if(snap){
          console.log("Last Key Pushed".yellow, snap.key);
          console.log("Rival Key".blue, found_opponent_ref);

          let updateTheirGame = {};
          updateTheirGame['/games/' + found_opponent_ref + '/rival_id'] = rival_id;
          updateTheirGame['/games/' + found_opponent_ref + '/rival_hero_id'] = rival_hero_id;
          updateTheirGame['/games/' + found_opponent_ref + '/rival_hero_hp'] = rival_hero_hp;
          Firebase.database().ref().update(updateTheirGame);
          
          return true;
        }else{
          return false; 
        }
        
      }).then(pass_fail => {
        console.log("Updated".yellow)
        console.log("My Key".blue, found_my_ref);

        let updateMyGame = {};
        updateMyGame['/games/' + found_my_ref + '/active_game'] = game_id;
        updateMyGame['/games/' + found_my_ref + '/game_status'] = 2;
        updateMyGame['/games/' + found_my_ref + '/selected_hero_id'] = rival_hero_id;
        Firebase.database().ref().update(updateMyGame);
  
        if(pass_fail){
          console.log("Success!".green);
        }else{
          console.log("Fail!".red);
        }

        res.json(acceptedGame);

      }).catch(err => {

        console.log("Fail!".red);
        console.log(err);
        res.json(acceptedGame);
      });
    }).catch(err => res.status(422).json(err));
  },

  // POST /api/battle/accept/' + gameData.game_id, gameData
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
    }).then(acceptedGame => {

      let gameRef = Firebase.database().ref('/games/');
      let found_opponent_ref = false;
      let found_my_ref = false;

      let opponentArray = acceptedGame.players.filter(player => player != rival_id );
      let opponent_id = opponentArray[0];

      gameRef.once('value', (snapshot) => {
        if(snapshot.hasChildren()){
          snapshot.forEach(function(innerSnap) {

            if(innerSnap.val()['user_id'] == rival_id ){
              found_my_ref = innerSnap.key;
            }else if(innerSnap.val()['user_id'] == opponent_id ) {
              found_opponent_ref = innerSnap.key;
            }

          });
        }
      }).then(snap => {
        
        if(found_opponent_ref){
          console.log("Found!".green);
          Firebase.database().ref('/games/' + found_opponent_ref + '/games').push(game_id);
          Firebase.database().ref('/games/' + found_opponent_ref + '/players').push(rival_id);
          return Firebase.database().ref('/games/' + found_opponent_ref + '/heroes').push(rival_hero_id);

        }else{
          console.log("Sorry we couldn't find that rival. They must have gone offline.".red);
          return false;
        }

      }).then(snap => {
        console.log("Pushed".yellow)
        console.log(snap.path);

        if(snap){
          let updateTheirGame = {};
          updateTheirGame['/games/' + found_opponent_ref + '/rival_id'] = rival_id;
          updateTheirGame['/games/' + found_opponent_ref + '/rival_hero_id'] = rival_hero_id;
          updateTheirGame['/games/' + found_opponent_ref + '/rival_hero_hp'] = rival_hero_hp;
          updateTheirGame['/games/' + found_opponent_ref + '/in_game'] = true;
          updateTheirGame['/games/' + found_opponent_ref + '/game_status'] = 3;
          updateTheirGame['/games/' + found_opponent_ref + '/game_id'] = game_id;
          Firebase.database().ref().update(updateTheirGame);
        }

        if(found_my_ref){
          Firebase.database().ref('/games/' + found_my_ref + '/games').push(game_id);
          Firebase.database().ref('/games/' + found_my_ref + '/players').push(rival_id);
          return Firebase.database().ref('/games/' + found_my_ref + '/heroes').push(rival_hero_id);

        }else{
          console.log("Sorry we couldn't find our own ref..".red);
          return false;
        }

      }).then(snap => {
  
        if(snap){
          console.log("Last Key Pushed".yellow, snap.key);
          console.log("My Key".blue, found_my_ref);

          let updateMyGame = {};
          updateMyGame['/games/' + found_my_ref + '/rival_id'] = rival_id;
          updateMyGame['/games/' + found_my_ref + '/rival_hero_id'] = rival_hero_id;
          updateMyGame['/games/' + found_my_ref + '/rival_hero_hp'] = rival_hero_hp;
          updateMyGame['/games/' + found_my_ref + '/in_game'] = true;
          updateMyGame['/games/' + found_my_ref + '/game_status'] = 3;
          updateMyGame['/games/' + found_my_ref + '/game_id'] = game_id;
          Firebase.database().ref().update(updateMyGame);
          
          return true;
        }else{
          return false; 
        }
        
      }).then(pass_fail => {

        if(pass_fail){
          console.log("Success!".green);
        }else{
          console.log("Fail!".red);
        }

        res.json(acceptedGame);
      }).catch(err => {

        console.log("Fail!".red);
        console.log(err);
        res.json(acceptedGame);
      });

    }).catch(err => res.status(422).json(err));
  },

  // PATCH /api/battle/accept
  attackPlayer: function(req, res){
    let { game_id, 
      rival_id, rival_hero_id, rival_hero_hp, 
      ally_id, ally_hero_id, ally_hero_hp 
    } = req.body;

    let gameRef = Firebase.database().ref('/games/');
    let turnCount = 0;
    
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
      ).then(attacked => {

        gameRef.once('value', (snapshot) => {
          if(snapshot.hasChildren()){
            snapshot.forEach(function(innerSnap) {

              if(innerSnap.val()['game_id'] == game_id){

                let firebase_game = {};
                turnCount = (innerSnap.val()['turn_count'] || 0) + 1;
                firebase_game["/games/" + innerSnap.key + "/rival_hero_id"] = rival_hero_id;
                firebase_game["/games/" + innerSnap.key + "/rival_hero_hp"] = rival_hero_hp;
                firebase_game["/games/" + innerSnap.key + "/player_turn"] = rival_id;
                firebase_game["/games/" + innerSnap.key + "/turn_count"] = turnCount;
                Firebase.database().ref().update(firebase_game);

              }

            });
          }
        }).then(snap => {
          res.json(attacked);
          
        }).catch(err => {

          console.log("Fail_1!".red);
          console.log(err);
          res.json(attacked);
        });

      }).catch(err => res.status(422).json(err));
    
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
      ).then(attacked => {

        gameRef.once('value', (snapshot) => {
          if(snapshot.hasChildren()){
            snapshot.forEach(function(innerSnap) {

              if(innerSnap.val()['game_id'] == game_id){
                
                let firebase_game = {};
                turnCount = (innerSnap.val()['turn_count'] || 0) + 1;
                firebase_game["/games/" + innerSnap.key + "/instigator_hero_id"] = ally_hero_id;
                firebase_game["/games/" + innerSnap.key + "/instigator_hero_hp"] = ally_hero_hp;
                firebase_game["/games/" + innerSnap.key + "/player_turn"] = ally_id;
                firebase_game["/games/" + innerSnap.key + "/turn_count"] = turnCount;
                Firebase.database().ref().update(firebase_game);

              }

            });
          }
        }).then(snap => {
          res.json(attacked);

        }).catch(err => {
          
          console.log("Fail_2!".red);
          console.log(err);
          res.json(attacked);
        });
      }).catch(err => res.status(422).json(err));
    }
  }

};