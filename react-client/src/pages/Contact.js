import React, { useContext, useState } from "react";
import Wrapper from "../components/Wrapper";
import { Col, SectionRow } from "../components/Grid";
import Card from "../components/Card";
import API from "../utils/API";
import UserContext from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";

const Contact = () => {
  const { userState } = useContext(UserContext);
  const [ contactForm, setContactForm ] = useState({
    recipient: "admin@battleheroes.io",
    from_email: "",
    subject: "",
    message: ""
  });
  
  return (
    <Wrapper className="App" id="main-container">
      <SectionRow id="main-section">
        <Col size="lg-6" addClass="mx-auto">
          <Card 
            htag="h2" 
            heading="Contact Us"
            bg="dark"
          >
            <form>
              <div className="form-group row">
                <label className="col-sm-3 form-label" htmlFor="from_email">Your Email</label>
                <div className="col-sm-9 input-group">
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
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 form-label" htmlFor="subject">Subject</label>
                <div className="col-sm-9 input-group">
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
                  />
                </div>

              </div>
              <div className="form-group row">
                <label className="col-sm-3 form-label" htmlFor="message">Message</label>
                <div className="col-sm-9 input-group">
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
                  />
                </div>
              </div>
              <div className="form-group row">
                <span className="col-sm-12 input-group-btn text-right">
                  <button 
                    className="btn btn-dark form-input"
                    onClick={(e) => {
                      e.preventDefault();  
                      API.sendChallenge(contactForm)
                        .then( res => console.log("sendChallenge response:", res));
                    }}
                    type="submit">
                      <FontAwesomeIcon icon={faEnvelopeOpen} /> Send Email
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

export default Contact;
