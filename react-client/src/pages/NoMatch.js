import React, { useContext } from "react";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { Col, Row, SectionRow, Container } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";
import UserContext from "../userContext";


function NoMatch() {
  let location = useLocation();
  const { userState, getUser } = useContext(UserContext);

  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="md-12">
          <Jumbotron>
            <h1>404 Page Not Found</h1>
            <h3>No match for <code>{location.pathname}</code></h3>
            <h1>
              <span role="img" aria-label="Face With Rolling Eyes Emoji">
                🙄
              </span>
            </h1>
          </Jumbotron>
          <Col size="md-12">
            <pre>{JSON.stringify(userState, null, 2)}</pre>
            <div>
              <button onClick={() => getUser()}>Get User</button>
            </div>
          </Col>
        </Col>
      </SectionRow>
    </Wrapper>
  );
}

export default NoMatch;