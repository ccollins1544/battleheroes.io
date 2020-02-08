import React, { useState, useEffect } from "react";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import { SectionRow, Col } from "../components/Grid";
import AnimateTitle from "../components/AnimateTitle/AnimateTitle";
import HowTo from "../components/HowTo/Howto";

const Home = () => {
  const [background, setBackground] = useState(Utils.getBgStyle("home"));

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12">
          <AnimateTitle />
        </Col>
      </SectionRow>
      <SectionRow>
        <HowTo />
      </SectionRow>
    </Wrapper>
  );
};

export default Home;
