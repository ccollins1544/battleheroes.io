const http = require("http");
const socketio = require("socket.io");
        
const { addUser, removeUser, getUser, getUsersInGame } = require("./users");
const db = require("../models");

function SocketServer(express_app) {  
  const socket_server = http.createServer(express_app);
  const io = socketio(socket_server);

  // This enables CORs and ensures that our frontend, running on a different server can connect to our backend
  io.set("origins", "*:*"); 

  // whenever we receive a `connection` event our async function is then called 
  io.on("connection", async socket => {

    // a successful connection
    console.log("Client Successfully Connected");
    socket.on("join", ({ user_id, game_id }, callback) => {
      const { error, user } = addUser({ id: socket.id, user_id, game_id });

      if(error) return callback(error);

      socket.join(user.game_id);

      socket.emit('message', { user: 'admin', text: `${user.user_id}, welcome to game ${user.game_id}.`});
      socket.broadcast.to(user.game_id).emit('message', { user: 'admin', text: `${user.user_id} has joined!` });

      io.to(user.game_id).emit('gameData', { game_id: user.game_id, users: getUsersInGame(user.game_id) });

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.game_id).emit('message', { user: user.user_id, text: message });
      callback();
    })

    // this is referring to the connection that jus happened.
    socket.on("disconnect", function() {
      const user = removeUser(socket.id);

      if(user) {
        io.to(user.game_id).emit('message', { user: 'Admin', text: `${user.user_id} has left.` });
        io.to(user.game_id).emit('gameData', { game_id: user.game_id, users: getUsersInGame(user.game_id)});
      }
    });

  }); // Connection 

  return socket_server;
}

module.exports = SocketServer;
