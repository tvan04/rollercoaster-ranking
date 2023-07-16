import React from "react";
import "./Coaster.css";

function Coaster(props) {
  function deleteCoaster() {
    props.onDeleteCoaster(props.id);
  }

  return (
    <div className="card">
      <h1>{props.rank}</h1> {/* Added rank */}
      <h2>{props.name}</h2>
      <p>{props.park.name}</p>
      <div className="buttons">
        <button className="btn" onClick={deleteCoaster}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Coaster;
