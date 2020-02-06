import React, { createContext, useState, useEffect } from "react";
import API from "./utils/API";
import Utils from "./utils/";

const UserContext = React.createContext();
export const UserConsumer = UserContext.Consumer;

function UserProvider({ children }){
  
  const [userState, setUser] = useState({});

  const handleLoginSubmit = ({ username, password }) => {
    let userData = { username, password };

    API.login(userData)
      .then(response => {
        console.log("LOGGED IN", response.data); 
        if (response.status === 200) {
          let goTo = '/choose-hero'

          if(userState.selected_hero_id && response.data.game_id){
            goTo = '/battle'; //`/battle?user_id=${response.data._id}&game_id=${response.data.game_id}`;
          }else if(userState.selected_hero_id){
            goTo = '/challenge';
          }

          setUser(prevState => ({...prevState,
            loggedIn: true,
            user_id: response.data._id,
            username: response.data.username,
            user_groups: response.data.user_groups,
            game_status: response.data.game_status,
            game_id: response.data.game_id,
            games: response.data.games,
            selected_hero_id: response.data.hero,
            redirectTo: goTo
          }));
        }

        return response.data.hero; 
      }).then(hero => {
        if(hero) {
          API.getHeroById(hero).then(heroObj => setUser(prevState =>({...prevState, selectedHero: heroObj.data })))
        }
      })
      .catch(error => {
        Utils.AlertMessage("Login error: " + error, "danger");
      })
  }

  const handleRegisterSubmit = ({ username, password }) => {
    let registerData = { username, password };
    let signupEmail = {
      recipient: username,
      subject: "BattleHeroes - Sign Up",
      message: `Welcome!
Your account was successfully registered on BattleHeroes.io.
The password used to sign up was: ${password}
`,
    };
    
    API.register(registerData)
      .then(response => {

        if (!response.data.errmsg) {
          API.sendEmail(signupEmail).then( res => {
            if(res.status === 200){
              Utils.AlertMessage("Successful signup!", "success");
            }else{
              Utils.AlertMessage("We couldn't send your confirmation email but it appears that your account was still registered successfully!", "success");
            }
            setUser(prevState => ({...prevState, redirectTo: '/login'}));
          });

				} else {
          Utils.AlertMessage("Username already taken!", "info");     
				}
      }).catch(error => {
        Utils.AlertMessage("Signup error: " + error, "danger");    
			});
  }

  const handleLogout = (event) => {
    event.preventDefault();

    API.logout()
      .then(response => {
          if (response.status === 200) {
            setUser(prevState => ({...prevState,
              loggedIn: false,
              user_id: null,
              username: null,
              user_groups: null,
              game_status: 0,
              game_id: null,
              games: null,
              selected_hero_id: "",
              selectedHero: "",
              redirectTo: '/', 
            }));

            window.location.reload(true);
          }
      }).catch(error => {
        Utils.AlertMessage("Logout error: " + error, "danger");    
      });
  }

  const handleHeroClick = ({_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}) => {   
    let heroData = {
      instigator_hero_id: _id, 
      instigator_hero_hp: hp
    };

    let goTo = '/login';
    if(userState.loggedIn && userState.user_id && userState.game_id){
      // goTo = `/battle?user_id=${userState.user_id}&game_id=${userState.game_id}`;
      goTo = '/battle';

      let updateHeroData = { 
        user_id: userState.user_id,
        game_id: userState.game_id
      }

      updateHeroData = {...updateHeroData, ...heroData};
      console.log('TESTING', updateHeroData);

      API.updateHero(updateHeroData.instigator_hero_id, updateHeroData)
      .then(response => {
        console.log("pushed hero updates to db", response);
        
        setUser(prevState => ({...prevState,
          redirectTo: goTo,
          selected_hero_id: _id,
          selectedHero: {_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}
        }));
      }).catch(err => console.log(err)); 

    }else if(userState.loggedIn){
      goTo = '/challenge';

      API.startGame(userState.user_id, heroData)
      .then(response => {
        console.log("start game", response.data);

        setUser(prevState => ({...prevState,
          redirectTo: goTo,
          game_id: response.data._id,
          selected_hero_id: _id,
          selectedHero: {_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}
        }));
        
      }).catch(err => console.log(err));

    }else{ // goTo login
      setUser(prevState => ({...prevState,
        redirectTo: goTo,
        selected_hero_id: _id
      }));
    }
  }

  useEffect(() => {
    API.getUser()
      .then( response => response.data )
      .then( sessionUser => {
        console.log("sessionUser",sessionUser);
        let persist_loggedIn = false;
        let persist_user_id = null;
        let persist_username = null;
        let persist_user_groups = [];
        let persist_game_status = 0;
        let persist_games = [];
        let persist_game_id = null;
        let persist_selected_hero = "";

        if(sessionUser.user){
          persist_loggedIn = true;
          persist_user_id = sessionUser.user._id;
          persist_username = sessionUser.user.username;
          persist_user_groups = sessionUser.user.user_groups;
          persist_game_status = sessionUser.user.game_status;
          persist_game_id = sessionUser.user.active_game;
          persist_games = sessionUser.user.games;
          persist_selected_hero = sessionUser.user.hero;
        }
      
        setUser({
          loggedIn: persist_loggedIn,
          user_id: persist_user_id, 
          username: persist_username,
          user_groups: persist_user_groups,
          game_id: persist_game_id,
          games: persist_games,
          game_status: persist_game_status,
          selected_hero_id: persist_selected_hero,
          redirectTo: null
        });
    });
    
  }, []);

  return (
    <UserContext.Provider value={{
      userState, 
      setUser,
      handleLoginSubmit,
      handleRegisterSubmit,
      handleLogout, 
      handleHeroClick
    }} >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;
export { UserProvider };

