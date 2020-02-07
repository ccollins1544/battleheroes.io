import React from "react";
import { ProgressBar } from "react-bootstrap";

class ProgressBarPage extends React.Component {
  render() {
    return (
      <div className="hello">
        <ProgressBar animated now={60} />
      </div>
    );
  }
}

export default ProgressBarPage;
