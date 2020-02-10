require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");

const uri = process.env.MONGODB_URI || "mongodb://localhost/battle_heroes";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Mongo'),
  err => {
    console.log('error connecting to Mongo: ')
    console.log(err);     
  }
);


// update chris@ccollins.io
console.log("------ update chris@ccollins.io ------");
db.User.findOneAndUpdate({
  '_id': "5e40d74094db4a002a0aad6a",
}, {
  $set: {
    'games': [
      "5e40db1cd5ac2c002aec5684",
      "5e40db13d5ac2c002aec5683"
    ],
    'game_status': 3,
    'active_game': "5e40db13d5ac2c002aec5683",
    'hero': "5e40d6f093c53667c04d5b8e"
  }
},
{ new: true }
).then(userModel => {
  console.log(userModel);
  console.log("------ DONE ------");
  // process.exit(0);

}).catch(err => {
  console.error(err);
  // process.exit(1);
});

// update ccollins1544@gmail.com
console.log("------ update ccollins1544@gmail.com ------");
db.User.findOneAndUpdate({
  '_id': "5e40d75294db4a002a0aad6b",
}, 
{
  $set: {
    'games': ["5e40db13d5ac2c002aec5683"],
    'game_status': 3,
    'active_game': "5e40db13d5ac2c002aec5683",
    'hero': "5e40d6f093c53667c04d5b8c"
  }
},
{ new: true }
).then(userModel => {
  console.log(userModel);
  console.log("------ DONE ------");
  // process.exit(0);

}).catch(err => {
  console.error(err);
  // process.exit(1);
});

// update game for both users
console.log("------ update game for both users ------");
db.Game.findOneAndUpdate({
  '_id': "5e40db13d5ac2c002aec5683"
},
{
  $set: {
    'instigator_hero_hp': 100,
    'rival_hero_hp': 100,

    'players': [
      "5e40d75294db4a002a0aad6b",
      "5e40d74094db4a002a0aad6a"
    ],

    'heroes': [
      "5e40d6f093c53667c04d5b8c",
      "5e40d6f093c53667c04d5b8e"
    ],

    'instigator_id': "5e40d75294db4a002a0aad6b",
    'instigator_hero_id': "5e40d6f093c53667c04d5b8e",
    'rival_hero_id': "5e40d6f093c53667c04d5b8c",
    'rival_id': "5e40d74094db4a002a0aad6a",
    'player_turn': "5e40d75294db4a002a0aad6b",
    'turn_count': 0,
    'in_game': true,
  }
  },
  { new: true }
).then(gameModel => {
  console.log(gameModel);
  console.log("------ DONE ------");
  process.exit(0);

}).catch(err => {
  console.error(err);
  process.exit(1);
});