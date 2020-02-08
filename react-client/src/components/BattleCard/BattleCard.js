import React, { Component } from "react";
import "./BattleCard.css";
class BattleCard extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
  }
  render() {
    return (
      <div className="card battle-card" style={{width: "18rem"}}>
        <img
          src={this.props.selectedHero ? this.props.selectedHero.image : ""}
          className="card-img-top"
          alt="green ranger"
        />
        <div className="card-body">
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{width: "40%"}}
              aria-valuenow="15"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              40%
            </div>
            <div
              className="progress-bar bg-warning"
              role="progressbar"
              style={{width: "40%"}}
              aria-valuenow="30"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              40%
            </div>
            <div
              className="progress-bar bg-danger"
              role="progressbar"
              style={{width: "20%"}}
              aria-valuenow="30"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              20% 
            </div>
          </div>
          <p className="card-text battle-card-text">
            <li className="list-group-item">
              
              <b>{this.props.selectedHero ? this.props.selectedHero.name : ""}</b>
            </li>
            <li className="list-group-item">
              
              <b>MAX HP: 100</b>
            </li>
            <li className="list-group-item">
              
              <b>ATK 1:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack1_description : ""}</i>
            </li>
            <li className="list-group-item">
              
              <b>ATK 2:</b> <i>{this.props.selectedHero ? this.props.selectedHero.attack2_description : ""}</i>
            </li>
          </p>
          <button type="button" className="btn btn-danger btn-lg btn-block">
            ATTACK
          </button>
        </div>
      </div>
    );
  }
}

export default BattleCard;
