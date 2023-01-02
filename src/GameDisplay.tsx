import React from "react";
import { updatePlayedCards } from "./db";
import { initialKanjiData } from "./interfaces/GameData";

export type GameDisplayProps = {
  gameID: string;
  hostUID: string;
  userUID: string;
  intialCards: initialKanjiData[];
  playedCards: number[];
  onChangeDisplayClick: (type: "Play Next" | "Show Previous") => void;
};

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
      // updatePlayedCards(props.gameID, selectedCard.id);
    } else {
      const selectedCardId: number =
        props.playedCards[props.playedCards.length - 1];
      let currentDisplay: string = getDisplayFromCardId(selectedCardId);

      setPlayedCards(props.playedCards);
      setCurrentCardIdx(props.playedCards.length - 1);
      setCurrentDisplay(currentDisplay);
    }
  }

  function isUserHostUser(): boolean {
    return props.hostUID === props.userUID;
  }

  function getDisplayFromCardId(id: number): string {
    let display: string = "";
    props.intialCards.forEach((card) => {
      if (card.id === id) {
        display = card.characters;
      }
    });
    return display;
  }

  function onShowPreviousClick(): void {
    let currentIdx: number = currentCardIdx;
    if (currentIdx > 0) currentIdx--;
    setCurrentCardIdx(currentIdx);

    let previousId: number = playedCards[currentIdx];
    setCurrentDisplay(getDisplayFromCardId(previousId));
    props.onChangeDisplayClick("Show Previous");
  }

  function onNextClick(): void {
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

      let newDisplay: string = getDisplayFromCardId(idNotSelectedYet);
      setCurrentDisplay(newDisplay);

      // Add card to playedCards
      let playedCardsCopy = playedCards;
      playedCardsCopy.push(idNotSelectedYet);
      setPlayedCards(playedCardsCopy);
      updatePlayedCards(props.gameID, idNotSelectedYet);
      console.log("Added brand new card");
    } else {
      let nextId: number = playedCards[currentIdx];
      console.log(nextId, "nextId");
      setCurrentDisplay(getDisplayFromCardId(nextId));
    }

    props.onChangeDisplayClick("Play Next");
  }

  return (
    <div>
      {isUserHostUser() && (
        <button onClick={onShowPreviousClick}>Previous</button>
      )}
      <h1>{currentDisplay}</h1>
      {isUserHostUser() && <button onClick={onNextClick}>Next</button>}
    </div>
  );
};
