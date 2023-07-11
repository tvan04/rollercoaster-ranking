function Coaster(props) {
    function deleteCoaster() {
        console.log(props.name)

    }

    
  return (
    <div className="card">
        <h2>{props.name}</h2>
        <div className = "actions">
            <button className="btn">About</button>
            <button className="btn">+</button>
            <button className="btn">-</button>
            <button className="btn" onClick={deleteCoaster}>🗑️</button>
        </div>
    </div>
  );
}

export default Coaster;