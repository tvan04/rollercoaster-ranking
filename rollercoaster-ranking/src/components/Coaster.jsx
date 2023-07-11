function Coaster(props) {
  return (
    <div className="card">
        <h2>{props.name}</h2>
        <div className = "actions">
            <button className="btn">+</button>
            <button className="btn">-</button>
            <button className="btn">🗑️</button>
        </div>
    </div>
  );
}

export default Coaster;