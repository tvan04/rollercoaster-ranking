import { useState } from "react";
import "./App.css";
import card from "./components/Coaster";
import Coaster from "./components/Coaster";
import Searchbar from "./components/Searchbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="header">
        <h1>Rollercoaster Ranking</h1>
        <p>
          Rank your favorite rollercoasters! Search and select the rollercoaster
          you want to rank and drag it to your desired position.{" "}
        </p>
      </div>

      <div className="container">
        <div id="search">
          <h2>Add Coasters</h2>
          <Searchbar />
        </div>
        <div id="coasters">
          <h2>Coaster Ranking</h2>
          <p>asdf</p>
        </div>
      </div>
    </>
  );
}

export default App;
