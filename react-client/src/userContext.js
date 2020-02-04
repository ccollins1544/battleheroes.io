import React, { createContext, useState } from "react";
import API from "./utils/API";
import Utils from "./utils/";

const UserContext = React.createContext();
export const UserConsumer = UserContext.Consumer;

function UserProvider({ children }){
  
  const [userState, setUser] = useState({
    loggedIn: false,
    username: null,
    user_id: null,
    game_id: null,
    redirectTo: null,
    selectedHero: []
  });

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
            user_id: response.data._id,
            redirectTo: goTo
          }));
        }
      }).catch(error => {
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

//=================[ DEAD CODE ]================================
// const getUser = () => {
//   API.user().then(response => {
//     console.log('Get user response: ', response.data);

//     if (response.data.user) {
//       console.log('Get User: There is a user saved in the server session: ')

//       setUser(prevState => ({...prevState,
//         loggedIn: true,
//         username: response.data.user.username,
//         user_id: response.data.user._id,
//       }));
      
//     } else {
//       console.log('Get user: no user');
//       setUser(prevState => ({...prevState,
//         loggedIn: false,
//         username: null,
//         user_id: 0,
//         game_id: 0
//       }));
//     }
//   })
// }
