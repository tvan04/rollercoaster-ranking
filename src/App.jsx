import { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Coaster from "./components/Coaster";
import Searchbar from "./components/Searchbar";
import { signInWithGoogle } from "./Firebase";

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
  };

  return (
    <>
      <div className="header">
        <h1>Rollercoaster Ranking</h1>
        <p>
          Rank your favorite rollercoasters! Search and select the rollercoaster
          you want to rank and drag it to your desired position.
        </p>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>

      <div className="container">
        <div id="search">
          <h2>Add Coasters</h2>
          <Searchbar onCoasterSelection={handleCoasterSelection} />
        </div>
        <div id="coasters">
          <div id="labels">
            <h2 id="label1">Rank</h2>
            <h2 id="label2">Coaster</h2>
            <h2 id="label3">Park</h2>
            <h2 id="label4">temp</h2>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
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
                            park={coaster.park}
                            rank={coaster.rank}
                            onDeleteCoaster={handleDeleteCoaster}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;
