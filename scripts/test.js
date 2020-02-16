require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");
const utils = require("../utils/");
const Firebase = require("../utils/Firebase");
var colors = require("colors");

module.exports = {
  test: () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost/battle_heroes";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to Mongo'),
      err => {
        console.log('error connecting to Mongo: ')
        console.log(err);     
      }
    );

    db.User.find({
      $and : [
        { 'games': "5e3f79bf7d37bc09286149a1" },
        { '_id': "5e3f79ba7d37bc09286149a0" },
      ]
    },
    {
      'games': 1, '_id': 0, 'active_game': 1
    }).then(userGamesResponse =>{
      console.log(userGamesResponse);
    
      let { games, active_game } = userGamesResponse[0];
      let possibleGameInvites;
      games.forEach(element => {
        if(active_game !== element){
          possibleGameInvites = element;
        }
      });
      
      return possibleGameInvites;
    }).then(possibleGameInvites => {
      console.log("POSSIBLE GAME:", possibleGameInvites);
      
      db.Game.findOne({
        _id: possibleGameInvites
      })
      .then(dbModel => {
        console.log(dbModel);
        process.exit(0);
      })
    
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  },

  update_firebase: () => {
    let firebase_ref = "-M0BGouXZJaollgoh3SU";
    let gameRef = Firebase.database().ref('/games/' + firebase_ref);
    
    gameRef.update({
      'instigator_hero_hp': 90
    }, function(error) {
      if (error) {
        console.log("Failed to save...".red);
        console.log(error);
        process.exit(1);
      }else{
        console.log("Updated Firebase Successfully!\r\n".green);
        process.exit(0);
      }
    });
  },

  send_challenge: () => {
    let rival_id = "5e3f7fd9ff81a06890897551";
    let instigator_id = "5e3f79ba7d37bc09286149a0";
    let active_game = "5e4862bcafcddd5f78192875";
    let from_email = "chris@ccollins.io";

    let gameRef = Firebase.database().ref('/games/');
    let found_instigator_ref = false;
    let found_rival_ref = false;

    gameRef.once('value', (snapshot) => {
      if(snapshot.hasChildren()){
        snapshot.forEach(function(innerSnap) {
          if(innerSnap.val().hasOwnProperty('user_id')){

            if(innerSnap.val()['user_id'] === rival_id ){
              found_rival_ref = innerSnap.key;
            }else if (innerSnap.val()['user_id'] === instigator_id ){
              found_instigator_ref = innerSnap.key;
            }

          }
        });
      }
    }).then(snap => {
      
      if(found_rival_ref){
        console.log("Found!".green);
        return Firebase.database().ref('/games/' + found_rival_ref + '/games').push(active_game);
      }else{
        console.log("Sorry we couldn't find that rival. They must have gone offline.".red);
        return false;
      }

    }).then(snap => {
      console.log("Pushed".yellow)
      console.log(snap.path);

      if(snap){
        console.log("Last Key Pushed".yellow, snap.key);
        console.log("Rival Key".blue, found_rival_ref);

        let updateTheirGame = {};
        updateTheirGame['/games/' + found_rival_ref + '/game_status'] = 1;
        Firebase.database().ref().update(updateTheirGame);
        
        return true;
      }else{
        return false; 
      }
      
    }).then(pass_fail => {
      console.log("Updated".yellow)
      console.log("Instigator Key".blue, found_instigator_ref);

      if(pass_fail){
        let updateMyGame = {};
        updateMyGame['/games/' + found_instigator_ref + '/game_status'] = 2;
        Firebase.database().ref().update(updateMyGame);

        console.log("Success!".green);
        process.exit(0);
      }else{
        console.log("Fail!".green);
        process.exit(1);
      }
    })
  }
}

//==================[ Dead Code ]===============================
/*
// Detect if you've been challenged.
db.User.find({
  '_id': "5e3f30822600472890e11ce3",
},
{
  'active_game': 1,
  'games':1
}
).then(searchResponse =>{
  console.log(searchResponse);

  let { games, active_game } = searchResponse[0];
  console.log("ACTIVE GAME", active_game);
  console.log("ALL",games);

  let possibleGameInvites;
  games.forEach(element => {
    if(active_game !== element){
      possibleGameInvites = element;
    }
  });

  console.log("POSSIBLE GAME:", possibleGameInvites);
  process.exit(0);

}).catch(err => {
  console.error(err);
  process.exit(1);
});
*/

/*
db.Game.findOneAndUpdate(
  { '_id': "5e3ca528d3a5890f1c1d68b3" },
  { 'in_game': false }
).then(response =>{
  console.log(response);
  console.log("players", response.players);
  response.players.forEach(player => {
    console.log("Player: " + player);
  });

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
*/

