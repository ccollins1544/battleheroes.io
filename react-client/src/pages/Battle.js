import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import Wrapper from "../components/Wrapper";
import Chat from "../components/Chat";
import { SectionRow, Col } from "../components/Grid";
import BattleCard from "../components/BattleCard/BattleCard";

function Battle() {
  const { userState } = useContext(UserContext);

  const [background, setBackground] = useState({});
  useEffect(() => {
    const bg_collection = [
      "/img/battle-bg1.gif",
      "/img/battle-bg2.webp",
      "/img/battle-bg3.webp",
      "/img/battle-bg4.webp",
      "/img/battle-bg5.webp"
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
        <Col size="lg-3" addClass="chatbox">
          {userState.loggedIn && userState.user_id && userState.game_id && (
            <Chat />
          )}
        </Col>
        <Col size="lg-4">
        {userState.selectedHero && <BattleCard selectedHero={userState.selectedHero} /> }
        </Col>
        <Col size="sm-1" addClass="versus">
          <img src="img/vs2.png" title="versus" />
        </Col>
        <Col size="lg-4">
          <BattleCard />
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default Battle;
