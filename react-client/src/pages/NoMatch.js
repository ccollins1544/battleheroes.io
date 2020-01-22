import React from "react";
import logo from "../logo.svg";
import { Col, Row, Container } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function NoMatch() {
  let location = useLocation();

  return (
    <Container fluid>
      <Row>
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
        </Col>
      </Row>
    </Container>
  );
}

export default NoMatch;