import React from "react";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import { SectionRow , Col } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { sendAllChat, allChatListener } from "../utils/socket_client.js";
import "./chat.css"; 

const Home = () => {
  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12">
          <Card heading="Chat Window" bg="dark">

            <div className="top_menu">
              <div className="buttons">
                <div className="button close"></div>
                <div className="button minimize"></div>
                <div className="button maximize"></div>
              </div>
              <div className="title">Chat</div>
            </div>

            <ul id="messages" className="messages">

            </ul>

            <div className="bottom_wrapper clearfix">
              <i id="typing"></i>
              <form id="form" >
                <div className="message_input_wrapper">
                  <input 
                    id="message" 
                    name="message"
                    className="message_input" 
                    placeholder="Type your message here..." 
                  />
                  <input type="hidden" name="sender" value="Anonymous" />
                </div>
                <button onClick={(e) => e.preventDefault() }>Send</button>
              </form>
            </div>

          </Card>
        </Col>
      </SectionRow>
    </Wrapper>
  );
};

export default Home; 