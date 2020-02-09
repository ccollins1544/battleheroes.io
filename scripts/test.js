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
