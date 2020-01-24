import React, { Component } from 'react';
import "./ImageCard.css"
import Tilt from "react-tilt"

class ImageCard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      hover: false
    }
  }

  onMouseEnter = () => {
    this.setState({hover: true})
  };
  
  onMouseLeave = () => {
    this.setState({hover: false})
  };
  
  render(){ 
    return (
      <Tilt 
        key={this.props.id}
        id={this.props.id}
        className={["Tilt", "card bg-dark text-center", this.props.addClasses].join(" ")}
        style={this.state.hover ? {zIndex:1} : {zIndex:0}}
        onMouseEnter={() => this.onMouseEnter() }
        onMouseLeave={() => this.onMouseLeave() }
        options={
          { 
            max: 40,
            perspective: 1000,
            scale: 1.50,
            speed: 300,
            transition: true,
            reset: true,
          }
        }
      >
        <img 
          className="card-img-top Tilt-inner" 
          src={this.props.src} 
          alt={this.props.heading} 
          onClick={() => this.props.handleHeroClick(this.props.id)} 
        />
        <div className="card-body bg-dark text-center" style={this.state.hover ? {opacity: 1} : {opacity: 0}} >
          <h5 className="card-title">{this.props.heading}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{this.props.subtitle}</h6>
          <p className="card-text font-weight-bold">{this.props.text}</p>
          {this.props.children}
        </div>
      </Tilt>
    );
  }
}

export default ImageCard;
