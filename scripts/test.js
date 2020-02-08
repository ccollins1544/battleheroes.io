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

// Detect if you've been challenged.
db.User.find({
  '_id': "5e3e331909613652d03436b5",
},
{
  'active_game': 1,
  'games':1
}
).then(searchResponse =>{
  console.log(searchResponse);
  console.log(searchResponse[0].active_game);

  db.User.find({
    '_id': "5e3e325b09613652d03436b3",
    'games': searchResponse[0].active_game
  }).then(dbModel =>{
    if(dbModel.length === 0){
      console.log("You not in that game", dbModel);
    }else{
      console.log("You are in this game", dbModel);
    }
    process.exit(0);
  });

}).catch(err => {
  console.error(err);
  process.exit(1);
});

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