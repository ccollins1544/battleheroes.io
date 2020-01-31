<<<<<<< HEAD
import React from "react";
import logo from "../logo.svg";
import { Col, Row, Container } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function Battle() {
  let location = useLocation();

  return (
    <Container fluid>
      <Row>
        <Col size="md-12">
          <Jumbotron>
        
            <h1>Battle</h1>
            <h3>No match for <code>{location.pathname}</code></h3>
            <h1>
              {/* <span role="img" aria-label="Face With Rolling Eyes Emoji">
                
              </span> */}
            </h1>

          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
=======
import React, { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Chat from "../components/Chat";
import { SectionRow, Col } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../userContext";

function Battle() {
  const { userState } = useContext(UserContext);

  if (!userState.loggedIn) {
    return <Redirect to={{ pathname: userState.redirectTo }} />
  } else {
    return (
      <Wrapper className="App" id="main-container">
        <SectionRow id="main-section">
          <Col size="lg-12">
            <Chat />
          </Col>
        </SectionRow>
      </Wrapper>
    );
  }
>>>>>>> 120643eed4561d4b04a46bb7bac8412d8b20edf1
}

export default Battle;