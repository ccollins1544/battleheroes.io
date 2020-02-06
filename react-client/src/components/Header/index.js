import React, { Component, useContext, useState, useEffect } from "react";
import UserContext from "../../userContext";
import { useLocation, Redirect, Route, Link } from "react-router-dom";
import API from "../../utils/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faShieldAlt } from "@fortawesome/pro-solid-svg-icons";
import { far, faSwords } from "@fortawesome/pro-regular-svg-icons";
import { fad, faSword, faDragon, faSignIn, faSignOut, faUserPlus } from "@fortawesome/pro-duotone-svg-icons";

import "./style.css";

const Header = () => {
  const { userState, handleLogout, setUser } = useContext(UserContext);
  let location = useLocation();

  if (userState.redirectTo !== null && userState.redirectTo !== location.pathname ) {
    return <Redirect to={{ pathname: userState.redirectTo }} />
  } else {
    return (
      <header className="App-header" id="nav-container">
        <div className="container-fluid clearfix" >
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="main-nav" >
            <Link to="/" className="navbar-brand mb-0 h1" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/"}))} ><FontAwesomeIcon icon={faShieldAlt} /> BattleHeroes</Link>
            <div className="navbar-collapse collapse show">
              <ul className="navbar-nav ml-auto">
                {userState.selectedHero ? (
                  <li className="nav-item">
                    <Link to="/choose-hero" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}))}><FontAwesomeIcon icon={faDragon} /> Choose Hero</Link>
                  </li>
                ):(
                  <li className="nav-item">
                    <Link to="/choose-hero" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/choose-hero"}))}><FontAwesomeIcon icon={faDragon} /> Change Hero</Link>
                  </li>
                )}

                {userState.loggedIn ? (
                  <>
                    {/* {userState.user_id && userState.game_id ? () : ()} */}
                      <li className="nav-item">
                        <Link to="/challenge" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/challenge"}))}><FontAwesomeIcon icon={faSword} /> Challenge</Link>
                      </li>
                      <li className="nav-item">
                        {/* <Link to={`/battle?user_id=${userState.user_id}&game_id=${userState.game_id}`} className="nav-link"><FontAwesomeIcon icon={faShieldAlt} /> Battle</Link> */}
                        <Link to="/battle" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/battle"}))} ><FontAwesomeIcon icon={faSwords} /> Battle</Link>
                      </li>
                    
                    {userState.selectedHero ? (
                      <>
                        <li className="nav-item">
                          <span className="nav-link">
                            <img id="hero-icon" 
                              src={userState.selectedHero.image} 
                              alt={userState.selectedHero.name}  
                              title={userState.selectedHero.name}
                              />
                          </span>
                        </li>
                        <li className="nav-item">
                          <Link to="#" className="nav-link" onClick={(e) => handleLogout(e)}>
                            {userState.username} <FontAwesomeIcon icon={faSignOut} />
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li className="nav-item">
                        <Link to="#" className="nav-link" onClick={(e) => handleLogout(e)}>
                          <FontAwesomeIcon icon={faSignOut} /> {userState.username}
                        </Link>
                      </li>
                    )}  
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/login"}))}><FontAwesomeIcon icon={faSignIn} /> Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/signup" className="nav-link" onClick={() => setUser(prevState => ({...prevState, redirectTo: "/signup"}))}><FontAwesomeIcon icon={faUserPlus} /> Sign Up</Link>
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
