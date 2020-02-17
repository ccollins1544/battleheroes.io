require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");
const utils = require("../utils");
const Firebase = require("../utils/Firebase");
var colors = require("colors");

module.exports = {
  remove_doubles_mongo: () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost/battle_heroes";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to Mongo'),
      err => {
        console.log('error connecting to Mongo: ')
        console.log(err);     
      }
    );

    db.Game.find({},
    {
      '_id': 1, 'games': 1, 'heroes': 1, 'players': 1
    }).then(async allGames => {

      await allGames.forEach(game => {
        console.log("This Game ".yellow + game._id+ "!".yellow);
        
        let temp_heroes = []; 
        let temp_players = []; 
        
        if('players' in game){
          temp_players = game.players.filter((value, index, selfArray) => selfArray.indexOf(value) === index);
          
          if(temp_players.length !== game.players.length){
            console.log('Player doubles found...'.yellow);
            console.log(game.players);
          }else{
            temp_players = [];
          }
        }
        
        if('heroes' in game){
          temp_heroes = game.heroes.filter((value, index, selfArray) => selfArray.indexOf(value) === index);
          
          if(temp_heroes.length !== game.heroes.length){
            console.log('Heroes doubles found...'.yellow);
            console.log(game.heroes);
          }else{
            temp_heroes = [];
          }
        }

        if(temp_heroes.length > 0 || temp_players.length > 0 ){
          db.Game.findOneAndUpdate(
            { '_id': game._id},
            {
              $set: {
                'players': temp_players,
                'heroes': temp_heroes
              }
            },
            { new: true }
          ).then(updatedGame => {
            console.log("Updated game successfully!".green);
            console.log(updatedGame);
          });
        }
      });
  
    }).then(updatedGame =>{

      db.User.find({},
      {
        '_id': 1, 'games': 1
      }).then(async allUsersGames => {
  
        await allUsersGames.forEach(user => {
          console.log("This User ".yellow + user._id+ "!".yellow);
        
          let temp_games = []; 
          
          if('games' in user){
            temp_games = user.games.filter((value, index, selfArray) => selfArray.indexOf(value) === index);
          }
          
          if(temp_games.length !== user.games.length){
            console.log('Game doubles found...'.yellow);
            console.log(user.games);

            db.User.findOneAndUpdate(
              { '_id': user._id},
              {
                $set: {
                  'games': temp_games
                }
              },
              { new: true }
            ).then(updatedUser => {
              console.log("Updated Users Games successfully!".green);
              console.log(updatedUser);
            });
          }  
        });
      });
    
    }).catch(err => {
      console.log("Fail!".red);
      console.error(err);
      process.exit(1);
    });
  },

  remove_doubles_firebase: () => {
    
    Firebase.database().ref('/games/').once("value", (snapshot) => {
      if(snapshot.hasChildren()) {
        snapshot.forEach(async snap => {
          // Filter out doubles in ThisGame
          let updateThisGame = {};
          let temp_games = [];
          let temp_heroes = [];
          let temp_players = [];

          if (snap.val().hasOwnProperty('games')) {
            Object.keys(snap.val()['games']).map(key => temp_games.push(snap.val()['games'][key]));
            updateThisGame['/games/' + snap.key + '/games/'] = temp_games.filter((value, index, selfArray) => selfArray.indexOf(value) === index);

            if(temp_games.length === Object.keys(snap.val()['games']).length ){
              temp_games = [];
            }
          }

          if (snap.val().hasOwnProperty('heroes')) {
            Object.keys(snap.val()['heroes']).map(key => temp_heroes.push(snap.val()['heroes'][key]));
            updateThisGame['/games/' + snap.key + '/heroes/'] = temp_heroes.filter((value, index, selfArray) => selfArray.indexOf(value) === index);
            
            if(temp_heroes.length === Object.keys(snap.val()['heroes']).length ){
              temp_heroes = [];
            }
          }

          if (snap.val().hasOwnProperty('players')) {
            Object.keys(snap.val()['players']).map(key => temp_players.push(snap.val()['players'][key]));
            updateThisGame['/games/' + snap.key + '/players/'] = temp_players.filter((value, index, selfArray) => selfArray.indexOf(value) === index);

            if(temp_players.length === Object.keys(snap.val()['players']).length ){
              temp_players = [];
            }
          }

          if (temp_games.length > 0 || temp_heroes.length > 0 || temp_players.length > 0) {
            console.log("UPDATE THIS GAME", updateThisGame);

            await Firebase.database().ref().update(updateThisGame)
            .then(() => console.log("Updated!".green));
          }
        });
      }
    }, function (errorObject) {
      console.log("The read failed: ".red + errorObject.code);
      process.exit(1);
    }); 
  },
}
