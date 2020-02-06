import React, { useContext, useState } from "react";
import UserContext from "../userContext";
import Wrapper from "../components/Wrapper";
import { Col, SectionRow } from "../components/Grid";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faUser, faUserPlus} from "@fortawesome/pro-solid-svg-icons";
import Utils from "../utils";

const SignUp = () => {
  const { userState, handleRegisterSubmit } = useContext(UserContext);
  const [ signupForm, setSignupForm ] = useState({
    username: userState.username,
    password: "",
    confirm_password: "",
    validate_form: false,
  });

  const validateForm = () => {
    let isValid = false;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(signupForm.username) === false ){
      Utils.AlertMessage("You have entered an invalid email address!", "danger");
    }else if(signupForm.password !== signupForm.confirm_password){
      Utils.AlertMessage("Your passwords don't match!", "danger");
    }else if(signupForm.password.length < 8 ){
      Utils.AlertMessage("Your password must be 8 characters or longer", "info");
    }else{
      Utils.AlertMessage("Looks Good!", "success");
      isValid = true;
    }

    setSignupForm(prevState => ({...prevState, 
      validate_form: isValid
    }));
  }

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
                <div className="col-sm-12 input-group">
                  <input className="form-input"
                    type="email"
                    id="username"
                    name="username"
                    placeholder="Email"
                    value={signupForm.username}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setSignupForm(prevState => ({...prevState, 
                        [name]: value
                      }));
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-12 input-group">
                  <input className="form-input"
                    name="password"
                    type="password"
                    placeholder="password"
                    value={signupForm.password}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setSignupForm(prevState => ({...prevState, 
                        [name]: value
                      }));
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-12 input-group">
                  <input className="form-input"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    value={signupForm.confirm_password}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setSignupForm(prevState => ({...prevState, 
                        [name]: value
                      }));
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>
              </div>
              <div className="form-group row">
                <span className="col-sm-12 input-group-btn text-right">
                  <button 
                    className="btn btn-dark form-input"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();

                      if(signupForm.validate_form){
                        handleRegisterSubmit(signupForm);
                        Utils.AlertMessage("Success!", "success");
                      }
                    }} >
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

export default SignUp;
