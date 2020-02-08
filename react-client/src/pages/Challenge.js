import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import API from "../utils/API";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import HeroCard from "../components/Card/heroCard";
import { SectionRow , Col } from "../components/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered } from "@fortawesome/pro-duotone-svg-icons";

const Challenge = () => {
  // =========================[ handleFormSubmit ]=========================================
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let game_id = userState.game_id ? userState.game_id : (userState.games.length > 0 ? userState.games[0] : null);
    let formData = {};

    switch (event.target.id) {
      case "challenge_player_form":
        formData = Utils.getFormData(event.target.id);
        formData.active_game = game_id;
        formData.instigator_id = userState.user_id; 
        formData.from_email = userState.username;

        API.sendChallenge(formData)
        .then(response => {
          console.log("challenge_player_form", response.data);
          setUser(prevState =>({...prevState, 
            game_status: response.data.game_status 
          }));
          updateGame(response.data.game_status);
        });
        break;
    
      case "accept_challenge_form":
        if(!rival.active_game) break;  // bug??
        let newGames = [
          game_id,
          rival.active_game
        ];

        formData.game_id = rival.active_game; 
        formData.rival_id = userState.user_id;
        formData.rival_hero_id = userState.selected_hero_id;
        formData.rival_hero_hp = userState.selectedHero.hp

        API.acceptGame(formData)
        .then(response => {
          console.log("accept_challenge_form", response.data);
          setUser(prevState => ({...prevState, 
            game_status: 2,
            game_id: rival.active_game,
            games: newGames.filter(game => game != null )
          }));
          updateGame(2);
        });

        break;

      case "player_ready_form":
        formData.game_id = game_id; 
        formData.rival_id = userState.user_id;
        formData.rival_hero_id = userState.selected_hero_id;
        formData.rival_hero_hp = userState.selectedHero.hp

        if(game_id) {
          API.readyGame(formData).then(response => {
            console.log("player_ready_form", response.data);
            setUser(prevState => ({...prevState, 
              game_status: 3,
            }));
            updateGame(3);
          });
        }else{ 
          Utils.AlertMessage("Not a valid game_id (" + game_id + ")", "danger");
        }
        break;

      case "in_game_form":
        formData.game_id = game_id; 
        formData.rival_id = userState.user_id;
        formData.rival_hero_id = userState.selected_hero_id;
        formData.rival_hero_hp = userState.selectedHero.hp

        if(game_id) {
          API.readyGame(formData).then(response => {
            console.log("player_ready_form", response.data);
            setUser(prevState => ({...prevState, 
              game_status: 3,
            }));
            updateGame(3);
          });
        }else{ 
          Utils.AlertMessage("Not a valid game_id (" + game_id + ")", "danger");
        }

        setUser(prevState => ({...prevState, redirectTo: "/battle"}));
        break;

      case "choose_hero_form":
        setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}));
        break;

      case "pending_response_form":
        updateGame();
      default:
        break; 
    }
 
    console.log(event.target.id, formData);
  }
 
  // =========================[ updateGame ]=========================================
  const updateGame = (game_status=userState.game_status) => {
    if(!userState.selectedHero && userState.selected_hero_id){
      API.getHeroById(userState.selected_hero_id).then(heroObj => setUser(prevState =>({...prevState, selectedHero: heroObj.data })));
    }else if(!userState.selected_hero_id){
      setPageContent(prevState => ({...prevState, 
        gameMessage: "It looks like you still need to choose a hero.",
        buttonMessage: "Choose Hero",
        formID: "choose_hero_form"
      }));
      return;
    }


    let pendingGameID = [];
    if(userState.games && userState.game_id){
      pendingGameID = userState.games.filter(game => game !== userState.game_id );
    }

    // Update Page Content to be: Send Invite, Ready?, Pending, Join Game, Accept?
    if(pendingGameID.length === 0 && game_status < 2){

      // =========[ updateGame - Send Invite ]======================================
      API.searchChallenge().then( response => {
        console.log("Search Challenge", response);
        setPageContent(prevState => ({...prevState, 
          gameMessage: "Search Challenge",
          buttonMessage: "Send Invite",
          formID: "challenge_player_form"
        }));
        setPlayers(response.data);
      });

      return;
    }else if(game_status === 2){ // check if opponent accepted
      console.log("check if opponent accepted");
      API.getGameById(userState.game_id).then(game => {
        let { players, heroes } = game.data;
        let rivalArray = players.filter(plyr => plyr !== userState.user_id );
        let rivalHeroArray = heroes.filter(hero => hero !== userState.selected_hero_id );

        if(rivalArray.length > 0 && rivalHeroArray.length > 0){

          API.getUserById(rivalArray[0])
          .then(userResponse => ({...userResponse.data, hero: rivalHeroArray[0] }))
          .then(rivalObj => {
            return API.getHeroById(rivalObj.hero)
              .then(heroObj => ({...rivalObj, selectedHero: heroObj.data }));  
          }).then(rivalObj => { console.log("rivalObj", rivalObj); setRival(rivalObj); })
          // }).then(rivalObj => setRival(rivalObj))

          // =========[ updateGame - Ready? ]====================================
          setPageContent(prevState => ({...prevState, 
            gameMessage: "Game Accepted!",
            buttonMessage: "Ready?",
            formID: "player_ready_form"
          }));

        }else{ // not accepted yet...pending...or accept?
          
          API.getPendingRival({ games: userState.game_id, my_id: userState.user_id })
          .then(response => {
            console.log("pending rival response", response.data);
            if(response.data.length > 0){
              let rivalObj = response.data[0];
  
              setRival(prevState => ({...prevState, ...rivalObj }));
  
              API.getHeroById(rivalObj.hero)
              .then(heroObj => {
                // =========[ updateGame - Pending ]====================================
                console.log("BE MY HERO", heroObj.data);
                setRival(prevState => ({...prevState, selectedHero: heroObj.data }));

                setPageContent(prevState => ({...prevState, 
                  gameMessage: "Pending Rival Response",
                  buttonMessage: "Pending",
                  formID: "pending_response_form"
                }));
              });
            }else{
              // if you made it to here then you must have a pending game invite
              // Get rivalObj
              API.getGameById(pendingGameID[0])
              .then(game => {
                return API.getUserById(game.data.instigator_id)
                  .then(userResponse => ({...userResponse.data, game: game.data}))
                  .then(rivalObj => {
                    return API.getHeroById(rivalObj.game.instigator_hero_id)
                      .then(heroObj => ({...rivalObj, selectedHero: heroObj.data }));  
                  });
              }).then(rivalObj => { console.log("rivalObj", rivalObj); setRival(rivalObj); })
              // }).then(rivalObj => setRival(rivalObj))
              .catch(error => (Utils.AlertMessage("Error: " + error, "danger")));

              // =========[ updateGame - Accept? ]================================
              console.log("pendingGameID", pendingGameID);
              setPageContent(prevState => ({...prevState, 
                gameMessage: "You Have a Pending Game Invite",
                buttonMessage: "Accept?",
                formID: "accept_challenge_form"
              }));
            }
          });
        }
      })

      return; 
    }else if(game_status === 3){ // game is in progress
      // =========[ updateGame - Join Game ]================================
      console.log("game is in progress");
      setPageContent(prevState => ({...prevState, 
        gameMessage: "The Battle Has Started!",
        buttonMessage: "Join Game",
        formID: "in_game_form"
      }));

      return;
    }
    
  }
  
  // =========================[ useEffect ]=========================================
  const { userState, setUser } = useContext(UserContext);
  const [ players, setPlayers ] = useState([]);
  const [ rival, setRival ] = useState(null);
  const [ pageContent, setPageContent ] = useState({ 
    gameMessage: "Search Challenge", 
    buttonMessage: "Send Invite", 
    formID: "challenge_player_form"
  })
  const [ background, setBackground ] = useState(Utils.getBgStyle);
  useEffect(() => {
    // setBackground(Utils.getBgStyle);
    updateGame();
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mb-5">
          <h2>{pageContent.gameMessage}</h2>
        </Col>
        {userState.selectedHero &&
          <Col size="lg-6">
            <HeroCard 
              id={userState.selectedHero._id}
              key={userState.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={userState.selectedHero.image}
              heading={userState.selectedHero.name}
              subtitle={userState.username.split("@")[0]}
              heroObject={userState.selectedHero}
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
          userState.selected_hero_id ? (<Col size="lg-6">
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
                <div className="col">
                  <label className="col-sm-3 form-label" htmlFor="rival_id">Available Players:</label>
                  <select className="form-control form-control-sm" name="rival_id" id="rival_id">
                    {players.length > 0 ? players.map(i => {
                      return (i._id !== userState.user_id) && (
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