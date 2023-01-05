import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import {
  GameData,
  PlayerData,
  PlayerPoints,
  PlayableKanji,
  getGameDataFromDocSnap,
} from "./interfaces/GameData";
import testData from "./testData.json";

// Game functions
export async function createGame(
  row: number,
  col: number,
  hostUID: string
): Promise<GameData> {
  let initialGameData: any[] = JSON.parse(testData);

  if (initialGameData.length === 0)
    return Promise.reject("Error creating game");

  const docRef = await addDoc(collection(db, "games"), {
    rows: row,
    cols: col,
    hostUID: hostUID,
    players: [],
    intialCards: initialGameData,
    playedCards: [], // ids only, refer back to intialCards
    gameStarted: false,
  });

  const GameData: GameData = {
    gameID: docRef.id,
    rows: row,
    cols: col,
    hostUID: hostUID,
    intialCards: initialGameData,
    playedCards: [], // ids only, refer back to intialCards
    players: [],
    gameStarted: false,
  };

  if (docRef.id) return GameData;
  return Promise.reject("Error creating game");
}

export async function joinGame(
  gameID: string,
  playerUID: string
): Promise<[GameData, PlayerData]> {
  const gameRef = doc(db, "games", gameID);
  const docSnap = await getDoc(gameRef);
  if (docSnap.exists()) {
    const gameData: GameData = getGameDataFromDocSnap(docSnap);

    let initialCards = gameData.intialCards;
    let rowByCol: number = gameData.rows * gameData.cols;

    // if player aleady exists, return player data
    const playerRef = doc(db, "games", gameID, "players", playerUID);
    const playerDocSnap = await getDoc(playerRef);
    if (playerDocSnap.exists()) {
      const playerData: PlayerData = {
        playerUID: playerUID,
        cards: playerDocSnap.data()?.cards,
      };
      return [gameData, playerData];
    }
    // Todo check this to see if its correct
    else {
      // Add playerPoints to gameData
      let playerIsInGame = gameData.players.find(
        (player) => player.playerUID === playerUID
      );
      let players: Array<PlayerPoints> = gameData.players;
      players.push({ playerUID: playerUID, points: 0 });
      let uniquePlayers = [...new Set(players)];
      gameData.players = uniquePlayers;
      await updateDoc(gameRef, {
        players: uniquePlayers,
      });

      // set player cards to random cards from initialCards
      let playerCards: PlayableKanji[] = [];
      while (playerCards.length < rowByCol) {
        let randomIndex = Math.floor(Math.random() * initialCards.length);
        let temp = {
          id: initialCards[randomIndex].id,
          meanings: initialCards[randomIndex].meanings,
          readings: initialCards[randomIndex].readings,
          isSelected: false,
        };
        playerCards.push(temp);
        initialCards.splice(randomIndex, 1);
      }

      const playerData: PlayerData = {
        playerUID: playerUID,
        cards: playerCards,
      };

      await setDoc(playerRef, {
        playerUID: playerUID,
        cards: playerCards,
        points: 0,
      }).catch(() => {
        return Promise.reject("Error joining game");
      });

      return [gameData, playerData];
    }
  }

  return Promise.reject("Error joining game, game does not exist");
}

export async function updatePlayedCards(gameID: string, newId: number) {
  const gameRef = doc(db, "games", gameID);
  const docSnap = await getDoc(gameRef);
  if (docSnap.exists()) {
    let playedCards: any[] = docSnap.data().playedCards;
    playedCards.push(newId);
    await updateDoc(gameRef, {
      playedCards: playedCards,
    }).catch(() => {
      return Promise.reject("Error updating played cards");
    });
  }
}

// User functions
export async function updateSelectedCard(
  gameID: string,
  playerUID: string,
  cardId: number
) {
  const playerRef = doc(db, "games", gameID, "players", playerUID);
  const docSnap = await getDoc(playerRef);
  if (docSnap.exists()) {
    let playerCards: any[] = docSnap.data()?.cards;
    let selectedCard = playerCards.find((card) => card.id === cardId);
    if (!selectedCard)
      return Promise.reject(
        "Error updating selected card, card does not exist"
      );

    selectedCard.isSelected = !selectedCard.isSelected;
    playerCards = playerCards.map((card) =>
      card.id === cardId ? selectedCard : card
    );

    await updateDoc(playerRef, {
      cards: playerCards,
    }).catch(() => {
      return Promise.reject("Error updating selected card");
    });
  } else
    return Promise.reject(
      "Error updating selected card, player document does not exist"
    );
}

export async function setAllPlayerCards(
  gameID: string,
  playerUID: string,
  cards: PlayableKanji[]
) {
  const playerRef = doc(db, "games", gameID, "players", playerUID);
  const docSnap = await getDoc(playerRef);
  if (docSnap.exists()) {
    await updateDoc(playerRef, {
      cards: cards,
    }).catch(() => {
      return Promise.reject("Error setting player cards");
    });
  } else
    return Promise.reject(
      "Error setting player cards, player document does not exist"
    );
}

export async function updatePlayerPoints(
  gameID: string,
  playerUID: string,
  points: 1 | -1
) {
  const gameRef = doc(db, "games", gameID);
  const gameDocSnap = await getDoc(gameRef);
  if (gameDocSnap.exists()) {
    let players: PlayerPoints[] = gameDocSnap.data().players;
    let player = players.find((player) => player.playerUID === playerUID);
    if (!player)
      return Promise.reject(
        "Error updating player points, player does not exist"
      );
    let newPlayerPoints: number = player.points | 0;
    newPlayerPoints += points;
    player.points = newPlayerPoints;
    players = players.map((player) =>
      player.playerUID === playerUID ? player : player
    );
    await updateDoc(gameRef, {
      players: players,
    }).catch(() => {
      return Promise.reject("Error updating player points, game document");
    });
  } else
    return Promise.reject(
      "Error updating player points, game document does not exist"
    );

  const playerRef = doc(db, "games", gameID, "players", playerUID);
  const docSnap = await getDoc(playerRef);
  if (docSnap.exists()) {
    let newPlayerPoints: number = docSnap.data().points | 0;
    newPlayerPoints += points;
    await updateDoc(playerRef, {
      points: newPlayerPoints,
    }).catch(() => {
      return Promise.reject("Error updating player points");
    });
  } else
    return Promise.reject(
      "Error updating player points, player document does not exist"
    );
}

export async function setNewPlayerCards() {
  // TODO
}
