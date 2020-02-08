import React, { useState } from "react";
import "./style.css";

const Range = props => {
  return (
    // render current the filled range of progress bar along its width
    <div className="range" style={{ width: `${props.percentRange}%` }} />
  );
};

const ProgressBar = props => {
  return (
    <div className="progress-bar">
      {/*render available progress bar’s limit*/}
      <Range percentRange={props.percentRange} />
    </div>
  );
};

export const ProgressBarContainer = props => {
  console.log("ProgressBarContainer", props);

  // const { gameState, setGameState } = props;
  // const [percentRange, setProgress] = useState(gameState.ally_hp || 100);

  return (
    <div>
      <ProgressBar percentRange={props.team === "ally" ? props.gameState.ally_hp : props.gameState.rival_hp} />
      {/* <div className="toggle-buttons">
        <button
          onClick={() => {
            const Attack = new Promise((resolve, reject) => {
              let damage = props.playerObj.handleAttack({ 
                game_id: props.game_id,
                ally_id: props.user_id,
                ally_hero_id: props.hero,
                ally_hero_attack1_dmg: props.selectedHero.attack1_dmg,
                ally_hero_attack2_dmg: props.selectedHero.attack2_dmg
              });
              
              resolve(damage);
            });

            Attack.then(calculatedDamage => {
              console.log("gameState", props.gameState);
              props.setGameState(prevState =>({...prevState,
                rival_hp: props.gameState.rival_hp > 0 ? props.gameState.rival_hp - (calculatedDamage || 20) : 0
              }));
            });
          }}
        >
          Attack
        </button>
      </div> */}
    </div>
  );
};
