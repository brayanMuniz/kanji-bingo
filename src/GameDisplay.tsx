import { initialKanjiData } from "./GameData";
import React from "react";

export type GameDisplayProps = {
  gameID: string;
  hostUID: string;
  intialCards: initialKanjiData[];
  playedCards: number[];
  // Todo: update and return next id to display
  onChangeDisplayClick: (type: "Play Next" | "Show Previous") => void;
};

// Todo: fix this
export const GameDisplay = (props: GameDisplayProps) => {
  const [currentDisplay, setCurrentDisplay] = React.useState<string>("");
  const [currentCardIdx, setCurrentCardIdx] = React.useState<number>(0);
  const [playedCards, setPlayedCards] = React.useState<number[]>([]);

  if (currentDisplay === "") {
    if (props.playedCards.length === 0) {
      let randomIdx = Math.floor(Math.random() * props.intialCards.length);
      const selectedCard: initialKanjiData = props.intialCards[randomIdx];

      setCurrentCardIdx(0);
      setPlayedCards([selectedCard.id]);
      setCurrentDisplay(selectedCard.characters);
    } else {
      const selectedCard: initialKanjiData =
        props.intialCards[props.playedCards[props.playedCards.length - 1]];

      setPlayedCards(props.playedCards);
      setCurrentCardIdx(props.playedCards.length - 1);
      setCurrentDisplay(selectedCard.characters);
    }
  }

  function onShowPreviousClick() {
    let currentIdx: number = currentCardIdx;
    if (currentIdx > 0) currentIdx--;
    setCurrentCardIdx(currentIdx);

    let previousId: number = playedCards[currentIdx];

    let newDisplay: string = "";
    props.intialCards.forEach((card) => {
      if (card.id === previousId) {
        newDisplay = card.characters;
      }
    });
    setCurrentDisplay(newDisplay);
    props.onChangeDisplayClick("Show Previous");
  }

  function onNextClick() {
    let currentIdx: number = currentCardIdx;
    currentIdx++;
    setCurrentCardIdx(currentIdx);

    // Select random card from intialCards
    if (currentIdx === playedCards.length) {
      let idNotSelectedYet: number = -1;
      while (idNotSelectedYet === -1) {
        let randomIdx = Math.floor(Math.random() * props.intialCards.length);
        const selectedCard: initialKanjiData = props.intialCards[randomIdx];
        if (!props.playedCards.includes(selectedCard.id))
          idNotSelectedYet = selectedCard.id;
      }
      props.intialCards.forEach((card) => {
        if (card.id === idNotSelectedYet) {
          setCurrentDisplay(card.characters);
        }
      });

      // Add card to playedCards
      let playedCardsCopy = playedCards;
      playedCardsCopy.push(idNotSelectedYet);
      setPlayedCards(playedCardsCopy);

      console.log(playedCardsCopy, "playedCards");
      console.log("Added brand new card");
    } else {
      let nextId: number = playedCards[currentIdx];
      console.log(nextId, "nextId");

      let newDisplay: string = "";
      props.intialCards.forEach((card) => {
        if (card.id === nextId) {
          newDisplay = card.characters;
        }
      });
      setCurrentDisplay(newDisplay);
    }

    props.onChangeDisplayClick("Play Next");
  }

  return (
    <div>
      {currentCardIdx} ---
      {playedCards}
      <button onClick={onShowPreviousClick}>Previous</button>
      <h1>{currentDisplay}</h1>
      <button onClick={onNextClick}>Next</button>
    </div>
  );
};
