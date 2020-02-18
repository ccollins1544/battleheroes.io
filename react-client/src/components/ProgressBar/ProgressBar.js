import React, { useState } from "react";
import "./style.css";

const Range = props => {
  return (
    <div className="range" style={{ width: `${props.percentRange}%` }} />
  );
};

const ProgressBar = props => {
  return (
    <div className="progress-bar">
      <Range percentRange={props.percentRange} />
    </div>
  );
};

export const ProgressBarContainer = props => {
  console.log("ProgressBarContainer", props);
  return (
    <div>
      <ProgressBar percentRange={props.team === "ally" ? props.gameState.instigator_hp : props.gameState.rival_hp} />
    </div>
  );
};
