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


db.User.find({
  '_id': "5e3b567f684e2d21d81f80a4",
  'games': "5e3b59ac19e72833a440d1b0"
  // 'games': "5e3b5683684e2d21d81f80a5"
}).then(wasStarted =>{
  console.log(wasStarted);
  console.log(wasStarted.length);
  if(wasStarted.length > 0){
    console.log("Game was Started");
  }else{
    console.log("Game Not Started");
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});