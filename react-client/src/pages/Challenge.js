import React, { useState, useEffect } from "react";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Challenge() {
  
  const [ background, setBackground ] = useState({});
  useEffect(() => {
    const bg_collection = [
      '/img/battle-bg1.gif',
      '/img/battle-bg2.webp',
      '/img/battle-bg3.webp',
      '/img/battle-bg4.webp',
      '/img/battle-bg5.webp',
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
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12">
          <h1>Challenge</h1>
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default Challenge;