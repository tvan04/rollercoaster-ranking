import { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Coaster from "./components/Coaster";
import Searchbar from "./components/Searchbar";
import { signInWithGoogle, signOutWithGoogle } from "./Firebase";
import axios from "axios";

function App() {
  //Where the coasters selected from the searchbar are stored
  const [user, setUser] = useState(null);
  const [selectedCoasters, setSelectedCoasters] = useState([]);
  const [coastersFetched, setCoastersFetched] = useState(false);
  const token = localStorage.getItem("token");
  //function to add a coaster to the database and selectedCoasters array
  const addCoaster = (coaster) => {
    if (user && token) {
      axios
        .post(`http://localhost:5000/api/users/${user.uid}/coasters`, coaster, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSelectedCoasters((prevSelectedCoasters) => [
            ...prevSelectedCoasters,
            response.data,
          ]);
        })
        .catch((error) => {
          console.error("Coaster Already Exists", error);
        });
    }
  };

  //Function to remove a coaster from the database and selectedCoasters array
  const deleteCoaster = (coaster_id) => {
    if (user && token) {
      axios
        .delete(
          `http://localhost:5000/api/users/${user.uid}/coasters/${coaster_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // Coaster deleted successfully, update the frontend state
          setSelectedCoasters((prevSelectedCoasters) =>
            prevSelectedCoasters.filter((coaster) => coaster.id !== coaster_id)
          );
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error deleting coaster:", error);
        });
    }
  };

  const getCoasters = async (user) => {
    if (user && !coastersFetched) {
      axios
        .get(`http://localhost:5000/api/users/${user.uid}/coasters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSelectedCoasters((prevSelectedCoasters) => [
            ...prevSelectedCoasters,
            ...response.data,
          ]);
        })
        .catch((error) => {
          console.error("Error retrieving coasters:", error);
        });
    }
  };

  //Function to sort the selectedCoasters array by rank
  const sortedSelectedCoasters = selectedCoasters.slice().sort((a, b) => {
    return a.rank - b.rank;
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedCoasters = Array.from(selectedCoasters);
    const movedCoaster = updatedCoasters.find(
      (coaster) => coaster.id.toString() === draggableId
    );

    const startIndex = source.index;
    const endIndex = destination.index;
    updatedCoasters.splice(startIndex, 1);
    updatedCoasters.splice(endIndex, 0, movedCoaster);

    // Update the rank of the moved coaster based on its new position and rearrange other coasters accordingly
    for (let i = 0; i < updatedCoasters.length; i++) {
      const coaster = updatedCoasters[i];
      coaster.rank = i + 1;
    }

    // Update the state with the rearranged and updated selectedCoasters array
    setSelectedCoasters(updatedCoasters);

    const userId = user ? user.uid : null; // Assuming you have the user object with a uid property

    if (user && token) {
      axios
        .put(
          `http://localhost:5000/api/users/${user.uid}/coasters`,
          sortedSelectedCoasters,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Coasters updated successfully
        })
        .catch((error) => {
          console.error("Error updating coasters:", error);
        });
    }
  };
  //check if user is already signed in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      getCoasters(user);
      setCoastersFetched(true);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const signedInUser = await signInWithGoogle();

      // Check if the user already exists in the database
      const userEmail = signedInUser.email;
      const response = await axios.get(
        `http://localhost:5000/api/users/${userEmail}`
      );

      if (response.data.exists) {
        setUser(signedInUser);
        await getCoasters(signedInUser);
      } else {
        // User does not exist in the database, create a new user entry
        await axios.post("http://localhost:5000/api/users", {
          userId: signedInUser.uid,
          name: signedInUser.displayName,
          email: signedInUser.email,
        });
        setUser(signedInUser);
      }
    } catch (error) {
      // Handle sign-in errors here
      console.error("Error signing in:", error);
    }
  };
  // Event handler for the "Sign Out" button click
  const handleSignOut = () => {
    signOutWithGoogle().then(() => {
      setUser(null);
      setSelectedCoasters([]);
      setCoastersFetched(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    });
  };

  return (
    <>
      <div className="header">
        {user ? (
          <div className="signedIn">
            <div>
              <img
                src={user.photoURL}
                alt="Profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            </div>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className="signedOut">
            <button onClick={handleSignIn}>Sign in with Google</button>
          </div>
        )}
        <h1>Rollercoaster Ranking</h1>
        <p>
          Rank your favorite rollercoasters! Search and select the rollercoaster
          you want to rank and drag it to your desired position.
        </p>
      </div>

      <div className="container">
        <div id="search">
          <h2>Add Coasters</h2>
          <Searchbar onCoasterSelection={addCoaster} />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div id="coasters">
            <div id="labels">
              <h2 id="label1">Rank</h2>
              <h2 id="label2">Coaster</h2>
              <h2 id="label3">Park</h2>
              <h2 id="label4">temp</h2>
            </div>
            <Droppable droppableId="coaster-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sortedSelectedCoasters.map((coaster, index) => (
                    <Draggable
                      key={coaster.id.toString() + index}
                      draggableId={coaster.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Coaster
                            key={coaster.id}
                            id={coaster.id}
                            name={coaster.name}
                            park={coaster.park.name}
                            rank={coaster.rank}
                            onDeleteCoaster={deleteCoaster}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
