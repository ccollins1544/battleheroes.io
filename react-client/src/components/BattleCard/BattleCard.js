import React, { Component } from "react";
import { ProgressBarContainer } from "../ProgressBar/ProgressBar";
import "./BattleCard.css";
import API from "../../utils/API";
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
          <h6 className="card-subtitle mb-2 text-muted">{this.props.playerObj && this.props.playerObj.username.split('@')[0]}</h6>

          <ProgressBarContainer {...this.props} />
          <p className="card-text battle-card-text">

            <li className="list-group-item">
              <b>{this.props.selectedHero ? this.props.selectedHero.name : ""}</b>
            </li>

            <li className="list-group-item">
              <b>MAX HP: {this.props.playerObj && this.props.playerObj.max_hp}</b>
            </li>
              
            <li className="list-group-item">
              <b>ATK 1:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack1_description : ""}</i>
            </li>

            <li className="list-group-item">
              <b>ATK 2:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack2_description : ""}</i>
            </li>
          </p>
          {/* {this.props.team === "rival" ? ( */}
          {(!(this.props.gameState.true_rival !== this.props.true_rival && this.props.team === "rival") || 
           (this.props.gameState.true_rival === this.props.true_rival && this.props.team === "ally")) || true ? (
            <button type="button" className="btn btn-danger btn-lg btn-block"
              onClick={() => {
                
                // setTimeout(() => this.props.updateGame(), 500);
                
                const Attack = new Promise((resolve, reject) => {

                  if(this.props.team === "ally"){
                    let damage = this.props.playerObj.handleAttack({ 
                      game_id: this.props.playerObj.game_id,
                      ally_id: this.props.playerObj.id,
                      ally_hero_id: this.props.playerObj.hero,
                      ally_hero_attack1_dmg: (this.props.selectedHero.attack1_dmg) ? 
                        this.props.selectedHero.attack1_dmg : this.props.playerObj.selectedHero.attack1_dmg,
                      ally_hero_attack2_dmg: (this.props.selectedHero.attack2_dmg) ? 
                        this.props.selectedHero.attack2_dmg : this.props.playerObj.selectedHero.attack2_dmg,
                    });
                    resolve(damage);

                  }else{
                    let damage = this.props.playerObj.handleAttack({ 
                      game_id: this.props.playerObj.game_id,
                      rival_id: this.props.playerObj.id,
                      rival_hero_id: this.props.playerObj.hero,
                      rival_hero_attack1_dmg: (this.props.selectedHero.attack1_dmg) ? 
                        this.props.selectedHero.attack1_dmg : this.props.playerObj.selectedHero.attack1_dmg,
                      rival_hero_attack2_dmg: (this.props.selectedHero.attack2_dmg) ? 
                        this.props.selectedHero.attack2_dmg : this.props.playerObj.selectedHero.attack2_dmg,
                    });

                    resolve(damage);
                  }
                });
    
                Attack.then(calculatedDamage => {
                  console.log("gameState", this.props.gameState);

                  if(this.props.team === "ally"){
                    let starting_rival_hp = (this.props.gameState.rival_hp) ? this.props.gameState.rival_hp : (
                      (this.props.playerObj.hp) ? this.props.playerObj.hp : 100
                    );

                    calculatedDamage = (calculatedDamage || 20);
                    let new_hp = starting_rival_hp > 0 ? starting_rival_hp - calculatedDamage : 0;
                    this.props.setGameState(prevState => ({...prevState,
                      rival_hp: (new_hp > 0) ? new_hp : 0
                    }));

                    return { 
                      game_id: this.props.playerObj.game_id,
                      rival_id: this.props.id ? this.props.id : this.props.playerObj.user_id,
                      rival_hero_id: this.props.playerObj.hero ? this.props.playerObj.hero : 
                        (this.props.playerObj.selectedHero._id ? this.props.playerObj.selectedHero._id : this.props.selectedHero._id),
                      rival_hero_hp: (new_hp > 0) ? new_hp : 0,
                    };

                  }else{
                    let starting_ally_hp = (this.props.gameState.ally_hp) ? this.props.gameState.ally_hp : (
                      (this.props.playerObj.hp) ? this.props.playerObj.hp : 100
                    );

                    calculatedDamage = (calculatedDamage || 20);
                    let new_hp = starting_ally_hp > 0 ? starting_ally_hp - calculatedDamage : 0;
                    this.props.setGameState(prevState => ({...prevState,
                      ally_hp: (new_hp > 0) ? new_hp : 0
                    }));

                    return { 
                      game_id: this.props.playerObj.game_id,
                      ally_id: this.props.id ? this.props.id : this.props.playerObj.user_id,
                      ally_hero_id: this.props.playerObj.hero ? this.props.playerObj.hero : 
                        (this.props.playerObj.selectedHero._id ? this.props.playerObj.selectedHero._id : this.props.selectedHero._id),
                      ally_hero_hp: (new_hp > 0) ? new_hp : 0,
                    };
                  }

                }).then(attackedData => {
                  console.log("attackedData", attackedData);

                  API.attackPlayer(attackedData).then(gameResponse => {
                    console.log("gameResponse", gameResponse);
                  });

                })
              }}

            >
              ATTACK
            </button>
          ) : (
            <button type="button" className="btn btn-danger btn-lg btn-block" onClick={() => this.props.updateGame()}>Pending Turn...</button>
          )}
        </div>
      </div>
    );
  }
}

export default BattleCard;
