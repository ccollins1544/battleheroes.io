import React, { useState } from "react";
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
  const [percentRange, setProgress] = useState(props.hp || 100);

  return (
    <div className="container">
      {/*pass the percentageRange state to other components*/}
      <ProgressBar percentRange={percentRange} />
      <div className="toggle-buttons">
        {/* call setProgress func on button click and bind the callback*/}
        {/* depending on the percentageRange condition to decrease /*/}
        {/* increase in 20% range and reset the progress bar status*/}
        <button
          onClick={() => setProgress(percentRange > 0 ? percentRange - 20 : 0)}
        >
          Attack
        </button>
      </div>
    </div>
  );
};
