import "./App.css";
import { Board } from "./Board";

// This is the main component of the app. It renders the Board component.

function App() {
  return (
    <div className="App">
      <Board
        rows={5}
        columns={5}
        onCellClick={(row, col) => {
          console.log(`Clicked on row ${row} and column ${col}`);
        }}
      ></Board>
    </div>
  );
}

export default App;
