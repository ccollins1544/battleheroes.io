import React from "react";
<<<<<<< HEAD
import logo from "../logo.svg";
import { Col, Row, Container } from "../components/Grid";
=======
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
>>>>>>> 120643eed4561d4b04a46bb7bac8412d8b20edf1
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function Challenge() {
  let location = useLocation();

  return (
<<<<<<< HEAD
    <Container fluid>
      <Row>
        <Col size="md-12">
=======
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
>>>>>>> 120643eed4561d4b04a46bb7bac8412d8b20edf1
          <Jumbotron>
        
            <h1>Challenge</h1>
            <h3>No match for <code>{location.pathname}</code></h3>
            <h1>
              {/* <span role="img" aria-label="Face With Rolling Eyes Emoji">
                
              </span> */}
            </h1>

          </Jumbotron>
        </Col>
<<<<<<< HEAD
      </Row>
    </Container>
=======
      </SectionRow>
    </Wrapper>
>>>>>>> 120643eed4561d4b04a46bb7bac8412d8b20edf1
  );
}

export default Challenge;