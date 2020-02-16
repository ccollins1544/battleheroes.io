import React, { createContext, useContext, useState, useEffect } from "react";
import UserContext from "./userContext";
import Firebase from "./Firebase";
import API from "./utils/API";
import Utils from "./utils/";

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
  const updateGame = () => {
    let { firebase_ref, loggedIn, user_id, username, game_status, game_id, games, selected_hero_id, selectedHero } = userState;
    
    // Update Players
    let online_players = [];
    Firebase.database().ref('/games/').on("value", (snapshot) => {
      if(snapshot.numChildren() <= 1 ){
        return;
      }

      online_players = [];
      snapshot.forEach( snap => {
        if(snap.val().hasOwnProperty("username")){
          if(snap.val()['username'] !== username) {
            online_players.push(snap.val());
          }
        }
      });

      setPlayers(online_players);
      console.log("onlinePlayers", online_players);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }); // END Firebase.database().ref('/games').once('value', (snapshot) => {)

    // Update Game
    if(firebase_ref !== undefined){

      let gameRef = Firebase.database().ref('/games/' + firebase_ref);
      gameRef.on("value", (snapshot) => {
        if (snapshot.numChildren() === 0) {
          return;
        }

        let { players, heroes, turn_count, in_game,
          instigator_id, instigator_hero_id, instigator_hero_hp, 
          rival_id, rival_hero_id, rival_hero_hp } = snapshot;
        
        // ------[ ALLY ]-----------------------------
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
        }

        if( !allyData.selectedHero && allyData.hero ){
          API.getHeroById(allyData.hero)
          .then(heroObj => ({...allyData, 
            hp: ((heroObj.data.hp / heroObj.data.hp )*100), 
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

        // ------[ RIVAL ]-----------------------------
        let rivalData = {
          user_id: rival_id,
          game_id: game_id,
          hero: rival_hero_id, 
          handleAttack: handleAttack
        }

        if(players !== undefined && (!rivalData.user_id || rivalData.user_id === user_id)){
          let rivalArray = players.filter(player => player !== user_id);
          rivalData.user_id = rivalArray[0];
        }

        console.log("Attempting to get Rival:", rivalData.user_id );

        if(rivalData.user_id !== undefined){
          API.getUserById(rivalData.user_id)
          .then(rivalUserResponse => {
            API.getHeroById(rivalUserResponse.data.hero)
            .then(heroObj => (
              {
                ...rivalUserResponse.data, 
                hp: ((heroObj.data.hp / heroObj.data.hp )*100), 
                selectedHero: heroObj.data,
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

        // ------[ GAME STATUS ]-----------------------------
        switch (game_status) {
          case 1:
            // Check for pending games
            let pendingGameID = [];
            if(games && game_id){
              pendingGameID = games.filter(game => game !== game_id );
            }

            if(pendingGameID.length > 0){
              console.log("PENDING GAME", pendingGameID);
              check_for_pending_games(pendingGameID[0]);
            }else{
              updatePage({
                gameMessage: "Search Challenge", 
                buttonMessage: "Send Invite", 
                formID: "challenge_player_form"
              });
            }
            
            break;
          
          case 2:
            check_if_opponent_accepted();
            break;

          case 3: 
            if(checkWinCondition()){
              return;
            }
    
            console.log("game is in progress");
            updatePage({
              gameMessage: "The Battle Has Started!",
              buttonMessage: "Join Game",
              formID: "in_game_form"
            });
          
            break;

          default: // game_status = 0 
            updatePage({
              gameMessage: "It looks like you still need to choose a hero.",
              buttonMessage: "Choose Hero",
              formID: "choose_hero_form"
            });
            break;
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  } // END updateGame

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
  
    let { game_status, game_id, firebase_ref } = userState;  
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

      if(firebase_ref){
        let userData = {...userState, 
          game_status: 0,
          game_id: null,
          games: [],
          heroes: [],
          players: [],
          in_game: false,
          turn_count: 0,
          player_turn: null,
          rival_id: null,
          rival_hero_id: null,
          rival_hero_hp: 0,
        };
        let firebase_game = {}
        Object.keys(userData).map(key=>firebase_game['/games/' + firebase_ref + '/' + key] = userData[key]);
        Firebase.database().ref().update(firebase_game);
      }

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
      updatePage,
      pageContent,
      setPageContent,
    }} >
      {children}
    </GameContext.Provider>
  )
}

export { GameProvider, GameContext }
