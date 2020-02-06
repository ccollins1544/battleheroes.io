import React, { useContext, useState } from "react";
import UserContext from "../userContext";
import Utils from "../utils/";
import Wrapper from "../components/Wrapper";
import { Col, SectionRow } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faUser } from "@fortawesome/pro-solid-svg-icons";

const Login = () => {
const { userState, handleLoginSubmit } = useContext(UserContext);
  const [ loginForm, setLoginForm ] = useState({
    username: userState.username,
    password: "",
    validate_form: false
  });

  const validateForm = () => {
    let isValid = false;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginForm.username) === false){
      Utils.AlertMessage("You have entered an invalid email address!", "danger");
    }else if(loginForm.password.length < 1 ){
      Utils.AlertMessage("Missing password", "info");
    }else{
      Utils.AlertMessage("Looks Good!", "success");
      isValid = true;
    }

    setLoginForm(prevState => ({...prevState, 
      validate_form: isValid
    }));
  }

  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-6" addClass="mx-auto">
          <Card 
            htag="h2" 
            heading="Login"
            bg="dark"
          >
            <form>
              <div className="form-group row">
                <label className="col-sm-3 form-label" htmlFor="username">Email:</label>
                <div className="col-sm-9 input-group">
                  <input className="form-input"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setLoginForm(prevState => ({...prevState, 
                        [name]: value 
                      }))
                    }}
                    onKeyUp={() => validateForm()}
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
                    value={loginForm.password}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setLoginForm(prevState => ({...prevState, 
                        [name]: value 
                      }))
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>
              </div>
              <div className="form-group row">
                <span className="col-sm-12 input-group-btn text-right">
                  <button 
                    className="btn btn-dark form-input"
                    onClick={(e) => {
                      e.preventDefault();
                      if(loginForm.validate_form){
                        handleLoginSubmit(loginForm);
                      }
                    }}
                    type="submit">
                      <FontAwesomeIcon icon={faUser} /> Login
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

export default Login;
