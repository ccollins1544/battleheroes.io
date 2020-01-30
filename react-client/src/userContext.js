import React, { Component, createContext, useState } from "react";
import API from "./utils/API";

const UserContext = React.createContext({});
export const UserConsumer = UserContext.Consumer;

function UserProvider({ children }){
  
  const [userState, setUser] = useState({
    loggedIn: false,
    username: null,
    password: '',
    confirmPassword: '',
    redirectTo: null,
    user_id: 0,
    game_id: 0
  });

  const updateUser = (userObject) => {
    setUser(prevState => ({...prevState, userObject}));
  }

  const getUser = () => {
    API.user().then(response => {
      console.log('Get user response: ', response.data);

      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        setUser(prevState => ({...prevState,
          loggedIn: true,
          username: response.data.user.username,
          user_id: response.data.user._id,
        }));
        
      } else {
        console.log('Get user: no user');
        setUser(prevState => ({...prevState,
          loggedIn: false,
          username: null,
          user_id: 0,
          game_id: 0
        }));
      }
    })
  }

  const handleUserChange = event => {
    const { name, value } = event.target;
    setUser(prevState => ({...prevState, 
      [name]: value
    }));
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    let { username, password } = userState;
    let userData = { "username": username, "password": password };

    API.login(userData)
      .then(response => {
        if (response.status === 200) {
          // update App.js state
          setUser(prevState => ({...prevState,
            loggedIn: true,
            username: response.data.username,
            user_id: response.data._id,
            redirectTo: '/'
          }));
        }
      }).catch(error => {
        console.log('login error: ')
        console.log(error);
      })
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    let { username, password } = userState;
    let registerData = { "username": username, "password": password };
    
    API.register(registerData)
      .then(response => {

        if (!response.data.errmsg) {
					console.log('successful signup')
          //redirect to login page
          
          setUser(prevState => ({...prevState, redirectTo: '/login'}));
				} else {
					console.log('username already taken')
				}
      }).catch(error => {
				console.log('signup error: ')
				console.log(error)
			});
  }

  const handleLogout = (event) => {
    console.log("handleLogout");

    event.preventDefault();
    API.logout()
      .then(response => {
          if (response.status === 200) {
            updateUser({
              loggedIn: false,
              username: null,
              password: '',
              confirmPassword: '',
              redirectTo: '/', 
              user_id: 0,
              game_id: 0
            })

            window.location.reload(true);
          }
      }).catch(error => {
        console.log('Logout error')
      });
  }

  return (
    <UserContext.Provider value={{
      userState, 
      updateUser: updateUser,
      getUser: getUser,
      handleUserChange: handleUserChange,
      handleLoginSubmit: handleLoginSubmit,
      handleRegisterSubmit: handleRegisterSubmit,
      handleLogout: handleLogout, 
    }} >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;
export { UserProvider };