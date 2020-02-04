const path = require('path');
module.exports = {
  User: require(path.join(__dirname, "user.js")),
  Chat: require(path.join(__dirname, "chat.js")),
  Heroes: require(path.join(__dirname, "heroes.js")), 
};
