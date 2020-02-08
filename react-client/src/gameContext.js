import React, { createContext, useContext, useState, useEffect } from "react";
import UserContext from "./userContext";
import API from "./utils/API";
import Utils from "./utils/";

const defaultGameState = {
  ally_hp: 0,
  rival_hp: 0
}

const defaultRivalState = {
  hp: 0
}

const defaultAllyState = {
  hp: 0
}

const GameContext = React.createContext();
export const GameConsumer = GameContext.Consumer;

const GameProvider = ({ children }) => {
  const { userState } = useContext(UserContext);
  const [ gameState, setGameState ] = useState({});
  const [ ally, setAlly ] = useState(null);
  const [ rival, setRival ] = useState(null);

  // =========================[ handleAttack ]=========================================
  const handleAttack = ({ game_id, ally_id, ally_hero_id, ally_hero_attack1_dmg, ally_hero_attack2_dmg }) => {
    let allAttacksArray = [ally_hero_attack1_dmg, ally_hero_attack2_dmg];
    let randomAttack = allAttacksArray[Math.floor(Math.random()*allAttacksArray.length)];
    let randomDamage = Utils.generateRandomNumber(randomAttack*0.70,randomAttack);

    // setGameState(prevState => ({...prevState,
    //   rival_hp: gameState.rival_hp > 0 ? gameState.rival_hp - (randomDamage || 20) : 0
    // }));
    // console.log("Rival", rival);
    // console.log("gameState", gameState);

    // setRival(prevState => ({...prevState, 
    //   hp: rival.hp > 0 ? rival.hp - (randomDamage || 20) : 0
    // }));

    return randomDamage;
  }

  // =========================[ updateGame ]=========================================
  const updateGame = () => {
    let { user_id, username, game_id, selectedHero } = userState;

    console.log("userState", userState);
    
    API.getGameById(game_id)
    .then(gameResponse => {
      if(!ally){

        console.log("updating ally");
        let { players, heroes, instigator_id, instigator_hero_id, instigator_hero_hp, turn_count } = gameResponse.data; 

        let allyData = {
          user_id: user_id,
          username: username,
          game_id: game_id,
          hero: instigator_hero_id, 
          hp: instigator_hero_hp,
          selectedHero: selectedHero,
          max_hp: selectedHero.hp,
          handleAttack: handleAttack
        };

        if( !allyData.selectedHero && allyData.hero ){
          API.getHeroById(allyData.hero)
          .then(heroObj => ({...allyData, 
            selectedHero: heroObj.data,
            max_hp: heroObj.data.hp
          }))
          .then(allyData => {
            setAlly(allyData);
            setGameState(prevState => ({ ...prevState, ally_hp: allyData.hp }));
          });
        }else{
          setAlly(allyData);
          setGameState(prevState => ({ ...prevState, ally_hp: allyData.hp }));
          console.log("!Ally", ally);
        }

      }

      if(!rival){
        let { players, heroes, rival_id, rival_hero_id, rival_hero_hp, turn_count } = gameResponse.data; 
        
        let rivalData = {
          user_id: rival_id,
          game_id: game_id,
          hero: rival_hero_id, 
          hp: rival_hero_hp,
          handleAttack: handleAttack
        }

        if( !rivalData.user_id ){
          let rivalArray = players.filter(player => player !== user_id);
          rivalData.user_id = rivalArray[0];
        }

        API.getUserById(rivalData.user_id)
        .then(rivalUserResponse => {
          API.getHeroById(rivalData.hero)
          .then(heroObj => (
            {
              ...rivalUserResponse.data, 
              selectedHero: heroObj.data,
              max_hp: heroObj.data.hp
            }
          ))
          .then(rivalMixedData => {
            setRival({...rivalData, ...rivalMixedData});
            setGameState(prevState => ({ ...prevState, rival_hp: rivalData.hp }));
            console.log("!Rival", rival);
          });
        })

      }
    });
  };
  
  // =========================[ useEffect ]=========================================
  useEffect(() => {
    // setGameState({ ...defaultGameState });
    // setRival({...defaultRivalState });
    // setAlly({...defaultAllyState });

    updateGame();
  }, []);

  return (
    <GameContext.Provider value={{
      gameState, 
      setGameState,
      handleAttack,
      ally,
      setAlly,
      rival,
      setRival
    }} >
      {children}
    </GameContext.Provider>
  )
}

export { GameProvider, GameContext }

// export default gameContext;
// export { gameProvider };
