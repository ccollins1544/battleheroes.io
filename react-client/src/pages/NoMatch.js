import React from "react";
import Wrapper from "../components/Wrapper";
import { Col, SectionRow } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function NoMatch() {
  let location = useLocation();

  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="md-12">
          <Jumbotron>
            <h1>404 Page Not Found</h1>
            <h3>No match for <code>{location.pathname}</code></h3>
            <code></code>
            <h1>
              <span role="img" aria-label="Face With Rolling Eyes Emoji">
                🙄
              </span>
            </h1>
          </Jumbotron>
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default NoMatch;