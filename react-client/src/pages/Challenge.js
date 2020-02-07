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
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let formData = Utils.getFormData(event.target.id);
    formData.active_game = userState.game_id ? userState.game_id : (userState.games.length > 0 ? userState.games[0] : null);
    formData.instigator_id = userState.user_id; 
    formData.subject = "New Challenge";
    formData.message = `You've been challenged by ${userState.username}. To accept/deny the challenge please log into BattleHeroes.io and go to the Challenge page.`;
    formData.from_email = userState.username;
    console.log("formData", formData);

    /**
     * FORMS 
     * challenge_player_form - done
     * player_ready_form
     * pending_response_form
     * in_game_form
     * accept_challenge_form
     */
    if(event.target.id !== "challenge_player_form") return; // temporary break
    API.sendChallenge(formData)
      .then(response => {
        console.log("challenge_player_form", response.data);
        setUser(prevState =>({...prevState, game_status: response.data.game_status }));
        updateGame(response.data.game_status);
    }); 
  }
 
  const updateGame = (game_status=userState.game_status) => {
    let pendingGameID = [];
    if(userState.games && userState.game_id){
      pendingGameID = userState.games.filter(game => game !== userState.game_id );
    }

    // check pending games,
    if(pendingGameID.length === 0 && game_status < 2){
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
            .then(rivalObj => {
              setRival(prevState => ({...prevState, rivalObj }));
              console.log("DEAD ON ARRIVAL", rival);
          });

          API.getHeroById(rivalHeroArray[0])
            .then(heroObj => {
              setRival(prevState => ({...prevState, selectedHero: heroObj.data }));
              console.log("BE MY HERO", heroObj);
          });

          setPageContent(prevState => ({...prevState, 
            gameMessage: "Game Accepted!",
            buttonMessage: "Ready?",
            formID: "player_ready_form"
          }));

        }else{ // not accepted yet
          setPageContent(prevState => ({...prevState, 
            gameMessage: "Pending Rival Response",
            buttonMessage: "Pending",
            formID: "pending_response_form"
          }));

          API.getPendingRival({ games: userState.game_id, my_id: userState.user_id })
          .then(response => {
            console.log("pending rival response", response.data);
            let rivalObj = response.data[0];
            console.log(rivalObj);
            console.log(rivalObj.hero);

            setRival(prevState => ({...prevState, rivalObj }));

            API.getHeroById(rivalObj.hero)
            .then(heroObj => {
              console.log("BE MY HERO", heroObj);
              setRival(prevState => ({...prevState, selectedHero: heroObj.data }));
            });
          });
        }
      })
    }else if(game_status === 3){ // game is in progress
      console.log("game is in progress");
      setPageContent(prevState => ({...prevState, 
        gameMessage: "The Battle Has Started!",
        buttonMessage: "Join Game",
        formID: "in_game_form"
      }));
    }

    // if you made it to here then you must have a pending game invite
    console.log("pendingGameID", pendingGameID);
    setPageContent(prevState => ({...prevState, 
      gameMessage: "You Have a Pending Game Invite",
      buttonMessage: "Accept?",
      formID: "accept_challenge_form"
    }));

    API.getGameById(pendingGameID[0])
    .then(game => {
      API.getUserById(game.data.instigator_id)
        .then(rivalObj => {
          setRival(prevState => ({...prevState, rivalObj }));
          console.log("DEAD ON ARRIVAL", rival);
      });

      API.getHeroById(game.data.instigator_hero_id)
        .then(heroObj => {
          setRival(prevState => ({...prevState, selectedHero: heroObj.data }));
          console.log("BE MY HERO", heroObj);
      });
    });
  }
    
  const { userState, setUser } = useContext(UserContext);
  const [ players, setPlayers ] = useState([]);
  const [ rival, setRival ] = useState(null);
  const [ pageContent, setPageContent ] = useState({ 
    gameMessage: "Search Challenge", 
    buttonMessage: "Send Invite", 
    formID: "challenge_player_form"
  })
  const [ background, setBackground ] = useState({});
  useEffect(() => {
    const bg_collection = [
      '/img/battle-bg1.gif',
      '/img/battle-bg2.webp',
      '/img/battle-bg3.webp',
      '/img/battle-bg4.webp',
      '/img/battle-bg5.webp',
      '/img/choose-hero-bg1.gif',
      '/img/choose-hero-bg2.gif',
      '/img/choose-hero-bg3.webp',
      '/img/choose-hero-bg4.webp',
      '/img/choose-hero-bg5.webp',
    ];

    let bg_url = bg_collection[Math.floor(Math.random()*bg_collection.length)];
    let bg_style = {
      backgroundImage: `url('${bg_url}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }

    setBackground(bg_style);
    updateGame();

    if(!userState.selectedHero && userState.selected_hero_id){
      API.getHeroById(userState.selected_hero_id).then(heroObj => setUser(prevState =>({...prevState, selectedHero: heroObj.data })));
    }
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mb-5">
          <h2>{pageContent.gameMessage}</h2>
        </Col>
        <Col size="lg-6">
          {userState.selectedHero &&
            <HeroCard 
              id={userState.selectedHero._id}
              key={userState.selectedHero._id}
              addClasses="col-lg-12 col-md-12 col-sm-12"
              src={userState.selectedHero.image}
              heading={userState.selectedHero.name}  
              heroObject={userState.selectedHero}
              nohover={true}
              handleHeroClick={()=>{}}
            >
            </HeroCard>
          }
        </Col>
        <Col size="lg-6">
          {rival && rival.hasOwnProperty('selectedHero') ? ( // Load Rival
            <HeroCard 
            id={rival.selectedHero._id}
            key={rival.selectedHero._id}
            addClasses="col-lg-12 col-md-12 col-sm-12"
            src={rival.selectedHero.image}
            heading={rival.selectedHero.name}  
            heroObject={rival.selectedHero}
            nohover={true}
            handleHeroClick={()=>{}}
            >
          </HeroCard>
          ) : ( // Load Players to challenge
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
          )}
        </Col>
        <Col size="lg-6" addClass="mx-auto m-5">
          {rival && rival.hasOwnProperty('selectedHero') && (
            <form id={pageContent.formID} onSubmit={(e) => handleFormSubmit(e)}>
              <div className="form-row">
              <button type="submit" className="btn btn-dark form-input" value="Submit" >
                <FontAwesomeIcon icon={faFlagCheckered} /> {pageContent.buttonMessage}
              </button>
            </div>
          </form>
          )}
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default Challenge;