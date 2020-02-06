import React, { useContext} from "react";
import UserContext from "../../userContext";
import "./style.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard } from "@fortawesome/pro-duotone-svg-icons";
import { faLinkedin, faGithub} from "@fortawesome/free-brands-svg-icons";

function Footer(){
  const { userState, setUser } = useContext(UserContext);

  return (
    <footer id="main-footer">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="footer-nav">
        <div style={{color:"#daa520"}}>{userState && Object.keys(userState).map(key => 
          typeof userState[key] === 'object' ? `${key}: ${JSON.stringify(userState[key])} | ` : `${key}: ${userState[key]} | `
        )}
        </div>
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"> 
              <a className="nav-link" 
                href="https://github.com/ccollins1544/battleheroes.io" 
                target="_blank" 
                title="Github Link"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            </li>
            <li className="nav-item"> 
              <Link to="/contact" 
                className="nav-link" 
                title="Contact Us" 
                onClick={() => setUser(prevState => ({...prevState, redirectTo: "/contact"}))}
              >
                <FontAwesomeIcon icon={faIdCard} size="2x" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
  
      <div id="footer-bottom">
        <div id="footer-info">
          Copyright © 2020 |&nbsp;&nbsp;
          <a className="footer-link" 
            href="https://www.linkedin.com/in/tyler-webb-363843199/" 
            target="_blank" 
            rel="noopener noreferrer"
          > <FontAwesomeIcon icon={faLinkedin} size="1x" /> Tyler Webb&nbsp;&nbsp;</a>
          <a className="footer-link" 
            href="https://www.linkedin.com/in/ccollins1544/" 
            target="_blank" 
            rel="noopener noreferrer"
          > <FontAwesomeIcon icon={faLinkedin} size="1x" /> Christopher Collins&nbsp;&nbsp;</a>
          <a className="footer-link" 
            href="https://www.linkedin.com/in/matthew-ayrton-902550177/" 
            target="_blank" 
            rel="noopener noreferrer"
          > <FontAwesomeIcon icon={faLinkedin} size="1x" /> Matthew Ayrton&nbsp;&nbsp;</a>
          <a className="footer-link" 
            href="https://www.linkedin.com/in/daniel-osornio-837547188/" 
            target="_blank"
            rel="noopener noreferrer"
          > <FontAwesomeIcon icon={faLinkedin} size="1x" /> Daniel Osornio</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;