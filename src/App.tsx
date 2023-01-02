import "./App.css";
import React from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { Board } from "./Board";
import { GameDisplay } from "./GameDisplay";
import { createGame, joinGame, updateSelectedCard } from "./db";
import { GameData, PlayerData, PlayableKanji } from "./GameData";

function App() {
  // User data
  const [userUID, setUID] = React.useState<string | null>(null);
  const [playerData, setPlayerData] = React.useState<PlayerData | null>(null);

  // Game data
  const [gameID, setGameID] = React.useState<string | null>(null);
  const [gameData, setGameData] = React.useState<GameData | null>(null);

  // Error state
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
          setGameData(res);
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
      await joinGame(gameID, userUID).then((res: [GameData, PlayerData]) => {
        setGameID(gameID);
        setGameData(res[0]);
        setPlayerData(res[1]);
        console.log("Joined game", gameID);
        console.log("Player data", res[1]);
      });
  }

  async function updateCard(cardData: PlayableKanji) {
    if (userUID && gameID && playerData && gameData) {
      // Update the local data
      let updatedPlayerData: PlayerData = playerData;
      updatedPlayerData.cards.forEach((card) => {
        if (card.id === cardData.id) card.isSelected = !card.isSelected;
      });
      setPlayerData(updatedPlayerData);

      // Update the database
      await updateSelectedCard(gameID, userUID, cardData.id).catch((err) => {
        console.log(err);
      });

      // Check if the user has won
      let allClicked = true;
      updatedPlayerData.cards.forEach((card) => {
        if (!card.isSelected) allClicked = false;
      });

      if (allClicked) {
        let areAllIn = true;
        gameData.playedCards.forEach((id) => {
          let cardFound = false;
          updatedPlayerData.cards.forEach((card) => {
            if (card.id === id) cardFound = true;
          });
          if (!cardFound) areAllIn = false;
        });

        if (areAllIn) {
          console.log("You won!");
        } else {
          console.log("The cards you selected were not in the game. -1 points");
        }
      }

      // Todo: check if all the users answers are correct and update the game state
    }
  }

  // If there is an error, display it
  if (error) return <div>There was an error</div>;

  // If the user is not logged in, display a loading message
  if (!userUID) return <div>Loading you user id...</div>;

  // If the user is logged in, but not in a game, display the join/create game buttons
  if (!gameID && !gameData) {
    return (
      <div className="App">
        Join a game or create a new one
        <button onClick={startGame}>Create Game</button>
        <button onClick={() => joinGameBtn("Dm0l7uV7buyRVpV6RDJV")}>
          Join Test Game
        </button>
      </div>
    );
  }

  if (!playerData) {
    return <div>Loading your data...</div>;
  }

  // If the user is logged in, render the Board component
  if (gameID && gameData && playerData)
    return (
      <div className="App">
        <GameDisplay
          gameID={gameID}
          hostUID={gameData.hostUID}
          intialCards={gameData.intialCards}
          playedCards={gameData.playedCards}
          userUID={userUID}
          onChangeDisplayClick={(type) => {
            console.log(type);
          }}
        ></GameDisplay>

        <Board
          kanjiData={playerData.cards}
          onCellClick={(row, col, cardData) => {
            updateCard(cardData);
          }}
        ></Board>

        <div>userUID: {userUID}</div>
        <div>gameID: {gameID}</div>
      </div>
    );
  return <div>Something went wrong</div>;
}

export default App;
