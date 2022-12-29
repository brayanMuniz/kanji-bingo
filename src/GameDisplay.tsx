import { initialKanjiData } from "./GameData";
import React from "react";

export type GameDisplayProps = {
  gameID: string;
  hostUID: string;
  intialCards: initialKanjiData[];
  playedCards: number[];
  onCellClick: (type: "Play Next" | "Show Previous") => void;
};

export const GameDisplay = (props: GameDisplayProps) => {
  console.log(props);

  const [currentDisplay, setCurrentDisplay] = React.useState<string>("");

  if (currentDisplay === "") {
    if (props.playedCards.length === 0) {
      let randomIdx = Math.floor(Math.random() * props.intialCards.length);
      const selectedCard: initialKanjiData = props.intialCards[randomIdx];
      console.log(selectedCard);

      setCurrentDisplay(selectedCard.characters);
    } else {
      const selectedCard: initialKanjiData =
        props.intialCards[props.playedCards[props.playedCards.length - 1]];
      setCurrentDisplay(selectedCard.characters);
    }
  }

  return <div>{currentDisplay}</div>;
};
