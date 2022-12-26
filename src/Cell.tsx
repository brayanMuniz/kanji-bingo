export type CellProps = {
  onCellClick: (row: number, column: number) => void;
  row: number;
  column: number;
};

export const Cell = (props: CellProps) => {
  return (
    <div
      className="cell"
      onClick={() => props.onCellClick(props.row, props.column)}
    >
      {props.row}, {props.column}
    </div>
  );
};
