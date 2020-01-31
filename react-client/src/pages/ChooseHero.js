<<<<<<< HEAD
import React from "react";
import logo from "../logo.svg";
import { Col, Row, Container } from "../components/Grid";
import Jumbotron from "../components/Jumbotron";
import { useLocation } from "react-router-dom";

function ChooseHero() {
  let location = useLocation();

  return (
    <Container fluid>
      <Row>
        <Col size="md-12">
          <Jumbotron>
        
            <h1>ChooseHero</h1>
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
import { Redirect } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import UserContext from "../userContext";
import Hero from "../components/Hero/"

const ChooseHero = () => {
  const { userState } = useContext(UserContext);

  if (userState.redirectTo) {
    return <Redirect to={{ pathname: userState.redirectTo }} />
  } else {
    return (
      <Wrapper className="App" id="main-container">
        <SectionRow id="main-section">
          <Hero />
        </SectionRow>
      </Wrapper>
    );
  }
>>>>>>> 120643eed4561d4b04a46bb7bac8412d8b20edf1
}

export default ChooseHero;