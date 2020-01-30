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
}

export default ChooseHero;