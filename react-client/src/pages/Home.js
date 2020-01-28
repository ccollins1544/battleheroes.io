import React from "react";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
          <Card heading="Home" bg="dark"></Card>
        </Col>
      </SectionRow>
    </Wrapper>
  );
};

export default Home; 