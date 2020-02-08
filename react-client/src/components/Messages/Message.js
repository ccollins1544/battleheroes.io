import React from "react";
import ReactEmoji from "react-emoji";
//import "./Messages2.css";
// message used to actually display message to user destructuring the object that had message
const Message = ({ message: { user, text }, user_id, username }) => {
  let isSentByCurrentUser = false;

  const trimmedName = username === "anonymous" || username === undefined ? user_id : username.trim().toLowerCase();

  if (user === user_id) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
