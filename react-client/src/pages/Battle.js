import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import { GameContext } from "../gameContext";
import Utils from "../utils/";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import Chat from "../components/Chat";
import { FullSectionRow, Col } from "../components/Grid";
import BattleCard from "../components/BattleCard/BattleCard";

const Battle = () => {
  // =========================[ useEffect ]=========================================
  const { userState } = useContext(UserContext);
  const { gameState, setGameState, handleAttack, ally, setAlly, rival, setRival } = useContext(GameContext);
  
  const [ background, setBackground ] = useState(Utils.getBgStyle("battle"));
  const [ pageContent, setPageContent ] = useState({ 
    gameMessage: "Fight", 
    buttonMessage: "Attack", 
    buttonID: "attack_btn"
  });

  // useEffect(() => {
  // }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <FullSectionRow id="main-section">
        {userState.loggedIn && userState.user_id && userState.game_id && (
          <Col size="lg-3">
            <Chat />
          </Col>
        )}
        
        {ally && ally.selectedHero && (
          <Col size="lg-4">
            <BattleCard 
              id={ally.user_id}
              key={ally.user_id}
              selectedHero={ally.selectedHero} 
              playerObj={ally}
              gameState={gameState}
              setGameState={setGameState}
              team="ally"
            /> 
          </Col>
        )}

        <Col size="sm-1" addClass="versus">
          <img src="img/vs2.png" title="versus" />
        </Col>

        {rival && rival.selectedHero && (
        <Col size="lg-4">
          <BattleCard 
            id={rival.user_id}
            key={rival.user_id}
            selectedHero={rival.selectedHero}
            playerObj={rival}
            gameState={gameState}
            setGameState={setGameState}
            team="rival"
          /> 
        </Col>
        )}
        
      </FullSectionRow>
    </Wrapper>
  );
}

export default Battle;
