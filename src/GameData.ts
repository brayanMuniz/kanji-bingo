interface KanjiData {
  kanji: string;
  id: number;
  hiragana: string;
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
