import React from "react";
import "./TextContainer.css";
import { useSpring, animated } from "react-spring";

import onlineIcon from "../../icons/onlineIcon.png";

const TextContainer = ({ users }) => {
  const fade = useSpring({
    from: { opacity: 0 },
    opacity: 1
  });

  return (
    <div className="textContainer">
      <div>
        <h1>
          Game Chat
          <span role="img" aria-label="emoji">
            💬
          </span>
        </h1>
        <h2>
          Battleheroes
          <span role="img" aria-label="emoji">
            ❤️
          </span>
        </h2>
        <h2>
          Try it out right now!{" "}
          <span role="img" aria-label="emoji">
            ⬅️
          </span>
        </h2>
      </div>
      {users ? (
        <animated.div style={fade}>
          <h1>People currently chatting:</h1>
          <div className="activeContainer">
            <h2>
              {users.map(({ name }) => (
                <div key={name} className="activeItem">
                  {name}
                  <img alt="Online Icon" src={onlineIcon} />
                </div>
              ))}
            </h2>
          </div>
        </animated.div>
      ) : null}
    </div>
  );
};

export default TextContainer;


