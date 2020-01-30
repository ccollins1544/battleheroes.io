import React, { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { SectionRow, Col } from "../components/Grid";
import Chat from "../components/Chat/";
import Jumbotron from "../components/Jumbotron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../userContext";

function Battle() {
  const { userState } = useContext(UserContext);

  // let location = useLocation(); 
  // let urlArray = (location.pathname).split("/").filter(function (el) {
  //   return el != "";
  // });
  
  // let urlObject = {
  //   page: urlArray[0],
  //   user_id: urlArray[1],
  //   game_id: urlArray[2],
  // }

  // console.log("STUFF", urlObject);

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