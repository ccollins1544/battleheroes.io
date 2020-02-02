import React, { useContext, useState } from "react";
import UserContext from "../userContext";
import Wrapper from "../components/Wrapper";
import { Col, SectionRow } from "../components/Grid";
import Card from "../components/Card";
import API from "../utils/API";
import Utils from "../utils/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";

const Contact = () => {
  const { userState } = useContext(UserContext);
  const [ contactForm, setContactForm ] = useState({
    recipient: "admin@battleheroes.io",
    from_email: "",
    subject: "",
    message: "",
    sent: false,
    validate_form: false
  });

  const validateForm = () => {
    let isValid = false;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contactForm.from_email) === false && contactForm.from_email !== userState.username){
      Utils.AlertMessage("You have entered an invalid email address!", "danger");
    }else if(contactForm.subject.length < 1 ){
      Utils.AlertMessage("Missing subject", "info");
    }else if(contactForm.message.length < 1 ){
      Utils.AlertMessage("Missing message", "info");
    }else{
      Utils.AlertMessage("Looks Good!", "success");
      isValid = true;
    }

    setContactForm(prevState => ({...prevState, 
      validate_form: isValid
    }));
  }
  
  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mx-auto">
          <Card 
            htag="h2" 
            heading={!contactForm.sent ? "Contact Us" : "Thank You!"}
            subtitle
            bg="dark"
          >
            {!contactForm.sent ? (<form>
              <div className="form-group row">
                <div className="col-sm-12 input-group">
                  <input className="form-input"
                    type="text"
                    id="from_email"
                    name="from_email"
                    placeholder="Your Email"
                    value={userState.username}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setContactForm(prevState => ({...prevState, 
                          [name]: value 
                      }))
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-12 input-group">
                  <input className="form-input"
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setContactForm(prevState => ({...prevState, 
                        [name]: value 
                      }))
                    }}
                    onKeyUp={() => validateForm()}
                  />
                </div>

              </div>
              <div className="form-group row">
                <div className="col-sm-12 input-group">
                  <textarea className="form-input"
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Message"
                    value={contactForm.message}
                    onChange={(event) => {
                      const { name, value } = event.target; 
                      setContactForm(prevState => ({...prevState, 
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
                      
                      if(contactForm.validate_form){
                        API.sendEmail(contactForm)
                          .then( response => { 
                            if(response.status === 200){
                              Utils.AlertMessage(response.data);
                              setContactForm(prevState => ({...prevState, 
                                sent: true 
                              }));
                            }else{
                              Utils.AlertMessage("Error: " + JSON.stringify(response), "danger");
                              setContactForm(prevState => ({...prevState, 
                                sent: false 
                              }));
                            }
                          });
                      }
                    }}
                    type="submit">
                      <FontAwesomeIcon icon={faEnvelopeOpen} /> Send Email
                  </button>
                </span>
              </div>
            </form>) : (
              <h6 className="card-subtitle mb-2 text-muted">We appreciate the feedback.</h6>
            )}
          </Card>
        </Col>
      </SectionRow>
    </Wrapper>
  )
}

export default Contact;
