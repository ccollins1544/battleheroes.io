import React, { createContext, useContext, useState, useEffect } from "react";
import UserContext from "./userContext";
import API from "./utils/API";
import Utils from "./utils";

const GameContext = React.createContext();
export const GameConsumer = GameContext.Consumer;

const GameProvider = ({ children }) => {
  const { userState, setUser } = useContext(UserContext);
  const [ gameState, setGameState ] = useState({});
  const [ ally, setAlly ] = useState(null); 
  const [ rival, setRival ] = useState(null);
  const [ players, setPlayers ] = useState([]); // used for listing players to challenge
  const [ pageContent, setPageContent ] = useState({}); // Page

  // =========================[ handleAttack ]=========================================
  const handleAttack = ({ game_id, ally_id, ally_hero_id, ally_hero_attack1_dmg, ally_hero_attack2_dmg }) => {
    let allAttacksArray = [ally_hero_attack1_dmg, ally_hero_attack2_dmg];
    let randomAttack = allAttacksArray[Math.floor(Math.random()*allAttacksArray.length)];
    let randomDamage = Utils.generateRandomNumber(randomAttack*0.70,randomAttack);
    return randomDamage;
  }

  // =========================[ updateGame ]=========================================
  const updateGame = (GAME_ID, GAME_STATUS, GAMES) => {
    let { loggedIn, user_id, username, game_status, game_id, games, selected_hero_id, selectedHero } = userState;
    
    // Data Validation 
    game_id = (GAME_ID) ? GAME_ID : game_id;
    if(GAME_STATUS){
      game_status = GAME_STATUS;
      setUser(prevState => ({...prevState, game_status: game_status })); 
      setAlly(prevState => ({...prevState, game_status: game_status }));
    }

    if(GAMES){
      games = GAMES;
      setUser(prevState => ({...prevState, games: games })); 
    }

    if(game_status !== 3 && gameState.hasOwnProperty('intervalId')){
      clearInterval(gameState.intervalId);
    }

    console.log("userState", userState);

    if(!game_id) return; 
    
    API.getGameById(game_id)
    .then(gameResponse => {
      console.log("gameResponse",gameResponse.data);
      let { true_rival } = gameResponse.data;
      setGameState(prevState => ({ ...prevState, true_rival: true_rival }));
      console.log("GAME STATE", gameState);

      if(!ally){

        console.log("updating ally");
        let { players, heroes, instigator_id, instigator_hero_id, instigator_hero_hp, turn_count } = gameResponse.data; 

        let allyData = {
          user_id: user_id,
          username: username,
          game_status: game_status,
          game_id: game_id,
          hero: instigator_hero_id, 
          hp: ((instigator_hero_hp / selectedHero.hp)*100), 
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

      console.log("?Rival", rival);
      if(!rival || rival.user_id === user_id ){
        let { players, heroes, rival_id, rival_hero_id, rival_hero_hp, turn_count } = gameResponse.data; 
        
        let rivalData = {
          user_id: rival_id,
          game_id: game_id,
          hero: rival_hero_id, 
          handleAttack: handleAttack
        }

        if( !rivalData.user_id || rivalData.user_id === user_id ){
          let rivalArray = players.filter(player => player !== user_id);
          rivalData.user_id = rivalArray[0];
        }

        console.log("Attempting to get Rival:", rivalData.user_id );

        if(!rivalData.user_id) return; 

        API.getUserById(rivalData.user_id)
        .then(rivalUserResponse => {
          API.getHeroById(rivalUserResponse.data.hero)
          .then(heroObj => (
            {
              ...rivalUserResponse.data, 
              selectedHero: heroObj.data,
              hp: ((rival_hero_hp / selectedHero.hp)*100),
              max_hp: heroObj.data.hp
            }
          ))
          .then(rivalMixedData => {
            setRival({...rivalData, ...rivalMixedData});
            setGameState(prevState => ({ ...prevState, 
              rival_id: rivalData.user_id,
              rival_hero_id: rivalData.hero,
              rival_hp: (rivalData.hp) ? rivalData.hp : rivalMixedData.hp
            }));
            console.log("!Rival", rival);
          });
        })
      }
    }); 

    if(game_status === 3) { 
      /*
      if(gameState.true_rival === userState.user_id){
        let TRUE_RIVAL = rival;
        let YOU = ally; 

        setRival(YOU);s
        setAlly(TRUE_RIVAL);
      } */

      if(checkWinCondition()){
        return;
      }

      console.log("game is in progress");
      updatePage({
        gameMessage: "The Battle Has Started!",
        buttonMessage: "Join Game",
        formID: "in_game_form"
      });
      
      return;
    }

    // Check for pending games
    let pendingGameID = [];
    if(games && game_id){
      pendingGameID = games.filter(game => game !== game_id );
    }

    if(pendingGameID.length > 0 && game_status < 2){
      console.log("PENDING GAME", pendingGameID);
      check_for_pending_games(pendingGameID[0]);
      
      return;
    }else if(game_status < 2) {
      updatePlayers(); 
      updatePage({
        gameMessage: "Search Challenge", 
        buttonMessage: "Send Invite", 
        formID: "challenge_player_form"
      });
      return; 
    }

    // --------------[ game_status = 2 is everything past this point ]----------------------------
    // Check if opponent accepted......
    check_if_opponent_accepted();
  };

  // =========================[ updatePlayers ]=====================================
  const updatePlayers = () => {

    API.searchChallenge().then( response => {
      console.log("Players", response.data);
      
      if(response.data.length <= 1){
        // Check for pending games
        check_for_pending_games();
      }

      setPlayers(response.data);

    });

  };

  // =========================[ updatePage ]=====================================
  const updatePage = ({ gameMessage, buttonMessage, formID }) => {
    setPageContent(prevState => ({...prevState, 
      gameMessage: gameMessage,
      buttonMessage: buttonMessage,
      formID: formID
    }));
  };

  // =========================[ check_for_pending_games ]========================
  const check_for_pending_games = ( pending_game_id ) => {

    if(!pending_game_id){ 
      let { game_id, user_id } = userState;

      API.getPendingRival({ games: game_id, my_id: user_id })
      .then(response => {
        console.log("pending rival response", response.data);
        if(response.data.length > 0){
          let rivalObj = response.data[0];
          setRival(prevState => ({...prevState, ...rivalObj,
            rival_id: rivalObj._id,
            rival_hero_id: rivalObj.hero,
            handleAttack: handleAttack
          }));

          API.getHeroById(rivalObj.hero)
          .then(heroObj => {
            // =========[ updateGame - Pending ]====================================
            console.log("BE MY HERO", heroObj.data);
            setRival(prevState => ({...prevState, 
              selectedHero: heroObj.data, 
              rival_hero_hp: heroObj.data.hp,
              handleAttack: handleAttack
            }));

            updatePage({
              gameMessage: "Pending Rival Response",
              buttonMessage: "Pending",
              formID: "pending_response_form"
            });

          });
          
          return; // because we are the one waiting for the response
        }else{
          // if you made it to here then you must have a pending game invite 
          API.getMyPendingGame({ games: game_id, my_id: user_id })
          .then(possibleGameResponse => {
            console.log("possibleGameResponse", possibleGameResponse.data);

            return API.getUserById(possibleGameResponse.data.instigator_id)
              .then(rivalUserResponse => ({...rivalUserResponse.data, game: possibleGameResponse.data}))
              .then(rivalObj => {
                return API.getHeroById(rivalObj.game.instigator_hero_id)
                .then(heroObj => (
                  {
                    ...rivalObj,
                    rival_id: rivalObj._id,
                    rival_hero_id: rivalObj.hero, 
                    rival_hero_hp: ((heroObj.data.hp / heroObj.data.hp)*100),
                    selectedHero: heroObj.data,
                    hp: ((heroObj.data.hp / heroObj.data.hp)*100),
                    max_hp: heroObj.data.hp,
                    handleAttack: handleAttack
                  }
                ));  
              });

          }).then(rivalObj => { console.log("rivalObj", rivalObj); 
            setRival(prevState => ({...prevState, rivalObj})); 

            updatePage({
              gameMessage: "You Have a Pending Game Invite",
              buttonMessage: "Accept?",
              formID: "accept_challenge_form"
            });
          })
          // }).then(rivalObj => setRival(rivalObj))
          .catch(error => (Utils.AlertMessage("Error: " + error, "danger")));
        }

      });   
    }else{

      let pendingGameID = [];
      if(userState.games && userState.game_id){
        pendingGameID = userState.games.filter(game => game !== userState.game_id );
      }

      API.getGameById( pendingGameID )
      .then(game => {
        return API.getUserById(game.data.instigator_id)
        .then(rivalUserResponse => ({...rivalUserResponse.data, game: game.data}))
        .then(rivalObj => {
          return API.getHeroById(rivalObj.game.instigator_hero_id)
          .then(heroObj => (
            {
                ...rivalObj, 
                rival_id: rivalObj._id,
                rival_hero_id: rivalObj.hero,
                rival_hero_hp: ((heroObj.data.hp / heroObj.data.hp)*100),
                selectedHero: heroObj.data,
                hp: ((heroObj.data.hp / heroObj.data.hp)*100),
                max_hp: heroObj.data.hp,
                handleAttack: handleAttack
            }
          ));  
        });
      }).then(rivalObj => { console.log("rivalObj", rivalObj); 
        setRival(prevState => ({...prevState, rivalObj})); 

        updatePage({
          gameMessage: "You Have a Pending Game Invite",
          buttonMessage: "Accept?",
          formID: "accept_challenge_form"
        });
      })
      // }).then(rivalObj => setRival(rivalObj))
      .catch(error => (Utils.AlertMessage("Error: " + error, "danger")));
    }
  }

  // =========================[ check_if_opponent_accepted ]========================
  const check_if_opponent_accepted = () => {
    let { game_id, user_id, selected_hero_id } = userState;
   
    API.getGameById(game_id)
    .then( game => {
      let { players, heroes } = game.data;
      let rivalArray = players.filter(player => player !== user_id );
      let rivalHeroArray = heroes.filter(hero => hero !== selected_hero_id );

      if(rivalArray.length > 0 && rivalHeroArray.length > 0){

        API.getUserById(rivalArray[0])
        .then(userResponse => ({...userResponse.data, hero: rivalHeroArray[0] }))
        .then(rivalObj => {
          return API.getHeroById(rivalObj.hero)
            .then(heroObj => ({...rivalObj, 
              rival_id: rivalObj._id,
              rival_hero_id: rivalObj.hero,
              rival_hero_hp: heroObj.data.hp,
              selectedHero: heroObj.data,
              handleAttack: handleAttack
            })); 
        }).then(rivalObj => { console.log("rivalObj", rivalObj); 
          setRival(prevState => ({...prevState, rivalObj})); 

          // =========[ updateGame - Ready? ]====================================
          updatePage({
            gameMessage: "Game Accepted!",
            buttonMessage: "Ready?",
            formID: "player_ready_form"
          });
        })
        // }).then(rivalObj => setRival(rivalObj))

        
      
      } else if (rivalHeroArray.length > 0){
        // =========[ updateGame - Ready? ]====================================
        updatePage({
          gameMessage: "Game Accepted!",
          buttonMessage: "Ready?",
          formID: "player_ready_form"
        });

      }else{

        updatePage({
          gameMessage: "Pending Rival Response",
          buttonMessage: "Pending",
          formID: "pending_response_form"
        });
      }
    });  
  }


  // =========================[ checkWinCondition ]=====================================
  const checkWinCondition = () => {
    let { rival_hp, ally_hp } = gameState;
  
    let { game_status, game_id } = userState;  
    if((rival_hp <= 0 || ally_hp <= 0) && game_status >= 3){
      setUser(prevState => ({...prevState, game_status: 0}));

      Utils.AlertMessage("GAME OVER", "info");

      updatePage({
        gameMessage: "Search Challenge", 
        buttonMessage: "Send Invite", 
        formID: "challenge_player_form"
      });

      if(gameState.hasOwnProperty('intervalId')){
        clearInterval(gameState.intervalId);
      }

      API.deleteGame(game_id);
      console.log("GAME OVER");
      return true;
    }

    console.log("In Progress...");
    return false;
  } 

  // =========================[ useEffect ]=========================================
  useEffect(() => {
    updateGame();
  }, []);

  return (
    <GameContext.Provider value={{
      gameState, 
      setGameState,
      updateGame,
      handleAttack,
      ally,
      setAlly,
      rival,
      setRival,
      players,
      updatePlayers,
      updatePage,
      pageContent,
      setPageContent,
    }} >
      {children}
    </GameContext.Provider>
  )
}

export { GameProvider, GameContext }
