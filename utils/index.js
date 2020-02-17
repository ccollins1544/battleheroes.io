"use strict";

var fs = require("fs");
var path = require("path");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
let utils = {};

let exclude_files = [
  "Firebase.js",
]

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && exclude_files.includes(file) === false
    );
  })
  .forEach(function(file) {
    let f = require(path.join(__dirname, file));
    utils = {...utils, ...f };
  });

module.exports = utils;