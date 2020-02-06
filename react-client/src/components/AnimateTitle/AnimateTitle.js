import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";
function AnimateTitle() {
  const ref = useRef([]);
  const [items, set] = useState([]);
  const transitions = useTransition(items, null, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: "perspective(600px) rotateX(0deg)",
      color: "#8fa5b6"
    },
    enter: [
      { opacity: 1, height: 100, innerHeight: 100 },
      { transform: "perspective(600px) rotateX(180deg)", color: "#28d79f" },
      { transform: "perspective(600px) rotateX(0deg)" }
    ],
    leave: [
      { color: "#c23369" },
      { innerHeight: 0 },
      { opacity: 0, height: 0 }
    ],
    update: { color: "#28b4d7" }
  });
  const reset = useCallback(() => {
    ref.current.map(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(
      setTimeout(
        () => set(["Welcome To", "The Best Retro RPG Game On The Web"]),
        2000
      )
    );
    ref.current.push(setTimeout(() => set(["Battle Heroes"]), 5000));
    ref.current.push(setTimeout(() => set(["Battle Heroes"]), 8000));
  }, []);

  useEffect(() => void reset(), []);

  return (
    <div>
      {transitions.map(({ item, props: { innerHeight, ...rest }, key }) => (
        <animated.div
          className="transitions-item"
          key={key}
          style={rest}
          onClick={reset}
        >
          <animated.h1
            className="text-danger"
            style={{ overflow: "hidden", height: innerHeight }}
          >
            {item}
          </animated.h1>
        </animated.div>
      ))}
    </div>
  );
}

export default AnimateTitle;
