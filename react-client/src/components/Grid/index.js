import React from "react";

// Exporting the Container, Row, and Col components from this file

// This Container component allows us to use a bootstrap container without worrying about class names
export function Container({ fluid, children }) {
  return <div className={`container${fluid ? "-fluid" : ""}`}>{children}</div>;
}

// This Row component lets us use a bootstrap row without having to think about class names
export function Row({ fluid, children }) {
  return <div className={`row${fluid ? "-fluid" : ""}`}>{children}</div>;
}

export function SectionRow({ fluid, id, children }) {
  return <div className={["section-block", `row${fluid ? "-fluid" : ""}`].join(" ")} id={id}>{children}</div>;
}

export function FullSectionRow({ fluid, id, children }) {
  return <div className={["full-section-block", `row${fluid ? "-fluid" : ""}`].join(" ")} id={id}>{children}</div>;
}

// This Col component lets us size bootstrap columns with less syntax
// e.g. <Col size="md-12"> instead of <div className="col-md-12">
export function Col({ size, addClass, children }) {
  return (
    <div
      className={[size.split(" ").map(size => "col-" + size).join(" "), addClass].join(" ")}
    >
      {children}
    </div>
  );
}
