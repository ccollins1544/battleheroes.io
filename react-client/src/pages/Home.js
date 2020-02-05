import React, { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { SectionRow, Col } from "../components/Grid";
import AnimateTitle from "../components/AnimateTitle/AnimateTitle";

const Home = () => {
  const [background, setBackground] = useState({});
  useEffect(() => {
    const bg_collection = [
      "/img/battle-bg1.gif",
      "/img/battle-bg2.webp",
      "/img/battle-bg3.webp",
      "/img/battle-bg4.webp",
      "/img/battle-bg5.webp",
      "/img/choose-hero-bg1.gif",
      "/img/choose-hero-bg2.gif",
      "/img/choose-hero-bg3.webp",
      "/img/choose-hero-bg4.webp",
      "/img/choose-hero-bg5.webp"
    ];

    let bg_url =
      bg_collection[Math.floor(Math.random() * bg_collection.length)];
    let bg_style = {
      backgroundImage: `url('${bg_url}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    };

    setBackground(bg_style);
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12">
          <AnimateTitle />
        </Col>
      </SectionRow>
    </Wrapper>
  );
};

export default Home;

//This a simple countdown animation that should be changed to a useSpring possibly countdown on battle page-->
//<Spring>
//  from{{ number : 10}}
//  to{{number: 0}}
//  config{{duration: 1000}}
//</Spring>
//
//
//style={props}
//style={counter}
//{props.number.toFixed()}
//<!---->
//<animated.h1 style={props}>Battle Heroes</animated.h1>

//const props = useSpring({
//  to: async (next, cancel) => {
//    await next({ opacity: 1, marginTop: "-30px", duration: "3000" });
//    await next({ opacity: 3, marginTop: "800px", duration: "3000" });
//    await next({ opacity: 5, marginTop: "500px", duration: "3000" });
//  },
//  from: { opacity: 0, marginTop: "50px" }
//});
