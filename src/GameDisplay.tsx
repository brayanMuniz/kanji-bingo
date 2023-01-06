import React from "react";
import { updatePlayedCards } from "./db";
import { initialKanjiData } from "./interfaces/GameData";
import { Typography, Grid } from "@mui/material";

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
  const [currentCardIdx, setCurrentCardIdx] = React.useState<number>(
    props.playedCards.length
  );
  const [playedCards, setPlayedCards] = React.useState<number[]>(
    props.playedCards
  );
  const [maxAmountOfCards, setMaxAmountOfCards] = React.useState<number>(
    props.intialCards.length
  );

  function isUserHostUser(): boolean {
    return props.hostUID === props.userUID;
  }

  if (currentDisplay === "") {
    if (props.playedCards.length === 0) {
      let randomIdx = Math.floor(Math.random() * props.intialCards.length);
      const selectedCard: initialKanjiData = props.intialCards[randomIdx];

      setCurrentCardIdx(0);
      setPlayedCards([selectedCard.id]);
      setCurrentDisplay(selectedCard.characters);
      updatePlayedCards(props.gameID, selectedCard.id);
    } else {
      const selectedCardId: number =
        props.playedCards[props.playedCards.length - 1];
      let currentDisplay: string = getDisplayFromCardId(selectedCardId);

      setPlayedCards(props.playedCards);
      setCurrentCardIdx(props.playedCards.length - 1);
      setCurrentDisplay(currentDisplay);
    }
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

  // ! Err: when I go back on idx, sometimes it goes back to a random idx, ex: 6 to 22
  function onShowPreviousClick(): void {
    let currentIdx: number = currentCardIdx;
    if (currentIdx > 0) currentIdx--;
    setCurrentCardIdx(currentIdx);

    let previousId: number = playedCards[currentIdx];
    setCurrentDisplay(getDisplayFromCardId(previousId));
    props.onChangeDisplayClick("Show Previous");
  }

  function onNextClick(): void {
    const max: number = maxAmountOfCards;
    if (currentCardIdx > max - 1) {
      console.log("Maxed out on random selection");
    } else {
      let currentIdx: number = currentCardIdx;
      currentIdx++;
      setCurrentCardIdx(currentIdx);
      console.log(currentCardIdx, max);

      // Select random card from intialCards
      if (currentIdx === playedCards.length) {
        let temp: initialKanjiData[] = props.intialCards;
        let idNotSelectedYet = -1;
        while (temp.length > 0) {
          let randomIdx = Math.floor(Math.random() * temp.length);
          const selectedCard: initialKanjiData = temp[randomIdx];
          if (!props.playedCards.includes(selectedCard.id)) {
            idNotSelectedYet = selectedCard.id;
            let newDisplay: string = selectedCard.characters;
            setCurrentDisplay(newDisplay);
            break;
          }
          temp.splice(randomIdx, 1);
        }

        // Add card to playedCards
        if (idNotSelectedYet !== -1) {
          let playedCardsCopy = playedCards;
          playedCardsCopy.push(idNotSelectedYet);
          setPlayedCards(playedCardsCopy);
          updatePlayedCards(props.gameID, idNotSelectedYet);
          console.log("Added brand new card");
        }
      } else {
        let nextId: number = playedCards[currentIdx];
        console.log(nextId, "nextId");
        setCurrentDisplay(getDisplayFromCardId(nextId));
      }
    }

    props.onChangeDisplayClick("Play Next");
  }

  return (
    <div>
      {/* Todo: reduce the size that the typography takes up, make buttons < and > with mui components  */}

      <Grid
        direction={"row"}
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={4}>
          {isUserHostUser() && (
            <button onClick={onShowPreviousClick}>Previous</button>
          )}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h1">{currentDisplay}</Typography>
        </Grid>
        <Grid item xs={4}>
          {isUserHostUser() && <button onClick={onNextClick}>Next</button>}
        </Grid>
      </Grid>
    </div>
  );
};
