import { useState } from "react";
import "./App.css";
import card from "./components/Coaster";
import Coaster from "./components/Coaster";
import Searchbar from "./components/Searchbar";

function App() {
  //Where the coasters selected from the searchbar are stored
  const [selectedCoasters, setSelectedCoasters] = useState([]);

  //Function to add a coaster to the selectedCoasters array
  const handleCoasterSelection = (coaster) => {
    setSelectedCoasters((prevSelectedCoasters) => [
      ...prevSelectedCoasters,
      coaster,
    ]);
  };

  //Function to remove a coaster from the selectedCoasters array
  const handleDeleteCoaster = (id) => {
    setSelectedCoasters((prevSelectedCoasters) =>
      prevSelectedCoasters.filter((coaster) => coaster.id !== id)
    );
  };

  return (
    <>
      <div className="header">
        <h1>Rollercoaster Ranking</h1>
        <p>
          Rank your favorite rollercoasters! Search and select the rollercoaster
          you want to rank and drag it to your desired position.
        </p>
      </div>

      <div className="container">
        <div id="search">
          <h2>Add Coasters</h2>
          <Searchbar onCoasterSelection={handleCoasterSelection} />
        </div>
        <div id="coasters">
          <div id="labels">
            <h2>Rank</h2>
            <h2>Coaster</h2>
            <h2>Park</h2>
          </div>

          {selectedCoasters.map((coaster) => (
            <Coaster
              id={coaster.id}
              name={coaster.name}
              park={coaster.park}
              rank={coaster.rank}
              onDeleteCoaster={handleDeleteCoaster}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
