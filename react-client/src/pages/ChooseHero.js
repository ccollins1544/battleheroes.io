import React, { useState, useEffect } from "react";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import { SectionRow } from "../components/Grid";
import Hero from "../components/Hero/"

const ChooseHero = () => {
  const [ background, setBackground ] = useState(Utils.getBgStyle("choose_hero"));
  // useEffect(() => {
  //   setBackground(Utils.getBgStyle("choose_hero"));
  //   return; 
  // }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Hero />
      </SectionRow>
    </Wrapper>
  );
}

export default ChooseHero;