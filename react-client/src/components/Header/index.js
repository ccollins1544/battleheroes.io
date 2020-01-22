import React, { Component } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faTrophy } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import API from "../../utils/API";
import Nav from '../Nav'
import './style.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
  }

  logout(event) {
    event.preventDefault()
    console.log('logging out')

    // axios.post('/user/logout').then(response => {
    API.logout().then(response => {  
      console.log("api.logout", response.data)
      if (response.status === 200) {
        this.props.updateUser({
          loggedIn: false,
          username: null
        })
      }
    }).catch(error => {
      console.log('Logout error')
    })
  }  

  render() {
    const loggedIn = this.props.loggedIn;
    console.log("loggedIn",loggedIn);
    console.log('navbar render, props: ')
    console.log(this.props);

    const default_style = {
      borderBottomColor: "#52616B",
      boxShadow: "0px 2px 4px 0px #52616B"
    };
  
    const winning_style = {
      borderBottomColor: "#28a745", 
      boxShadow: "0px 2px 4px 0px #28a745"
    };
  
    const losing_style = {
      borderBottomColor: "#E9290F", 
      boxShadow: "0px 2px 4px 0px #E9290F"
    };
  
    let game_alert = this.props.score > 0 ? "success" : ( this.props.highScore === this.props.score ? "" : "fail" );

    return (
      <header className="App-header" id="nav-container">
        <div 
          className="container-fluid clearfix"
          style={this.props.score > 0 ? winning_style : ( this.props.highScore === this.props.score ? default_style : losing_style)}
        >
        { loggedIn ? (
          <Nav 
            navBarClass="collapse show"
            listClass= "ml-auto"
            navBarBrand={true}
            pageTitle={this.props.pageTitle}
            game_message={loggedIn ? this.props.username : this.props.game_message}
            game_alert={game_alert}
            elementID="main-nav"
          >
            <li className="nav-item">
              <Link to="#" className="nav-link" onClick={this.logout}>logout</Link>
            </li>
          </Nav>
        ) : (
          <Nav 
              navBarClass="collapse show"
              listClass= "ml-auto"
              navBarBrand={true}
              pageTitle={this.props.pageTitle}
              game_message={loggedIn ? this.props.username : this.props.game_message}
              game_alert={game_alert}
              elementID="main-nav"
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">home</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">sign up</Link>
            </li>
          </Nav>
        )}
        </div>
      </header>
    );
  }
}

export default Header;
