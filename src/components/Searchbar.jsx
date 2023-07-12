import React, {useState, useEffect} from 'react';
import './Searchbar.css';
let API_KEY = atob('MzhkNWU2Y2QtYmFkNC00OTYxLWE3YTgtODhiYmQ3N2IwMTlh')


const Searchbar = () => {
  const [coasters, setCoasters] = useState([]);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadCoasters = async () => {
      const URL = `https://vast-garden-04559.herokuapp.com/https://captaincoaster.com/api/coasters?page=1&name=${query}`;
      const res = await fetch(URL, {
        headers: {
          'X-AUTH-TOKEN': API_KEY
        }
      });
      const data = await res.json();
      if (data['hydra:totalItems'] > 0) {
        displayCoasterList(data['hydra:member']);
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
    loadGuess();
  };

  const handleCoasterClick = (id) => {
    // Handle the click event for a specific coaster
    console.log(`Clicked coaster with ID: ${id}`);
    //TODO: Add to the list of coasters 
  };

  return (
    <div>
      <input
        type="text"
        value={query}
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
    </div>
  );
};

export default Searchbar