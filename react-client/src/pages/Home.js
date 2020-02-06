import React, { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { SectionRow, Col } from "../components/Grid";
import AnimateTitle from "../components/AnimateTitle/AnimateTitle";
import HowTo from "../components/HowTo/Howto";

const Home = () => {
  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
          <AnimateTitle />
        </Col>
      </SectionRow>
      <HowTo />
    </Wrapper>
  );
};

export default Home;



