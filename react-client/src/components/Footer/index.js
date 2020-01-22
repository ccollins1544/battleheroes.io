import React from 'react';
import Nav from '../Nav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab, faLinkedin, faDev, faGithub} from '@fortawesome/free-brands-svg-icons'
// Add all icons to the library so you can use it in your page
library.add(fas, far, fab, faLinkedin, faDev, faGithub)

function Footer(){
  return (
    <footer id="main-footer">
      <Nav elementID="footer-nav">
        <li className="nav-item"> 
          <a className="nav-link" href="https://www.linkedin.com/in/ccollins1544/" target="_blank">
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        </li>
        <li className="nav-item"> 
          <a className="nav-link" href="https://dev.to/ccollins" target="_blank">
            <FontAwesomeIcon icon={faDev} size="2x" />
          </a>
        </li>
        <li className="nav-item"> 
          <a className="nav-link" href="https://ccollins1544.github.io/" target="_blank">
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        </li>
      </Nav>
    
      {/* Footer Credits */}
      <div id="footer-bottom">
        <div id="footer-info">Copyright © 2019 | <a className="footer-link" href=".">Clicky Game</a> |
          <a className="footer-link" href="https://github.com/ccollins1544/clickygame"> Coding Bootcamp</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;