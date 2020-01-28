import React from "react";

function Card({ id, bg, htag, heading, headingLink, headingAlign, image, children}) {

  const renderHeading = (tag, text, link) => {

    switch (tag) {
      case "h1":
    return link !== undefined ? <a href={link} target="_blank"><h1>{text}</h1></a> : <h1>{text}</h1>;
      case "h3":
        return link !== undefined ? <a href={link} target="_blank"><h3>{text}</h3></a> : <h3>{text}</h3>;
      case "h4":
        return link !== undefined ? <a href={link} target="_blank"><h4>{text}</h4></a> : <h4>{text}</h4>;
      case "h5":
        return link !== undefined ? <a href={link} target="_blank"><h5>{text}</h5></a> : <h5>{text}</h5>;
      case "h6":
        return link !== undefined ? <a href={link} target="_blank"><h6>{text}</h6></a> : <h6>{text}</h6>;
      default:
        return link !== undefined ? <a href={link} target="_blank"><h2>{text}</h2></a> : <h2>{text}</h2>;
    }
  }

  return (
    <div className={["card", `${bg ? "bg-" + bg : ""}`].join(" ")} id={`card_${id}`}>
      {heading && <div className="card-header">{renderHeading(htag, heading, headingAlign, headingLink)}</div>}
      {image && <img className="card-img-top" src={image} alt={heading} />}
      <div className={["card-body", `${bg ? "bg-" + bg : ""}`].join(" ")}>{children}</div>
    </div>
  );
}

export default Card;