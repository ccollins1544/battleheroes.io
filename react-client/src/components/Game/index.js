import React, { Component } from "react";
import Firebase from "firebase";
import firebaseConfig from "../../config/firebase";
import API from "../../utils/API";
import Utils from "../../utils";
import HeroCard from "../Card/heroCard";
import { SectionRow , Col } from "../Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered } from "@fortawesome/pro-duotone-svg-icons";

class Game extends Component {
  constructor(props){
    super(props);
    console.log("LOAD THIS BITCH", props);

    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }

    this.state = {
      _id: "",
      instigator_id: "",
      instigator_hero_id: "",
      instigator_hero_hp: "",
      rival_id: "",
      rival_hero_id: "",
      rival_hero_hp: "",
      players: [],
      heroes: [],
      turn_count: 0,
      player_turn: "",
      in_game: false,
      createdAt: "",
      updatedAt: "",
      onlineAt: ""
    }
  }

  writeGameData = () => {
    Firebase.database().ref('/games').set(this.state);
    console.log('GAME DATA SAVED');
  }
  
  getUserData = () => {
    let connectedRef = Firebase.database().ref(".info/connected");
    
    API.getGameById(this.props.id)
    .then(gameResponse => {
      let { _id, players, heroes, turn_count, player_turn, in_game, 
        instigator_id, instigator_hero_id, instigator_hero_hp, 
        rival_id, rival_hero_id, rival_hero_hp, 
        createdAt, updatedAt } = gameResponse.data;
      let thisGame = {
        '_id': _id, 
        'players': players, 
        'heroes': heroes, 
        'turn_count': turn_count, 
        'player_turn': player_turn, 
        'in_game': in_game, 
        'instigator_id': instigator_id, 
        'instigator_hero_id': instigator_hero_id, 
        'instigator_hero_hp': instigator_hero_hp, 
        'rival_id': rival_id, 
        'rival_hero_id': rival_hero_id, 
        'rival_hero_hp': rival_hero_hp, 
        'createdAt': createdAt, 
        'updatedAt': updatedAt
      }
      thisGame.onlineAt = Firebase.database.ServerValue.TIMESTAMP;
      console.log("thisGame",thisGame);

      connectedRef.on('value', snapshot => {
        if(snapshot.val()){

          // let online_player = Firebase.database().ref('/games').push(gameResponse);
          
          // console.log("ONLINE PLAYER", online_player);
          // this.setState(online_player);

          // Remove user from the connection list when they disconnect.
          // online_player.onDisconnect().remove();
        }
      });
    });

    console.log('GAME DATA RETRIEVED');
  }

  componentDidMount() {
    this.getUserData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    // check on previous state
    // only write when it's different with the new state
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }
  
  render(){
    console.log("CURRENT STATE", this.state);
    return (
      <SectionRow id="main-section">
        <Col size="lg-12" addClass="mb-5">
          <h1>{this.props.pageContent.gameMessage}</h1>
        </Col>
        {this.state && <pre>{JSON.stringify(this.state)}</pre>}
      </SectionRow>
    );
  }
}

export default Game;
