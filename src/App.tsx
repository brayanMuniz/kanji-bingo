import "./App.css";
import React from "react";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

import { Board } from "./Board";
import { GameDisplay } from "./GameDisplay";
import {
  createGame,
  joinGame,
  updateSelectedCard,
  updatePlayerPoints,
  setAllPlayerCards,
} from "./db";
import { GameData, PlayerData, PlayableKanji } from "./interfaces/GameData";

function App() {
  // User data
  const [userUID, setUID] = React.useState<string | null>(null);
  const [playerData, setPlayerData] = React.useState<PlayerData | null>(null);

  // Game data
  const [gameID, setGameID] = React.useState<string | null>(null);
  const [gameData, setGameData] = React.useState<GameData | null>(null);

  // Loading state
  const [loading, setLoading] = React.useState<boolean>(true);

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
        .catch(() => {
          setError(true);
        });
    }
  });

  async function startGame() {
    if (userUID) {
      setLoading(true);
      await createGame(5, 5, userUID)
        .then(async (res: GameData) => {
          setGameData(res);
          setGameID(res.gameID);
          await joinGame(res.gameID, userUID)
            .then((playerRes: [GameData, PlayerData]) => {
              setPlayerData(playerRes[1]);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setError(true);
            });
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
      setLoading(false);
    }
  }

  async function joinGameBtn(gameID: string) {
    if (userUID && gameID) {
      setLoading(true);
      await joinGame(gameID, userUID)
        .then((res: [GameData, PlayerData]) => {
          setGameID(gameID);
          setGameData(res[0]);
          setPlayerData(res[1]);
          console.log("Joined game", gameID);
          console.log("Player data", res[1]);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
      setLoading(false);
    }
  }

  async function updatePlayerCard(cardData: PlayableKanji) {
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

      // Make this into a function
      // Check if the user has won
      let allClicked = true;
      updatedPlayerData.cards.forEach((card) => {
        if (!card.isSelected) allClicked = false;
      });

      if (allClicked) {
        setLoading(true);
        // if allAreIn, the player has won
        let areAllIn = true;
        gameData.playedCards.forEach((id) => {
          let cardFound = false;
          updatedPlayerData.cards.forEach((card) => {
            if (card.id === id) cardFound = true;
          });
          if (!cardFound) areAllIn = false;
        });

        if (areAllIn) {
          await updatePlayerPoints(gameID, userUID, 1);
          // await setAllPlayerCards(gameID, userUID, updatedPlayerData.cards);
          // Todo: start a new game
          console.log("You won!");
          setLoading(false);
        } else {
          updatedPlayerData.cards.forEach((card) => {
            if (!gameData.playedCards.includes(card.id))
              card.isSelected = false;
          });
          await updatePlayerPoints(gameID, userUID, -1);
          await setAllPlayerCards(gameID, userUID, updatedPlayerData.cards);
          setPlayerData(updatedPlayerData);

          console.log("The cards you selected were not in the game. -1 points");
          setLoading(false);
        }
      }
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
        <button onClick={() => joinGameBtn("jqsUAcwsxncmGmJA3xlI")}>
          Join Test Game
        </button>
      </div>
    );
  }

  if (!playerData && loading) {
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
          onChangeDisplayClick={() => {}}
        ></GameDisplay>

        <Board
          kanjiData={playerData.cards}
          onCellClick={(row, col, cardData) => {
            updatePlayerCard(cardData);
          }}
        ></Board>

        <div>userUID: {userUID}</div>
        <div>gameID: {gameID}</div>
      </div>
    );

  return <div>Something Went Wrong</div>;
}

export default App;
