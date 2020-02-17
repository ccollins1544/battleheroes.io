import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
// import { GameContext } from "../gameContext";
import API from "../utils/API";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import Game from "../components/Game"

const Challenge = () => {
  const [ background, setBackground ] = useState(Utils.getBgStyle);
  // const { updateGame, handleAttack, ally, setAlly, rival, setRival, players, updatePlayers, updatePage, pageContent, setPageContent, setGameState } = useContext(GameContext);
  const { userState, setUser } = useContext(UserContext);
  // const [ game_id, setGameID ] = useState("");

  // =========================[ handleFormSubmit ]=========================================
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let formData = {};

    /*
    switch (event.target.id) {
      case "challenge_player_form":
        formData = Utils.getFormData(event.target.id);
        formData.active_game = ally.game_id;
        formData.instigator_id = ally.user_id; 
        formData.from_email = ally.username;

        API.sendChallenge(formData)
        .then(response => {
          console.log("challenge_player_form", response.data);
          updateGame(formData.active_game, response.data.game_status);
          updatePage({
            gameMessage: "Pending Rival Response",
            buttonMessage: "Pending",
            formID: "pending_response_form"
          });
        });
        
        break;
      
      case "pending_response_form": // game_status >= 2 is for everything past this point
        updateGame();
      break;
    
      case "accept_challenge_form":
        // Check for pending games
        rival.active_game = (rival.active_game) ? rival.active_game : rival.game_id;
        if(!rival.active_game){
          let { game_id, games } = userState;
          let pendingGameID = [];
          pendingGameID = games.filter(game => game !== game_id );
          rival.active_game = (pendingGameID.length > 0) ? pendingGameID[0] : rival.active_game;
        }

        if(!rival.active_game) {
          console.log("!rival.active_game && !rival.game_id ["+rival.active_game+"]");
          updateGame();
          break;
        }

        let newGames = [
          ally.game_id,
          rival.active_game
        ];

        formData.game_id = rival.active_game; 
        formData.rival_id = (ally.user_id) ? ally.user_id : ally._id;
        formData.rival_hero_id = (ally.selected_hero_id) ? ally.selected_hero_id : ally.selectedHero._id;
        formData.rival_hero_hp = ally.selectedHero.hp;
        formData.true_rival = (ally.user_id) ? ally.user_id : ally._id;

        API.acceptGame(formData)
        .then(response => {
          console.log("accept_challenge_form", response.data);
          newGames = newGames.filter(game => game != null )
          updateGame(formData.game_id, 2, newGames);
        });

        break;

      case "player_ready_form":
      case "in_game_form":
        formData.game_id = ally.game_id; 
        formData.rival_id = ally.user_id;
        formData.rival_hero_id = (ally.selected_hero_id) ? ally.selected_hero_id : ally.selectedHero._id;
        formData.rival_hero_hp = ally.selectedHero.hp;
        formData.instigator_id = rival.user_id;
        formData.instigator_hero_id = (rival.selected_hero_id) ? rival.selected_hero_id : rival.selectedHero._id;
        formData.instigator_hero_hp = (rival.selectedHero.hp) ? rival.selectedHero.hp : ((rival.hp) ? rival.hp : 100);

        if(ally.game_id) {
          API.readyGame(formData).then(response => {
            console.log("player_ready_form", response.data);
            updateGame(ally.game_id, 3);
          });
        }else{ 
          Utils.AlertMessage("Not a valid game_id (" + ally.game_id + ")", "danger");
        }

        setUser(prevState => ({...prevState, redirectTo: "/battle"}));

        break;

      case "choose_hero_form":
        setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}));
        break;

      default:
        break; 
    }
    */
 
    console.log(event.target.id, formData);
  }
  
  // =========================[ useEffect ]=========================================
  // useEffect(() => {
  //   console.log("userState DAMMIT", userState);
  //   let { active_game } = userState;
  //   console.log('ACTIVAAAAAAAAAAAAAAA', active_game);
  //   setGameID(active_game);
  // }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      {userState.loggedIn && userState.hasOwnProperty('active_game') && (
        <Game 
          id={userState.active_game}
          key={userState.active_game}
          pageContent={{
            gameMessage: "Search Challenge", 
            buttonMessage: "Send Invite", 
            formID: "challenge_player_form"
          }}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </Wrapper>
  );
}

export default Challenge;