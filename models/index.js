const path = require('path');
module.exports = {
  User: require(path.join(__dirname, "user.js")),
  Chat: require(path.join(__dirname, "chat.js")),
  Heroes: require(path.join(__dirname, "heroes.js")), 
  Game: require(path.join(__dirname, "game.js")), 
  game_status: require(path.join(__dirname, "game_status.js")), 
  user_groups: require(path.join(__dirname, "user_groups.js")), 
};
