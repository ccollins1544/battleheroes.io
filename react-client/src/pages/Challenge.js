import React, { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import API from "../utils/API";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import HeroCard from "../components/Card/heroCard";
import { SectionRow , Col } from "../components/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";

const Challenge = () => {
  const sendChallenge = (event) => {
    event.preventDefault();
    let formData = Utils.getFormData(event.target.id);
    console.log("formData", formData);
  }
  
  // console.log("Message Data", messageData);
  // API.sendChallenge(messageData)
  //   .then( res => console.log("sendChallenge response;", res));
  // const [ messageData, setMessageData ] = useState({
  //   recipient: "chris@ccollins.io",
  //   subject: "You've been challenged again",
  //   message: "second attempt should still be working!"
  // });
    
  const { userState, setUser } = useContext(UserContext);
  const [ players, setPlayers ] = useState([]);
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
    
    API.searchChallenge().then( response => {
      console.log("Search Challenge", response.data);
      setPlayers(response.data)
    });

    if(!userState.selectedHero && userState.selected_hero_id){
      API.getHeroById(userState.selected_hero_id).then(heroObj => setUser(prevState =>({...prevState, selectedHero: heroObj.data })));
    }
  }, []);

  return (
    <Wrapper className="App" id="main-container" style={background}>
      <SectionRow id="main-section">
        <Col size="lg-12">
          <h1>Challenge</h1>
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
          <form id="challenge_player_form" onSubmit={(e) => sendChallenge(e)}>
            <div className="form-row">
              <div className="col">
                <label className="col-sm-3 form-label" htmlFor="challenge_player">Available Players:</label>
                <select className="form-control form-control-sm" name="challenge_player" id="challenge_player">
                  {players.length > 1 ? players.map(i => {
                    return (i._id !== userState.user_id) && (
                      <option value={i._id}>{i.username.split("@")[0]}</option>
                      );
                    }) : (
                    <option value="">No Players Available</option>
                  )}
                </select>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary float-right" 
              value="Submit"
            >Submit
            </button>
          </form>
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default Challenge;