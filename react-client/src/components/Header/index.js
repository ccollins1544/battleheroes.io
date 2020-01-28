import React, { Component, useContext, useState, useEffect } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserContext from "../../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faShieldAlt, faUser, faUserSlash , faUserPlus} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const Header = () => {
  const { userState, handleLogout, getUser } = useContext(UserContext);
  const [ gameLog, setGameLog ] = useState(null);

  useEffect(() => { 
    if(userState.user_id === 0 || !userState.user_id ){
      getUser();
    }
  }, [gameLog]);

  return (
    <header className="App-header" id="nav-container">
      <div className="container-fluid clearfix" >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="main-nav" >
          <Link to="/" className="navbar-brand mb-0 h1" ><FontAwesomeIcon icon={faShieldAlt} /> BattleHeroes</Link>
          <div className="navbar-collapse collapse show">
            <ul className="navbar-nav ml-auto">
              {userState.loggedIn ? (
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={(e) => handleLogout(e)}><FontAwesomeIcon icon={faUserSlash} /> {userState.username}</Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link"><FontAwesomeIcon icon={faUser} /> Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link"><FontAwesomeIcon icon={faUserPlus} /> Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
