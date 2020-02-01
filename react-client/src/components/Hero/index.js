import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/API";
import HeroCard from "../Card/heroCard";
import UserContext from "../../userContext";

const Hero = () => {
  const { handleHeroClick } = useContext(UserContext);
  const [ heroes, setHeroes ] = useState([]);

  useEffect(() => {
    API.getAllHeroes()
      .then( response => response.data )
      .then( json => setHeroes(json));
  }, []);

  return (
    <>
      {heroes.length > 0 && heroes.map(hero => {
        return (
          <HeroCard 
            id={hero._id}
            key={hero._id}
            addClasses="col-lg-3 col-md-6 col-sm-12"
            src={hero.image}
            heading={hero.name}  
            subtitle={"HP: "+hero.hp}
            heroObject={hero}
            handleHeroClick={handleHeroClick}
          />
        );
      })}
    </>
  );
}

export default Hero;