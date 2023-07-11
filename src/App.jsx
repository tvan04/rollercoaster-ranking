import { useState } from "react";
import "./App.css";
import card from "./components/Coaster";
import Coaster from "./components/Coaster";
import Searchbar from "./components/Searchbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Rollercoaster Ranking</h1>
        <Searchbar />
        <Coaster name="Fury 325" />
        <Coaster name="Millennium Force" />
        <Coaster name="Steel Vengeance" />
      </div>
    </>
  );
}

export default App;
