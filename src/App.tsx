import "./App.css";
import React from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { Board } from "./Board";
import { createGame, joinGame, updateSelectedCard } from "./db";
import { GameData } from "./GameData";

// This is the main component of the app. It renders the Board component.

function App() {
  const [userUID, setUID] = React.useState<string | null>(null);
  const [gameID, setGameID] = React.useState<string | null>(null);
  const [error, setError] = React.useState<boolean>(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUID(user.uid);
      console.log("User is signed in", user.uid);
    } else {
      signInAnonymously(auth)
        .then((data) => {
          setUID(data.user.uid);
        })
        .catch((error) => {
          setError(true);
        });
    }
  });

  async function startGame() {
    if (userUID)
      await createGame(5, 5, userUID)
        .then(async (res: GameData) => {
          setGameID(res.gameID);
          await joinGame(res.gameID, userUID).then(() => {
            console.log("Joined game", res.gameID);
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }

  async function joinGameBtn(gameID: string) {
    if (userUID && gameID)
      await joinGame(gameID, userUID).then(() => {
        setGameID(gameID);
        console.log("Joined game", gameID);
      });
  }

  async function updateCard() {
    if (userUID && gameID)
      await updateSelectedCard(gameID, userUID, 452)
        .then(() => {
          console.log("Updated card");
        })
        .catch((err) => {
          console.log(err);
        });
    else if (!gameID) {
      console.log("No gameID");
    } else {
      console.log("No userUID");
    }
  }

  // If there is an error, display it
  if (error) {
    return <div>There was an error</div>;
  }

  // If the user is not logged in, display a loading message
  if (!userUID) {
    return <div>Loading...</div>;
  }
  // If the user is logged in, render the Board component

  return (
    <div className="App">
      <Board
        rows={5}
        columns={5}
        onCellClick={(row, col) => {
          console.log(`Clicked on row ${row} and column ${col}`);
        }}
      ></Board>
      <div>userUID: {userUID}</div>
      <div>gameID: {gameID}</div>
      <button onClick={startGame}>Create Game</button>

      <button onClick={() => joinGameBtn("zoJBkgGuu3npGxZQVitN")}>
        Join Test Game
      </button>

      <button onClick={updateCard}>Update Card Test</button>
    </div>
  );
}

export default App;
