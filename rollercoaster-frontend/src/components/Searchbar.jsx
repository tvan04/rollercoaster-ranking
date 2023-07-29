import React, { useState, useEffect } from "react";
import "./Searchbar.css";

const Searchbar = ({ onCoasterSelection }) => {
  const [coasters, setCoasters] = useState([]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCoasters, setSelectedCoasters] = useState([]);
  const [rankInput, setRankInput] = useState("");
  const [selectedCoaster, setSelectedCoaster] = useState(null); // Track the selected coaster separately

  //function to load coasters from api
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
    //function to search for coasters in api
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

  //function to display coasters in searchbar
  const displayCoasterList = (coasters) => {
    setCoasters(coasters);
  };

  const handleCoasterSelect = (id) => {
    const selectedCoaster = coasters.find((coaster) => coaster.id === id);
    if (selectedCoaster) {
      setSelectedCoaster(selectedCoaster); // Set the selected coaster separately
      setQuery("");
      setShowResults(false);
    }
  };

  // Function to handle adding a rank to the last selected coaster
  const handleAddRank = () => {
    if (selectedCoaster && rankInput.trim() !== "") {
      const newCoaster = {
        ...selectedCoaster,
        rank: rankInput,
      };
      setSelectedCoaster(null); // Reset the selected coaster after adding the rank
      setSelectedCoasters([...selectedCoasters, newCoaster]);
      setRankInput(""); // Clear the rank input after adding the coaster
      onCoasterSelection(newCoaster); // Call onCoasterSelection with updated selectedCoasters
    }
  };

  return (
    <div id="searchbar">
      <input
        type="text"
        value={selectedCoaster ? selectedCoaster.name : query}
        placeholder="Search for a coaster"
        onChange={(e) => {
          if (selectedCoaster) {
            setSelectedCoaster(null);
          }
          setQuery(e.target.value);
        }}
      />

      {showResults && (
        <ul className="coaster-results">
          {coasters.map((coaster) => (
            <li
              key={coaster.id}
              className="coaster-result-item"
              data-id={coaster.id}
            >
              <div
                className="coaster-result-info"
                onClick={() => handleCoasterSelect(coaster.id)}
              >
                <h3>{coaster.name}</h3>
                <p>{coaster.park.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div id="rank">
        <input
          type="text"
          placeholder="Enter rank"
          value={rankInput}
          onChange={(e) => setRankInput(e.target.value)}
        />
        <div id="add">
          <button onClick={handleAddRank}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
