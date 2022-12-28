import { PlayableKanji } from "./GameData";

export type CellProps = {
  onCellClick: (row: number, column: number, cellData: PlayableKanji) => void;
  row: number;
  column: number;
  cellData: PlayableKanji;
};

export const Cell = (props: CellProps) => {
  return (
    <div
      className="cell"
      onClick={() => props.onCellClick(props.row, props.column, props.cellData)}
    >
      {props.row}, {props.column}
    </div>
  );
};
