import React from "react";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function ChooseHero() {
  let location = useLocation();

  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
          <Jumbotron>
        
            <h1>ChooseHero</h1>
            <h3>No match for <code>{location.pathname}</code></h3>
            <h1>
              {/* <span role="img" aria-label="Face With Rolling Eyes Emoji">
                
              </span> */}
            </h1>

          </Jumbotron>
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default ChooseHero;