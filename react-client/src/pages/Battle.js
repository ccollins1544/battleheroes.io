import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import Chat from "../components/Chat";
import { FullSectionRow, Col } from "../components/Grid";
import BattleCard from "../components/BattleCard/BattleCard";
import {ProgressBarContainer} from "../components/ProgressBar/ProgressBar";
function Battle() {
  const { userState } = useContext(UserContext);

  const [background, setBackground] = useState({});
  useEffect(() => {
    setBackground(Utils.getBgStyle("battle"));
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <FullSectionRow id="main-section">
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
      </FullSectionRow>
    </Wrapper>
  );
}

export default Battle;
