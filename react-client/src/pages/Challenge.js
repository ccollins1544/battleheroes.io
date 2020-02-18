import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import { GameContext } from "../gameContext";
import Firebase from "../Firebase";
import API from "../utils/API";
import Utils from "../utils";
import Wrapper from "../components/Wrapper";
import HeroCard from "../components/Card/heroCard";
import { SectionRow , Col } from "../components/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered } from "@fortawesome/pro-duotone-svg-icons";

const Challenge = () => {
  const [ background, setBackground ] = useState(Utils.getBgStyle);
  const { updateGame, handleAttack, ally, setAlly, rival, setRival, players, updatePlayers, updatePage, pageContent, setPageContent, setGameState } = useContext(GameContext);
  const { userState, setUser } = useContext(UserContext);

  // =========================[ handleFormSubmit ]=========================================
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let formData = {};

    let { game_id, games, user_id, selected_hero_id, selectedHero } = userState;

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

        }).catch(err => {
          console.log("Error sending the challenge");
          console.log(err);
          updateGame();
        });

        break;
      
      case "pending_response_form": // game_status >= 2 is for everything past this point
        // ASSUMES you are the ally
        updateGame();
      break;
    
      case "accept_challenge_form":
        // ASSUMES you are the rival
        // Check for pending games
        
        let newGames = games.filter((value, index, selfArray) => selfArray.indexOf(value) === index);
        let pendingGameID = newGames.filter(game => game !== game_id );

        if(!rival) {
          console.log("----fetching rival-------");
          updateGame();
          break;
        }

        formData.game_id = pendingGameID[0]; 
        formData.rival_id = (rival && rival.user_id) ? rival.user_id : user_id;
        formData.rival_hero_id = (rival && rival.selected_hero_id) ? rival.selected_hero_id : selected_hero_id;
        formData.rival_hero_hp = (rival && rival.selectedHero.hp) ? (rival.selectedHero.hp) : selectedHero.hp

        API.acceptGame(formData)
        .then(response => {
          console.log("accept_challenge_form", response.data);
          updateGame(formData.game_id, 2, newGames);
        });

        break;

      case "player_ready_form":
      case "in_game_form":
        formData.game_id = game_id; 
        formData.rival_id = ally.user_id;
        formData.rival_hero_id = (ally.selected_hero_id) ? ally.selected_hero_id : ally.selectedHero._id;
        formData.rival_hero_hp = ally.selectedHero.hp;
        formData.instigator_id = rival.user_id;
        formData.instigator_hero_id = (rival.selected_hero_id) ? rival.selected_hero_id : rival.selectedHero._id;
        formData.instigator_hero_hp = (rival.selectedHero.hp) ? rival.selectedHero.hp : ((rival.hp) ? rival.hp : 100);

        if(game_id) {
          API.readyGame(formData).then(response => {
            console.log("player_ready_form", response.data);
            updateGame(game_id, 3);
          });
        }else{ 
          Utils.AlertMessage("Not a valid game_id (" + game_id + ")", "danger");
        }

        setUser(prevState => ({...prevState, redirectTo: "/battle"}));

        if(userState.firebase_ref){
          let userData = {...userState, redirectTo: "/battle" };
          let firebase_game = {}
          Object.keys(userData).map(key=>firebase_game['/games/' + userState.firebase_ref + '/' + key] = userData[key]);
          Firebase.database().ref().update(firebase_game);
        }

        break;

      case "choose_hero_form":
        setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}));

        if(userState.firebase_ref){
          let userData = {...userState, redirectTo: "/choose-hero" };
          let firebase_game = {}
          Object.keys(userData).map(key=>firebase_game['/games/' + userState.firebase_ref + '/' + key] = userData[key]);
          Firebase.database().ref().update(firebase_game);
        }
        break;

      default:
        break; 
    }
 
    console.log(event.target.id, formData);
  }
  
  // =========================[ useEffect ]=========================================
  useEffect(() => {

  }, []);

  let { game_id, user_id, selected_hero_id, selectedHero } = userState;
  let currentPlayer = {};
  let opposingPlayer = {};

  if(ally && user_id && user_id == ally.user_id){
    currentPlayer = ally;
    opposingPlayer = rival;

  } else if(rival && user_id && user_id == rival.user_id){
    currentPlayer = rival;
    opposingPlayer = ally;
  }

  console.log("----------------------------------------");
  console.log("currentPlayer", currentPlayer);
  console.log("Ally", ally);
  console.log("Rival", rival);
  console.log("opposingPlayer", opposingPlayer);
  console.log("----------------------------------------");

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mb-5">
          <h2>{pageContent.gameMessage}</h2>
        </Col>
        {currentPlayer && currentPlayer.hasOwnProperty('selectedHero') && 
          <Col size="lg-6">
            <HeroCard 
              id={currentPlayer.selectedHero._id}
              key={currentPlayer.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={currentPlayer.selectedHero.image}
              heading={currentPlayer.selectedHero.name}
              subtitle={currentPlayer.username.split("@")[0]}
              heroObject={currentPlayer.selectedHero}
              nohover={true}
              handleHeroClick={()=>{}}
            >
            </HeroCard>
          </Col>
        }
        {opposingPlayer && opposingPlayer.hasOwnProperty('selectedHero') ? ( 
          <Col size="lg-6">
            <HeroCard 
              id={opposingPlayer.selectedHero._id}
              key={opposingPlayer.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={opposingPlayer.selectedHero.image}
              heading={opposingPlayer.selectedHero.name}
              subtitle={opposingPlayer.username.split("@")[0]}
              heroObject={opposingPlayer.selectedHero}
              nohover={true}
              handleHeroClick={()=>{ console.log(opposingPlayer); }}
            />
          </Col>
        ) : ( // Load Players to challenge
          currentPlayer && currentPlayer.game_status < 2 && currentPlayer.hasOwnProperty('selectedHero') ? (<Col size="lg-6">
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
                <div className="col">
                  <label className="form-label" htmlFor="rival_id">Available Players:</label>
                  <select className="form-control form-control-sm" name="rival_id" id="rival_id">
                    {players.length > 0 ? players.map(i => {
                      return (i.user_id !== currentPlayer.user_id) && (
                        <option value={i.user_id}>{i.username.split("@")[0]}</option>
                        );
                      }) : (
                      <option value="">No Players Online</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <button type="submit" className="btn btn-dark form-input mt-5" value="Submit" >
                  <FontAwesomeIcon icon={faFlagCheckered} /> {pageContent.buttonMessage}
                </button>
              </div>
            </form>
          </Col>) : (<Col size="lg-12">
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
                <button type="submit" className="btn btn-dark form-input mt-5" value="Submit" >
                  <FontAwesomeIcon icon={faFlagCheckered} /> {pageContent.buttonMessage}
                </button>
              </div>
            </form>
          </Col>
          )
        )}
        {opposingPlayer && opposingPlayer.hasOwnProperty('selectedHero') && (
          <Col size="lg-6" addClass="mx-auto m-5">
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
                <button type="submit" className="btn btn-dark form-input" value="Submit" >
                  <FontAwesomeIcon icon={faFlagCheckered} /> {pageContent.buttonMessage}
                </button>
              </div>
            </form>
          </Col>
        )}
      </SectionRow>
    </Wrapper>
  );
}

export default Challenge;