import { Cell } from "./Cell";
import Grid from "@mui/material/Grid";
import { PlayableKanji } from "./GameData";

export type BoardProps = {
  onCellClick: (row: number, column: number, cellData: PlayableKanji) => void;
  kanjiData: PlayableKanji[];
};

export const Board = (props: BoardProps) => {
  const rows = [];
  for (let i = 0; i < 5; i++) {
    const cells = [];
    for (let j = 0; j < 5; j++) {
      cells.push(
        <Cell
          key={i * 5 + j}
          onCellClick={props.onCellClick}
          row={i}
          column={j}
          cellData={props.kanjiData[i * 5 + j]}
        ></Cell>
      );
    }

    rows.push(
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {cells}
      </Grid>
    );
  }

  return (
    <div className="board">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {rows}
      </Grid>
    </div>
  );
};
