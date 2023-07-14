import React from 'react';

function Coaster(props) {
  function deleteCoaster() {
    props.onDeleteCoaster(props.id);
  }

  return (
    <div className="card">
      <h2>{props.name}</h2>
      <div className="actions">
        <button className="btn">About</button>
        <button className="btn">+</button>
        <button className="btn">-</button>
        <button className="btn" onClick={deleteCoaster}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Coaster;
