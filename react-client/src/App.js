import React, { Component } from "react";
import { UserProvider } from "./userContext";
import { GameProvider } from "./gameContext";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import ChooseHero from "./pages/ChooseHero";
import Battle from "./pages/Battle";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Index from "./pages";

class App extends Component {
  render() {
    return (
      <UserProvider>
        <Router>
          <div className="App" >
            <Header />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/contact" component={Contact} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/choose-hero" component={ChooseHero}></Route>
              <GameProvider>
                <Route exact path="/challenge" component={Challenge}></Route>
                <Route path="/battle" component={Battle}></Route>
              </GameProvider>
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
