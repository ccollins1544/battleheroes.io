import React, { Component } from 'react';
// import axios from 'axios'
import API from "./utils/API";
import { BrowserRouter as Router, Route, Link, Switch, Redirect, useLocation } from "react-router-dom";
import './App.css';
import Books from './pages/Books';
import Footer from './components/Footer'
import Home from './pages/Home';
import Index from './pages';
import SignupForm from "./components/Form/SignupForm";
import LoginForm from "./components/Form/LoginForm";

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      username: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser()
  }

  updateUser (userObject) {
    this.setState(userObject)
  }

  getUser() {
    // axios.get('/api/user').then(response => {
    API.user().then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/"
              render={(props) => <Home {...props} updateUser={this.updateUser} loggedIn={this.state.loggedIn} username={this.state.username} />}
            />
            <Route path="/login" 
              render={() => <LoginForm updateUser={this.updateUser} />} 
            />
            <Route path="/signup"
              render={() => <SignupForm signup={this.signup} />}
            />
            <Route exact path="/books" component={Books} />
            <Route path="*" component={Index} /> 
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

