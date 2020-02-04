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
        if (response.status === 200) {
          let goTo = '/choose-hero'

          if(userState.selectedHero.length > 0 && response.data.game_id){
            goTo = `/battle?user_id=${response.data._id}&game_id=${response.data.game_id}`;
          }else if(userState.selectedHero.length > 0){
            goTo = '/challenge';
          }

          setUser(prevState => ({...prevState,
            loggedIn: true,
            username: response.data.username,
            user_groups: response.data.user_groups,
            user_id: response.data._id,
            game_status: response.data.game_status,
            games: response.data.game,
            selectedHero: response.data.heroes ? [response.data.heroes] : [],
            redirectTo: goTo
          }));
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
              username: null,
              user_id: null,
              game_id: null,
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
      goTo = `/battle?user_id=${userState.user_id}&game_id=${userState.game_id}`;

      setUser(prevState => ({...prevState,
        redirectTo: goTo,
        selectedHero: [{_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}]
      }));

    }else if(userState.loggedIn){
      goTo = '/challenge';

      API.startGame(userState.user_id, heroData)
      .then(response => {
        console.log("start game", response);

        setUser(prevState => ({...prevState,
          redirectTo: goTo,
          game_id: response.data._id,
          selectedHero: [{_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}]
        }));
        
      }).catch(err => console.log(err));

    }else{ // goTo login
      setUser(prevState => ({...prevState,
        redirectTo: goTo,
        selectedHero: [{_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}]
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
        let persist_selected_hero = [];

        if(sessionUser.user){
          persist_loggedIn = true;
          persist_user_id = sessionUser.user._id;
          persist_username = sessionUser.user.username;
          persist_user_groups = sessionUser.user.user_groups;
          persist_game_status = sessionUser.user.game_status;
          persist_games = sessionUser.user.game;
          persist_selected_hero = sessionUser.user.heroes ? [sessionUser.user.heroes] : [];
        }
      
        setUser({
          loggedIn: persist_loggedIn,
          username: persist_username,
          user_groups: persist_user_groups,
          user_id: persist_user_id, 
          game_id: null,
          game_status: persist_game_status,
          games: persist_games,
          redirectTo: null,
          selectedHero: persist_selected_hero
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

