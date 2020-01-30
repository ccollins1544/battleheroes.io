import React, { Component, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  useLocation
} from "react-router-dom";
import { UserProvider } from "./userContext";
import UserContext from "./userContext";
// import { allChatListener } from "./utils/socket_client.js";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import ChooseHero from "./pages/ChooseHero";
import Battle from "./pages/Battle";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Index from "./pages";
import Chat from "./components/Chat";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UserProvider>
        <Router>
          <div className="App">
            <Header />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/challenge" component={Challenge}></Route>
              <Route exact path="/choose-hero" component={ChooseHero}></Route>
              <Route path="/battle" component={Battle}></Route>
              <Route path="*" component={Index} />
            </Switch>

            <Footer />
          </div>
        </Router>
      </UserProvider>
    );
  }
}

export default App;
