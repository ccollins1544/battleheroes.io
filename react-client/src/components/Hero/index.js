import React from "react";
import ImageCard from "../Card/ImageCard";

function Hero({ id, addClasses="col-lg-3 col-md-6 col-sm-12", src, heading, subtitle, text, handleHeroClick }){
  return (
    <ImageCard 
      id={id}
      key={id}
      addClasses={addClasses}
      src={src}
      heading={heading}
      subtitle={subtitle}
      text={text}
      handleHeroClick={handleHeroClick}
    />
  )
}

export default Hero;