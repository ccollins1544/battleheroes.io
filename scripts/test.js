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
  '_id': "5e3bb3150a31ad6f8cc52769",
},
{
  'active_game': 1,
  'games':1
}
).then(searchResponse =>{
  console.log(searchResponse);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});