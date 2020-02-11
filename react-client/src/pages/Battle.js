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
    let intervalId = setInterval(updateGame, 1200);
    setGameState(prevState => ({ ...prevState, intervalId: intervalId }));
  }, []);

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
            {/* <BattleCard 
              id={rival && ally && (gameState.true_rival === rival.user_id ? rival.user_id : ally.user_id)}
              key={rival && ally && (gameState.true_rival === rival.user_id ? rival.user_id : ally.user_id)}
              selectedHero={rival && (gameState.true_rival === rival.user_id ? rival.selectedHero : ally.selectedHero)} 
              playerObj={rival && (gameState.true_rival === rival.user_id ? rival : ally)}
              OtherPlayerObj={rival && (gameState.true_rival === rival.user_id ? ally : rival)}
              gameState={gameState}
              setGameState={setGameState}
              true_rival={rival && (rival.user_id)}
              team={rival && (gameState.true_rival === rival.user_id ? "rival" : "ally")}
            />  */}
            <BattleCard 
              id={ally && ally.user_id}
              key={ally && ally.user_id}
              selectedHero={ally && ally.selectedHero} 
              playerObj={ally && ally}
              gameState={gameState}
              setGameState={setGameState}
              true_rival={rival && rival.user_id}
              updateGame={updateGame}
              team="ally"
            /> 
          </Col>
        )}

        <Col size="sm-1" addClass="versus">
          <img src="img/vs2.png" title="versus" />
        </Col>

        {rival && rival.selectedHero && (
        <Col size="lg-4">
          {/* <BattleCard 
            id={rival && ally.user_id && (gameState.true_rival === rival.user_id ? ally.user_id : rival.user_id)}
            key={rival && ally.user_id && (gameState.true_rival === rival.user_id ? ally.user_id : rival.user_id)}
            selectedHero={rival && (gameState.true_rival === rival.user_id ? ally.selectedHero : rival.selectedHero)} 
            playerObj={rival && (gameState.true_rival === rival.user_id ? ally : rival)}
            OtherPlayerObj={rival && (gameState.true_rival === rival.user_id ? rival : ally)}
            gameState={gameState}
            setGameState={setGameState}
            true_rival={rival && (rival.user_id)}
            team={rival && (gameState.true_rival === rival.user_id ? "ally" : "rival")}
          />  */}
          <BattleCard 
            id={rival && rival.user_id}
            key={rival && rival.user_id}
            selectedHero={rival && rival.selectedHero} 
            playerObj={rival && rival}
            gameState={gameState}
            setGameState={setGameState}
            true_rival={rival && rival.user_id}
            updateGame={updateGame}
            team="rival"
          /> 
        </Col>
        )}
        
      </FullSectionRow>
    </Wrapper>
  );
}

export default Battle;
