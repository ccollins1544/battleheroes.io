import axios from "axios";
import openSocket from "socket.io-client";
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const HOST = process.env.HOST || "localhost"
const socket_url = `http://${HOST}:${SOCKET_PORT}/`
const socket = openSocket(socket_url);

const sendChat = (chatData) => {
  socket.emit("chat", chatData);
}

const chatListener = (cb) => {
  if(typeof cb !== 'function'){
    cb = () => {};
  }

  socket.on("chat received", chatData => {
    let { message, sender } = chatData;
    console.log("chat received from " + sender + ": " + message);
    cb(chatData);
  });
}

const sendAllChat = (chatData) => {
  socket.emit("all chat", chatData);
}

const allChatListener = (cb) => {
  if(typeof cb !== 'function'){
    cb = () => {};
  }

  socket.on("all received", chatData => {
    let { message, sender } = chatData;
    console.log("all received from " + sender + ": " + message);
    cb(chatData);
  });
}

//isTyping event
const isTyping = (messageInput, user="Someone") => {
  messageInput.addEventListener("keypress", () => {
    socket.emit("typing", { sender: user, message: "is typing..." });
  });

  //stop typing
  messageInput.addEventListener("keyup", () => {
    socket.emit("stopTyping", "");
  });
}

const notifyTyping = (chatData, cb) => {
  if(typeof cb !== 'function'){
    cb = (d) => {};
  }

  socket.on("notifyTyping", chatData => cb(chatData));
}

const notifyStopTyping = (cb) => {
  if(typeof cb !== 'function'){
    cb = () => {};
  }

  socket.on("notifyStopTyping", () => cb());
}

export { sendChat, chatListener, sendAllChat, allChatListener, isTyping, notifyTyping, notifyStopTyping};