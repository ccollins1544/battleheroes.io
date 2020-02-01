import React, { useContext, useSate} from "react";
import "./style.css";
import { Redirect, Route, Link } from "react-router-dom";
import UserContext from "../../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab, faLinkedin, faDev, faGithub} from "@fortawesome/free-brands-svg-icons";
// Add all icons to the library so you can use it in your page
library.add(fas, far, fab, faLinkedin, faDev, faGithub);

function Footer(){
  const { userState } = useContext(UserContext);

  return (
    <footer id="main-footer">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="footer-nav">
        <div style={{color:"#7289da"}}>
          {userState && Object.keys(userState).map(key => 
            typeof userState[key] === 'object' ? `${key}: <pre>${JSON.stringify(userState[key])}</pre>` : `${key}: ${userState[key]} | ` 
          )}
          {/* {userState.selectedHero.length > 0 && `IMAGE: ${userState.selectedHero[0].image}`} */}
        </div>
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"> 
              <a className="nav-link" href="" target="_blank" >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </li>
            <li className="nav-item"> 
              <a className="nav-link" href="" target="_blank">
                <FontAwesomeIcon icon={faDev} size="2x" />
              </a>
            </li>
            <li className="nav-item"> 
              <a className="nav-link" href="" target="_blank">
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
  
      <div id="footer-bottom">
        <div id="footer-info">
          Copyright © 2020 | 
          <Link to="/" className="footer-link" > BattleHeroes.io</Link> |
          <a className="footer-link" href="https://github.com/ccollins1544/battleheroes.io"> Repo Link</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;