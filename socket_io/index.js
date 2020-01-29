
const db = require("../models");

function SocketServer(express_app){
  const socket_server = require("http").createServer(express_app); 
  const io = require("socket.io")(socket_server);

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
    // console.log("token", token);

    socket.on("disconnect", function() {
      console.log("user disconnected");
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

    // we then send out a new message to the
    // `chat` channel with "Hello World"
    // Our clientside should be able to see
    // this and print it out in the console
    socket.emit("all received", { message: "operations online...", sender: "server"});
  });
  
  return socket_server;
}

module.exports = SocketServer;