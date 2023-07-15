import React, { useState, useEffect } from "react";
import Coaster from "./Coaster";
import "./Searchbar.css";

const Searchbar = () => {
  const [coasters, setCoasters] = useState([]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCoasters, setSelectedCoasters] = useState([]);

  useEffect(() => {
    const loadCoasters = async () => {
      const API_KEY = atob("MzhkNWU2Y2QtYmFkNC00OTYxLWE3YTgtODhiYmQ3N2IwMTlh");
      const URL = `https://vast-garden-04559.herokuapp.com/https://captaincoaster.com/api/coasters?page=1&name=${query}`;
      const res = await fetch(URL, {
        headers: {
          "X-AUTH-TOKEN": API_KEY,
        },
      });
      const data = await res.json();
      if (data["hydra:totalItems"] > 0) {
        displayCoasterList(data["hydra:member"]);
      }
    };

    let debounce;

    const findCoasters = () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length > 0) {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          loadCoasters(trimmedQuery);
        }, 300);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    };

    findCoasters();

    return () => clearTimeout(debounce);
  }, [query]);

  const displayCoasterList = (coasters) => {
    setCoasters(coasters);
  };

  const handleCoasterClick = (id) => {
    const selectedCoaster = coasters.find((coaster) => coaster.id === id);
    if (selectedCoaster) {
      setSelectedCoasters([...selectedCoasters, selectedCoaster]);
    }
  };

  const handleDeleteCoaster = (id) => {
    const updatedCoasters = selectedCoasters.filter(
      (coaster) => coaster.id !== id
    );
    setSelectedCoasters(updatedCoasters);
  };

  return (
    <div id="searchbar">
      <input
        type="text"
        value={query}
        placeholder="Search for a coaster"
        onChange={(e) => setQuery(e.target.value)}
      />

      {showResults && (
        <ul className="coaster-results">
          {coasters.map((coaster) => (
            <li
              key={coaster.id}
              className="coaster-result-item"
              data-id={coaster.id}
              onClick={() => handleCoasterClick(coaster.id)}
            >
              <div className="coaster-result-info">
                <h3>{coaster.name}</h3>
                <p>{coaster.park.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div id="coasters-container">
        {selectedCoasters.map((coaster) => (
          <Coaster
            key={coaster.id}
            id={coaster.id}
            name={coaster.name}
            park={coaster.park}
            onDeleteCoaster={handleDeleteCoaster}
          />
        ))}
      </div>
    </div>
  );
};

export default Searchbar;
