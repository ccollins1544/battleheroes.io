import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../userContext";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import InfoChat from "../InfoChat/";
import Input from "../Input";
import Messages from "../Messages";
import "./Chat.css";
let socket;

const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const HOST = process.env.HOST || "localhost"
const ENDPOINT = `http://${HOST}:${SOCKET_PORT}/`

const Chat = () => {
  const { userState } = useContext(UserContext);

  let location = useLocation();
  const [user_id, setUserID] = useState("");
  const [game_id, setGameID] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const { user_id , game_id } = userState;
    const user_id = userState.username.split('@')[0];
    const game_id = userState.game_id;
    
    socket = io(ENDPOINT);
    setGameID(game_id);
    setUserID(user_id);

    socket.emit('join', { user_id, game_id }, (error) => {
      if(error) {
        alert(error);
      }
    });

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('gameData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [messages])
  


  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <>
      <InfoChat game_id={game_id} />
      <Messages messages={messages} user_id={user_id} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
   </>
  );
};

export default Chat;



