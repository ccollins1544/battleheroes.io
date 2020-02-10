import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import { GameContext } from "../gameContext";
import API from "../utils/API";
import Utils from "../utils/";
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
 
    console.log(event.target.id, formData);
  }
  
  // =========================[ useEffect ]=========================================
  useEffect(() => {
    // updatePage({
    //   gameMessage: "Search Challenge", 
    //   buttonMessage: "Send Invite", 
    //   formID: "challenge_player_form"
    // });
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mb-5">
          <h2>{pageContent.gameMessage}</h2>
        </Col>
        {ally && ally.hasOwnProperty('selectedHero') &&
          <Col size="lg-6">
            <HeroCard 
              id={ally.selectedHero._id}
              key={ally.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={ally.selectedHero.image}
              heading={ally.selectedHero.name}
              subtitle={ally.username.split("@")[0]}
              heroObject={ally.selectedHero}
              nohover={true}
              handleHeroClick={()=>{}}
            >
            </HeroCard>
          </Col>
        }
        {rival && rival.hasOwnProperty('selectedHero') ? ( // Load Rival
          <Col size="lg-6">
            <HeroCard 
              id={rival.selectedHero._id}
              key={rival.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={rival.selectedHero.image}
              heading={rival.selectedHero.name}
              subtitle={rival.username.split("@")[0]}
              heroObject={rival.selectedHero}
              nohover={true}
              handleHeroClick={()=>{ console.log(rival); }}
            />
          </Col>
        ) : ( // Load Players to challenge
          ally && ally.game_status < 2 && ally.hasOwnProperty('selectedHero') ? (<Col size="lg-6">
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
                <div className="col">
                  <label className="form-label" htmlFor="rival_id">Available Players:</label>
                  <select className="form-control form-control-sm" name="rival_id" id="rival_id">
                    {players.length > 1 ? players.map(i => {
                      return (i._id !== ally.user_id) && (
                        <option value={i._id}>{i.username.split("@")[0]}</option>
                        );
                      }) : (
                      <option value="">No Players Available</option>
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
        {rival && rival.hasOwnProperty('selectedHero') && (
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