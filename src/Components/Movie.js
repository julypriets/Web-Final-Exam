import React from "react";
import { Card } from "react-bootstrap";

const movie = props => {
  return (
    <div style={props.style}>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={props.poster} />
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>
           {props.description}
          </Card.Text>
          <small><b>Cast:{props.cast}</b></small>
        </Card.Body>
      </Card>
    </div>
  );
};

export default movie;

