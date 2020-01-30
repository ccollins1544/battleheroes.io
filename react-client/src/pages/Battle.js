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
}

export default Battle;