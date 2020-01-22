import React, { Component } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import Wrapper from '../components/Wrapper';
import { Col, Row, Container, SectionRow } from '../components/Grid';
import Hero from '../components/Hero';

class Home extends Component {
  constructor(props) {
    super(props);
    console.log("home_props", this.props);
  }
  
  state = {
    heroes: [],
    clickedHeroes: [],
    score: 0,
    highScore: 0,
    pageTitle: "Battle Heroes",
    game_message: "Click any image to start"
  };

  componentDidMount(){
    this.loadHeroes();
  }

  loadHeroes = () => {
    if(this.state.heroes.length === 0){
      axios.get('./heroes.json')
        .then(res => this.setState({ heroes: this.shuffleArray(res.data) }))
        .catch(err => console.log(err));
    }else{
      this.setState( prevState => ({heroes: this.shuffleArray(prevState.heroes)}));
    }
  };

  handleHeroClick = id => {
    if(!this.state.clickedHeroes.includes(id)){
      this.setState( prevState => ({
        game_message: "Good Job",
        clickedHeroes: [...prevState.clickedHeroes, id],
        score: prevState.score + 1
      }));

    }else{
      this.setState( prevState => ({
        game_message: "You Lose!",
        clickedHeroes: [],
        score: 0,
        highScore: (prevState.score > prevState.highScore) ? prevState.score : prevState.highScore
      }));
    }

    this.loadHeroes();
    return;
  };

  shuffleArray = a => {
    for (let i = a.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  render(){ 
    return (
      <>
        <Header 
          game_message={this.state.game_message}
          score={this.state.score}
          highScore={this.state.highScore}
          pageTitle={this.state.pageTitle}
          updateUser={this.props.updateUser} 
          loggedIn={this.props.loggedIn}
          username={this.props.username}
        />
        <Wrapper id="main-container">
          <SectionRow elementID="main-section">
            {this.state.heroes.length ? (
              this.state.heroes.map(hero => {
                return (
                  <Hero 
                    key={hero._id}
                    id={hero._id}
                    heading={hero.name}
                    src={hero.image}
                    handleHeroClick={this.handleHeroClick}
                  />
                );
              })
            ) : (
              <h3>No Heroes to Display</h3>
            )}
          </SectionRow>
        </Wrapper>
      </>
    );
  }
}

export default Home;