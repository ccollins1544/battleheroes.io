import React, { useState } from "react";
import { Link } from "react-router-dom";
import "Join.css";
const Join = () => {
  const [user_id, setUserID] = useState("");
  const [game_id, setGameID] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder=""
            className="joinInput"
            type="text"
            onChange={event => setUserID(event.target.value)}
          ></input>
        </div>
        <div>
          <input
            placeholder=""
            className="joinInput"
            type="text"
            onChange={event => setGameID(event.target.value)}
          ></input>
        </div>
        <Link
          onClick={event => (!user_id || !game_id ? event.preventDefault() : null)}
          to={`/chat?user_id=${user_id}&game_id=${game_id}`}
        >
          <button className="button" type="submit">
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;