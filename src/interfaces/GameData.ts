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
