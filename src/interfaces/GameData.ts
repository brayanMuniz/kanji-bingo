import { DocumentSnapshot } from "firebase/firestore";

export interface KanjiData {
  kanji: string;
  id: number;
  hiragana: string;
}

export interface PlayableKanji {
  id: number;
  isSelected: boolean;
  meanings: any[];
  readings: any[];
}

export interface PlayerData {
  playerUID: string;
  cards: PlayableKanji[];
}

export interface initialKanjiData {
  characters: string;
  id: number;
  meanings: any[];
  readings: any[];
}

export interface PlayerPoints {
  playerUID: string;
  points: number;
}

export interface GameData {
  gameID: string;
  rows: number;
  cols: number;
  hostUID: string;
  intialCards: initialKanjiData[];
  playedCards: number[]; // IDs of played cards
  players: PlayerPoints[];
  gameStarted: boolean;
}

export function getGameDataFromDocSnap(docSnap: DocumentSnapshot): GameData {
  return {
    gameID: docSnap.id,
    rows: docSnap.data()?.rows,
    cols: docSnap.data()?.cols,
    hostUID: docSnap.data()?.hostUID,
    intialCards: docSnap.data()?.intialCards,
    playedCards: docSnap.data()?.playedCards,
    players: docSnap.data()?.players,
    gameStarted: docSnap.data()?.gameStarted,
  };
}
