const dotenv = require('dotenv').config('../.env');
let Firebase = require('firebase-admin');
let FbConfig = require("../config/firebase_certs.js");

if (!Firebase.apps.length) {
  Firebase.initializeApp({
    credential: Firebase.credential.cert(FbConfig.certs),
    databaseURL: process.env.FB_DB_URL
  });
}

module.exports = Firebase;
