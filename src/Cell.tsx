import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { PlayableKanji } from "./GameData";

export type CellProps = {
  onCellClick: (row: number, column: number, cellData: PlayableKanji) => void;
  row: number;
  column: number;
  cellData: PlayableKanji;
};

export const Cell = (props: CellProps) => {
  return (
    <Grid item xs={2}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "primary.dark",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        onClick={() =>
          props.onCellClick(props.row, props.column, props.cellData)
        }
      >
        {props.cellData.id}
      </Box>
    </Grid>
  );
};
