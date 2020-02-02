import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../../userContext";
import API from "../../utils/API";
import queryString from "query-string";
import io from "socket.io-client";
import InfoChat from "../InfoChat/";
import Input from "../Input";
import Messages from "../Messages";
import TextContainer from "../TextContainer";
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
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { user_id , game_id } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    setGameID(game_id);
    setUserID(user_id)

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

  // let username = "anonymous";
  // if(user_id !== 0 || user_id !== undefined && userState.loggedIn !== user_id ){
  //   API.getUserById(user_id).then(res => username = res.data )
  // }else if (userState.loggedIn) {
  //   username = userState.username.split("@")[0];
  // }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoChat game_id={game_id} />
        <Messages messages={messages} user_id={user_id} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;



