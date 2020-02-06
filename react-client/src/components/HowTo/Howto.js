import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

const HowTo = () => {
  const [isToggled, setToggle] = useState(false);
  const fade = useSpring({
    opacity: isToggled ? 1 : 0,
    transform: isToggled ? "translate3d(0,0,0)" : "translate3d(0,-100px,0)"
  });

  return (
    <div>
      <animated.p className="animatedHowTo" style={fade}>
        To begin sign up or log in and choose a hero and get to battling. You
        then can challenge anyone available to enter a game. Once the countdown
        clock ends you choose an attack and begin the battle good luck!!
      </animated.p>
      <button onClick={() => setToggle(!isToggled)}>
        How To Play Battle Heroes
      </button>
    </div>
  );
};

export default HowTo;
