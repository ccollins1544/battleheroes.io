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
  const { updateGame, gameState, setGameState, handleAttack, ally, setAlly, rival, setRival } = useContext(GameContext);
  
  const [ background, setBackground ] = useState(Utils.getBgStyle("battle"));
  const [ pageContent, setPageContent ] = useState({ 
    gameMessage: "Fight", 
    buttonMessage: "Attack", 
    buttonID: "attack_btn"
  });

  useEffect(() => {
    // let intervalId = setInterval(updateGame, 1200);
    // setGameState(prevState => ({ ...prevState, intervalId: intervalId }));
  }, []);

  let { game_id, user_id, selected_hero_id, selectedHero } = userState;
  let currentPlayer = {};
  let opposingPlayer = {};

  if(ally && user_id && user_id == ally.user_id){
    currentPlayer = ally;
    currentPlayer.team = "ally";

    opposingPlayer = rival;
    if(opposingPlayer){
      opposingPlayer.team = "rival";
    }
    
  } else if(rival && user_id && user_id == rival.user_id){
    currentPlayer = rival;
    currentPlayer.team = "rival";

    opposingPlayer = ally;
    
    if(opposingPlayer){
      opposingPlayer.team = "ally";
    }
  }

  console.log("<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>");
  console.log("currentPlayer", currentPlayer);
  console.log("Ally", ally);
  console.log("Rival", rival);
  console.log("opposingPlayer", opposingPlayer);
  console.log("<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>");

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <FullSectionRow id="main-section">
        {userState.loggedIn && userState.user_id && userState.game_id && (
          <Col size="lg-3">
            <Chat />
          </Col>
        )}
        
        {currentPlayer && currentPlayer.hasOwnProperty('selectedHero') && (
          <Col size="lg-4">
            <BattleCard 
              id={currentPlayer.user_id}
              key={currentPlayer.user_id}
              selectedHero={currentPlayer.selectedHero} 
              playerObj={currentPlayer}
              gameState={gameState}
              setGameState={setGameState}
              updateGame={updateGame}
              team={currentPlayer.team}
            /> 
          </Col>
        )}

        <Col size="sm-1" addClass="versus">
          <img src="img/vs2.png" title="versus" />
        </Col>

        {opposingPlayer && opposingPlayer.hasOwnProperty('selectedHero') && (
        <Col size="lg-4">
          <BattleCard 
            id={opposingPlayer.user_id}
            key={opposingPlayer.user_id}
            selectedHero={opposingPlayer.selectedHero} 
            playerObj={opposingPlayer}
            gameState={gameState}
            setGameState={setGameState}
            true_rival={opposingPlayer.user_id}
            updateGame={updateGame}
            team={opposingPlayer.team}
          /> 
        </Col>
        )}
        
      </FullSectionRow>
    </Wrapper>
  );
}

export default Battle;
