import React, { Component } from "react";
import { ProgressBarContainer } from "../ProgressBar/ProgressBar";
import "./BattleCard.css";
class BattleCard extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
  }
  
  render() {
    return (
      <div className="card battle-card">
        <img
          src={this.props.selectedHero ? this.props.selectedHero.image : ""}
          className="card-img-top"
          alt="green ranger"
        />
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">{this.props.playerObj.username.split('@')[0]}</h6>

          <ProgressBarContainer {...this.props} />
          <p className="card-text battle-card-text">

            <li className="list-group-item">
              <b>{this.props.selectedHero ? this.props.selectedHero.name : ""}</b>
            </li>

            <li className="list-group-item">
              <b>MAX HP: {this.props.playerObj.max_hp}</b>
            </li>
              
            <li className="list-group-item">
              <b>ATK 1:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack1_description : ""}</i>
            </li>

            <li className="list-group-item">
              <b>ATK 2:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack2_description : ""}</i>
            </li>
          </p>
          <button type="button" className="btn btn-danger btn-lg btn-block"
            onClick={() => {
              const Attack = new Promise((resolve, reject) => {
                let damage = this.props.playerObj.handleAttack({ 
                  game_id: this.props.game_id,
                  ally_id: this.props.user_id,
                  ally_hero_id: this.props.hero,
                  ally_hero_attack1_dmg: this.props.selectedHero.attack1_dmg,
                  ally_hero_attack2_dmg: this.props.selectedHero.attack2_dmg
                });
                
                resolve(damage);
              });
  
              Attack.then(calculatedDamage => {
                console.log("gameState", this.props.gameState);
                this.props.setGameState(prevState =>({...prevState,
                  rival_hp: this.props.gameState.rival_hp > 0 ? this.props.gameState.rival_hp - (calculatedDamage || 20) : 0
                }));
              });
            }}

          >
            ATTACK
          </button>
        </div>
      </div>
    );
  }
}

export default BattleCard;
