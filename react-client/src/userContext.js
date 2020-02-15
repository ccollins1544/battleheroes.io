import React, { createContext, useState, useEffect } from "react";
import API from "./utils/API";
import Utils from "./utils/";
import Firebase from "firebase";
import firebaseConfig from "./config/firebase";


const UserContext = React.createContext();
export const UserConsumer = UserContext.Consumer;

function UserProvider({ children }){
  const [userState, setUser] = useState({});

  // =========================[ handleLoginSubmit ]=========================================
  const handleLoginSubmit = ({ username, password }) => {
    let userData = { username, password };

    API.login(userData)
    .then(response => {
      if (response.status === 200) {
        let goTo = '/choose-hero'

        if(userState.selected_hero_id && response.data.game_id){
          goTo = '/battle'; 
        }else if(userState.selected_hero_id){
          goTo = '/challenge';
        }

        return {
          loggedIn: true,
          user_id: response.data._id,
          username: response.data.username,
          user_groups: response.data.user_groups,
          game_status: response.data.game_status,
          game_id: response.data.game_id,
          games: response.data.games,
          selected_hero_id: response.data.hero,
          redirectTo: goTo
        }
      }

      console.log("login response:", response);
      throw "something strange happened...";

    }).then(userData => {
      if(userData.selected_hero_id) {
        return API.getHeroById(userData.selected_hero_id)
        .then(heroObj => ({...userData, 
          selectedHero: heroObj.data 
        }));
      }

      return userData;
    }).then(userData => setUser(userData))
    .catch(error => {
      Utils.AlertMessage("Did you create an account? " + error, "danger");
    })
  }

  // =========================[ handleRegisterSubmit ]=========================================
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
        });

        // setUser(prevState => ({...prevState, redirectTo: '/login'}));
        // LOGIN
        API.login(registerData)
        .then( response => {
          if (response.status === 200) {
            let goTo = '/choose-hero'
    
            if(userState.selected_hero_id){
              goTo = '/challenge';
            }
    
            return {
              loggedIn: true,
              user_id: response.data._id,
              username: response.data.username,
              user_groups: response.data.user_groups,
              game_status: response.data.game_status,
              game_id: response.data.game_id,
              games: response.data.games,
              selected_hero_id: response.data.hero,
              redirectTo: goTo
            }
          }

          console.log("login response:", response);
          throw "something strange happened...";
        }).then(userData => {
          if(userData.selected_hero_id) {
            return API.getHeroById(userData.selected_hero_id)
            .then(heroObj => ({...userData, 
              selectedHero: heroObj.data 
            }));
          }
    
          return userData;
        }).then(userData => setUser(userData))
        .catch(error => {
          Utils.AlertMessage("Login error: " + error, "danger");
        })

      } else {
        Utils.AlertMessage("Username already taken!", "info");     
      }
    }).catch(error => {
      Utils.AlertMessage("Signup error: " + error, "danger");    
    });
  }

  // =========================[ handleLogout ]=========================================
  const handleLogout = (event) => {
    event.preventDefault();

    API.logout()
    .then(response => {
      if (response.status === 200) {
        setUser({
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
        });

        window.location.reload(true);
      }
    }).catch(error => {
      Utils.AlertMessage("Logout error: " + error, "danger");    
    });
  }

  // =========================[ handleHeroClick ]=========================================
  const handleHeroClick = ({ _id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description }) => {
    let heroData = {
      instigator_hero_id: _id, 
      instigator_hero_hp: hp
    };

    let goTo = '/login';
    if(userState.loggedIn && userState.user_id && userState.game_id) {
      goTo = '/battle';

      let updateHeroData = { 
        user_id: userState.user_id,
        game_id: userState.game_id
      }

      updateHeroData = {...updateHeroData, ...heroData};

      API.updateHero(updateHeroData.instigator_hero_id, updateHeroData)
      .then(response => {
        console.log("pushed hero updates to db", response);
        
        return {
          redirectTo: goTo,
          selected_hero_id: _id,
          selectedHero: {_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description }
        };
      }).then(userData => setUser(prevState => ({...prevState, ...userData})))
      .catch(err => console.log(err)); 

    }else if(userState.loggedIn){
      goTo = '/challenge';

      API.startGame(userState.user_id, heroData)
      .then(response => {
        console.log("start game", response.data);

        return {
          redirectTo: goTo,
          game_id: response.data._id,
          selected_hero_id: _id,
          selectedHero: {_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description}
        };
        
      }).then(userData => setUser(prevState => ({...prevState, ...userData})))
      .catch(err => console.log(err));

    }

    // goTo login
    setUser(prevState => ({...prevState,
      redirectTo: goTo,
      selected_hero_id: _id,
      selectedHero: {_id, name, image, hp, attack2_dmg, attack1_dmg, attack1_description, attack2_description }
    }));
  }

    // ===================[ Firebase Connection Watcher ]==============================
    const firebase_connection_watcher = (gameData) => {
      if (!Firebase.apps.length) {
        Firebase.initializeApp(firebaseConfig);
      }
  
      let connectedRef = Firebase.database().ref(".info/connected");
      connectedRef.on('value', async snapshot => {
        if(gameData.loggedIn && gameData.hasOwnProperty('game_id')){
          gameData = await API.getGameById(gameData.game_id).then(gameResponse => ({...gameData, ...gameResponse.data}));
        }
  
        if(snapshot.val()){
          gameData.onlineAt = Firebase.database.ServerValue.TIMESTAMP;
          
          // Add user to the connections list.
          let online_player = Firebase.database().ref('/games').push(gameData);
          
          setUser(prevState => ({...prevState, 
            firebase_ref: online_player.key
          }));
  
          console.log("gameData", gameData);
      
          // Remove user from the connection list when they disconnect.
          online_player.onDisconnect().remove();
        }
      });
    }

  // =========================[ useEffect ]=========================================
  useEffect(() => {
    API.getUser()
    .then( response => response.data )
    .then( sessionUser => {
      console.log("sessionUser",sessionUser);
      
      if(sessionUser.user && sessionUser.user.hero){
        return API.getHeroById(sessionUser.user.hero)
        .then(heroObj => ({
          loggedIn: true,
          user_id: sessionUser.user._id, 
          username: sessionUser.user.username,
          user_groups: sessionUser.user.user_groups,
          game_id: sessionUser.user.active_game,
          games: sessionUser.user.games,
          game_status: sessionUser.user.game_status,
          selected_hero_id: sessionUser.user.hero,
          redirectTo: null,
          selectedHero: heroObj.data 
        }));
      }else if(sessionUser.user){
        return {
          loggedIn: true,
          user_id: sessionUser.user._id, 
          username: sessionUser.user.username,
          user_groups: sessionUser.user.user_groups,
          game_id: sessionUser.user.active_game,
          games: sessionUser.user.games,
          game_status: sessionUser.user.game_status,
          selected_hero_id: sessionUser.user.hero,
          redirectTo: null
        };
      }

      return {
        loggedIn: false,
        user_id: null, 
        username: null,
        user_groups: [],
        game_id: null,
        games: [],
        game_status: 0,
        redirectTo: null
      };

    }).then(userData => {
      setUser(userData);
      if(userData.loggedIn) {
        firebase_connection_watcher(userData);
      }
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
