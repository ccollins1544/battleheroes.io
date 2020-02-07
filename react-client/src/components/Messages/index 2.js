import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message.js";
import "./Messages.css";

const Messages = ({ messages, user_id, username }) => {
  
  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} user_id={user_id} username={username} />
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;
