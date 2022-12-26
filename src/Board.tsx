import { Cell } from "./Cell";

export type BoardProps = {
  rows: number;
  columns: number;
  onCellClick: (row: number, column: number) => void;
};

export const Board = (props: BoardProps) => {
  const rows = [];
  for (let i = 0; i < props.rows; i++) {
    rows.push(
      <Row
        key={i}
        columns={props.columns}
        onCellClick={props.onCellClick}
        row={i}
      />
    );
  }
  return <div className="board">{rows}</div>;
};

export type RowProps = {
  columns: number;
  onCellClick: (row: number, column: number) => void;
  row: number;
};

export const Row = (props: RowProps) => {
  const cells = [];
  for (let i = 0; i < props.columns; i++) {
    cells.push(
      <Cell
        key={i}
        onCellClick={props.onCellClick}
        row={props.row}
        column={i}
      />
    );
  }
  return <div className="row">{cells}</div>;
};
