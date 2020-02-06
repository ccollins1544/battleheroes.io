import React, { Component, useContext, useState, useEffect } from "react";
import UserContext from "../../userContext";
import { useLocation, Redirect, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faShieldAlt, faUser, faUserSlash , faUserPlus} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const Header = () => {
  const { userState, handleLogout, setUser } = useContext(UserContext);
  // const [ gameLog, setGameLog ] = useState(null);
  let location = useLocation();
  // console.log("location: "+ location.pathname + " ?= redirect: " + userState.redirectTo);

  if (userState.redirectTo !== null && userState.redirectTo !== location.pathname ) {
    return <Redirect to={{ pathname: userState.redirectTo }} />
  } else {
    return (
      <header className="App-header" id="nav-container">
        <div className="container-fluid clearfix" >
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="main-nav" >
            <Link to="/" className="navbar-brand mb-0 h1" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/"}))} >
              <FontAwesomeIcon icon={faShieldAlt} size="2x" /> BattleHeroes
            </Link>
            <div className="navbar-collapse collapse show">
              <ul className="navbar-nav ml-auto">
                {userState.selectedHero.length == 0 && (
                  <li className="nav-item">
                    <Link to="/choose-hero" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}))}>
                      <FontAwesomeIcon icon={faShieldAlt} size="2x" /> Choose Hero
                    </Link>
                  </li>
                )}

                {userState.loggedIn ? (
                  <>
                    {userState.user_id && userState.game_id ? (
                      <li className="nav-item">
                        <Link to={`/battle?user_id=${userState.user_id}&game_id=${userState.game_id}`} className="nav-link">
                          <FontAwesomeIcon icon={faShieldAlt} size="2x" /> Battle</Link>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link to="/challenge" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/challenge"}))}>
                          <FontAwesomeIcon icon={faShieldAlt} size="2x" /> Challenge</Link>
                      </li>
                    )}
                    
                    {userState.selectedHero.length > 0 ? (
                      <>
                        <li className="nav-item">
                          <span className="nav-link">
                            <img id="hero-icon" 
                              src={userState.selectedHero[0].image} 
                              alt={userState.selectedHero[0].name}  
                              title={userState.selectedHero[0].name}
                              />
                          </span>
                        </li>
                        <li className="nav-item">
                          <Link to="#" className="nav-link" onClick={(e) => handleLogout(e)}>
                            {userState.username} <FontAwesomeIcon icon={faUserSlash} size="2x" />
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li className="nav-item">
                        <Link to="#" className="nav-link" onClick={(e) => handleLogout(e)}>
                          <FontAwesomeIcon icon={faUserSlash} size="2x" /> {userState.username}
                        </Link>
                      </li>
                    )}  
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/login"}))}>
                        <FontAwesomeIcon icon={faUser} size="2x" /> Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/signup" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/signup"}))}>
                        <FontAwesomeIcon icon={faUserPlus} size="2x" /> Sign Up</Link>
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
}

export default Header;
