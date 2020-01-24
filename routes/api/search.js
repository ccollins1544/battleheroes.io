const router = require("express").Router();
const axios = require("axios");
const path = require("path");

require("dotenv").config({path: path.resolve(__dirname, '../../.env')});
const conf = require(path.resolve(__dirname, '../../conf.js'));

router.get("/:title", (req, res, next) =>{
  let queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + req.params.title + "&key=" + conf.credentials.api_key;
  console.log("queryURL",queryURL);
  axios.get(queryURL)
    .then(data => res.json(data.data))
    .catch(err => next(err));
})

module.exports = router;
