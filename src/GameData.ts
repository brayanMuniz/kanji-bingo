interface KanjiData {
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

export interface GameData {
  gameID: string;
  rows: number;
  cols: number;
  hostUID: string;
  intialCards: KanjiData[];
  playedCards: KanjiData[];
  players: string[];
  gameStarted: boolean;
}
