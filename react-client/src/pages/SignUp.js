import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { Col, Row, SectionRow, Container } from "../components/Grid";
import Card from "../components/Card";
import UserContext from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faUser, faUserPlus} from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const { userState, handleUserChange, handleRegisterSubmit } = useContext(UserContext);

  if (userState.redirectTo) {
    return <Redirect to={{ pathname: userState.redirectTo }} />
  } else {
    return (
      <Wrapper className="App" id="main-container">
        <SectionRow id="main-section">
          <Col size="lg-6" addClass="mx-auto">
            <Card 
              htag="h2" 
              heading="Sign Up"
              bg="dark"
            >
              <form>
                <div className="form-group row">
                  <label className="col-sm-3 form-label" htmlFor="username">Username</label>
                  <div className="col-sm-9 input-group">
                    <input className="form-input"
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      value={userState.username}
                      onChange={(e) => handleUserChange(e)}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-3 form-label" htmlFor="password">Password: </label>
                  <div className="col-sm-9 input-group">
                    <input className="form-input"
                      name="password"
                      type="password"
                      placeholder="password"
                      value={userState.password}
                      onChange={(e) => handleUserChange(e)}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <span className="col-sm-12 input-group-btn text-right">
                    <button 
                      className="btn btn-dark form-input"
                      onClick={(e) => handleRegisterSubmit(e)}
                      type="submit">
                        <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                    </button>
                  </span>
                </div>
              </form>
            </Card>
          </Col>
        </SectionRow>
      </Wrapper>
    )
  }
}

export default SignUp;
