import React from "react";
import Wrapper from "../components/Wrapper";
import { SectionRow, Col } from "../components/Grid";
import Card from "../components/Card";
import Jumbotron from "../components/Jumbotron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

function Battle() {
  let location = useLocation();

  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
          <Jumbotron>
        
            <h1>Battle</h1>
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

export default Battle;