import React from "react";
import "./Coaster.css";

function Coaster(props) {
  function deleteCoaster() {
    props.onDeleteCoaster(props.id);

  }

  return (
    <div className="card">
      <h1>{props.rank}</h1>
      <h2>{props.name}</h2>
      <p>{props.park}</p>
      <div className="buttons">
        <button className="btn" onClick={deleteCoaster}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Coaster;
