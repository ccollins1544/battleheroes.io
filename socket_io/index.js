const http = require("http");
const io = require("socket.io");
const db = require("../models");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

function SocketServer(express_app) {
  const socket_server = http.createServer(express_app);
  const io = socket.io(socket_server);

  // This enables CORs and ensures that our frontend,
  // running on a different server can connect to our backend
  io.set("origins", "*:*");

  // whenever we receive a `connection` event
  // our async function is then called
  // io.on("connection", async (socket: any) => {
  io.on("connection", async socket => {
    // let token = socket.handshake.query.token;

    // we should see this printed out whenever we have
    // a successful connection
    console.log("Client Successfully Connected");
    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

        socket.emit("message", { user: "admin", text: `${user.name}, welcome to the room ${user.room}`  });
        // broadcast send message to everyone except the user that sent and the .to is to specify a room
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name}, has joined.!`})
        // built in socket join that joins user to room
        socket.join(user.room);

        io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room)})

        callback();

    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      // these would be used to pass down messages to chat component
      io.to(user.room).emit("message", { user: user.name, text: message});
      io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room)})

      callback();
    })
    // this is referring to the connection that jus happened.
    socket.on("disconnect", function() {
      const user = removeUser(socket.id);
      if(user) {
        io.to(user.room).emit("message", { user: "admin", text: `${user.name} has left the chat`})
      }
    });

    //Someone is typing
    socket.on("typing", data => {
      socket.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
    });

    //when someone stops typing
    socket.on("stopTyping", () => {
      socket.emit("notifyStopTyping");
    });

    socket.on("chat", chatData => {
      //broadcast message to everyone in port:5000 except yourself.
      socket.emit("chat received", chatData);

      let chatMessage = new db.Chat({ message: message, sender: sender });
      chatMessage.save().catch(err => console.log(err));
    });

    socket.on("all chat", chatData => {
      //broadcast message to everyone in port:5000 except yourself.
      socket.emit("all received", chatData);
    });


    });
  });

  return socket_server;
}

module.exports = SocketServer;




