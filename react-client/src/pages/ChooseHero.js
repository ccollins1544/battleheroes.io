import React, { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import Hero from "../components/Hero/"

const ChooseHero = () => {
  const [ background, setBackground ] = useState({});
  useEffect(() => {
    const bg_collection = [
      '/img/choose-hero-bg1.gif',
      '/img/choose-hero-bg2.gif',
      '/img/choose-hero-bg3.webp',
      '/img/choose-hero-bg4.webp',
      '/img/choose-hero-bg5.webp',
    ];

    let bg_url = bg_collection[Math.floor(Math.random()*bg_collection.length)];
    let bg_style = {
      backgroundImage: `url('${bg_url}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }

    setBackground(bg_style);
    return; 
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Hero />
      </SectionRow>
    </Wrapper>
  );
}

export default ChooseHero;