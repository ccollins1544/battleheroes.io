/* ===============[ Connect to the MongoDB ]===============*/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = process.env.MONGODB_URI || "mongodb://localhost/battle_heroes";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { 
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
    console.log('Connected to Mongo');  
  },
  err => {
    /** handle initial connection error */ 
    console.log('error connecting to Mongo: ')
    console.log(err);     
  }
);

module.exports = mongoose.connection