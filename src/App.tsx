import "./App.css";
import React from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { Board } from "./Board";
import { createGame, joinGame, updateSelectedCard } from "./db";
import { GameData, PlayerData } from "./GameData";

function App() {
  const [userUID, setUID] = React.useState<string | null>(null);
  const [playerData, setPlayerData] = React.useState<PlayerData | null>(null);
  const [gameID, setGameID] = React.useState<string | null>(null);
  const [error, setError] = React.useState<boolean>(false);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUID(user.uid);
      console.log("User is signed in", user.uid);
    } else {
      await signInAnonymously(auth)
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
      await joinGame(gameID, userUID).then(
        (playerData: PlayerData | string) => {
          if (typeof playerData === "string") {
            return;
          }
          setGameID(gameID);
          setPlayerData(playerData);
          console.log("Joined game", gameID);
        }
      );
  }

  async function updateCard(cardId: number) {
    if (userUID && gameID)
      await updateSelectedCard(gameID, userUID, cardId).catch((err) => {
        console.log(err);
      });
  }

  // If there is an error, display it
  if (error) {
    return <div>There was an error</div>;
  }

  // If the user is not logged in, display a loading message
  if (!userUID) {
    return <div>Loading you user id...</div>;
  }

  // If the user is logged in, but not in a game, display the join/create game buttons
  if (!gameID) {
    return (
      <div className="App">
        Join a game or create a new one
        <button onClick={startGame}>Create Game</button>
        <button onClick={() => joinGameBtn("zoJBkgGuu3npGxZQVitN")}>
          Join Test Game
        </button>
      </div>
    );
  }

  if (!playerData) {
    return <div>Loading yoru data...</div>;
  }

  // If the user is logged in, render the Board component
  return (
    <div className="App">
      <Board
        kanjiData={playerData.cards}
        onCellClick={(row, col, cardData) => {
          // Todo: add a method to update cards border colors
          updateCard(cardData.id);
        }}
      ></Board>

      {/* Test Methods, will be erased later */}
      <div>userUID: {userUID}</div>
      <div>gameID: {gameID}</div>
    </div>
  );
}

export default App;
