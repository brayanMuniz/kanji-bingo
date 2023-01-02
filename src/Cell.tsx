import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { PlayableKanji } from "./interfaces/GameData";

export type CellProps = {
  onCellClick: (row: number, column: number, cellData: PlayableKanji) => void;
  row: number;
  column: number;
  cellData: PlayableKanji;
};

// ? If I am going to use the primary only, just save the primaries ?
export const Cell = (props: CellProps) => {
  const [selected, setSelected] = React.useState<boolean>(
    props.cellData.isSelected
  );

  useEffect(() => {
    setSelected(props.cellData.isSelected);
  }, [props]);

  let displayText = "";
  let meaningCorrect = "";
  let readingCorrect = "";

  props.cellData.meanings.forEach((meaning) => {
    if (meaning.accepted_answer && meaning.primary) {
      meaningCorrect = meaning.meaning;
    }
  });

  props.cellData.readings.forEach((reading) => {
    if (reading.accepted_answer && reading.primary) {
      readingCorrect = reading.reading;
    }
  });

  displayText = meaningCorrect + " " + readingCorrect;

  function toggleClick(row: number, column: number, cellData: PlayableKanji) {
    props.onCellClick(row, column, cellData);
    setSelected(!selected);
  }

  return (
    <Grid item xs={2}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: selected ? "#6fbf73" : "primary.main",
          "&:hover": {
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        onClick={() => toggleClick(props.row, props.column, props.cellData)}
      >
        {displayText}
      </Box>
    </Grid>
  );
};
