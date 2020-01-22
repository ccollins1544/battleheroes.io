import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, useLocation } from "react-router-dom";
import './App.css';
import Books from './pages/Books';
import Default from './pages';

// basename={window.location.pathname || ''}
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/books" component={Books} />
          <Route path="*" component={Default} /> 
        </Switch>
      </div>
    </Router>
  ); 
}

export default App;
