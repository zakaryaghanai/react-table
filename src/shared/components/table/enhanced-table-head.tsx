import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "@mui/material";

type Order = "asc" | "desc";

export interface GlobalTableHeadCellBase<RowDataType> {
  getter?: keyof RowDataType;
  width?: string | number;
}

interface GlobalTableHeadCellWithLabel<RowDataType>
  extends GlobalTableHeadCellBase<RowDataType> {
  label: string;
  customLabel?: never;
}

interface GlobalTableHeadCellWithRender<RowDataType>
  extends GlobalTableHeadCellBase<RowDataType> {
  customLabel: () => void;
  label?: never;
}

export type GlobalTableHeadCell<RowDataType> =
  | GlobalTableHeadCellWithLabel<RowDataType>
  | GlobalTableHeadCellWithRender<RowDataType>;

export type SearchCellsType<T> = (keyof T)[];

interface EnhancedTableProps<RowDataType> {
  readonly onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof RowDataType
  ) => void;
  readonly onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  readonly order: Order;
  readonly orderBy: keyof RowDataType | null;
  readonly selectable?: boolean;
  readonly headCells: GlobalTableHeadCell<RowDataType>[];
  readonly checked: boolean;
}

export default function EnhancedTableHead<RowDataType>(
  props: EnhancedTableProps<RowDataType>
) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    onRequestSort,
    selectable,
    headCells,
    checked,
  } = props;

  const createSortHandler =
    (property: keyof RowDataType | null) =>
    (event: React.MouseEvent<unknown>) => {
      if (!property) {
        return;
      }
      onRequestSort(event, property);
    };

  const getLabel = (headCell: any) => {
    if (headCell?.label) {
      return headCell.label;
    }

    return headCell.customLabel();
  };

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell>
            <Checkbox
              sx={{ padding: "0px" }}
              color='primary'
              checked={checked}
              value={checked}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all users"
              }}
            />
          </TableCell>
        )}

        {headCells.map((headCell) => {
          const cellContent = (
            <Box component={"span"} sx={{ minWidth: "max-content" }}>
              {getLabel(headCell)}
            </Box>
          );

          return (
            <TableCell
              key={headCell.label}
              align='left'
              sortDirection={false}
              sx={{
                minWidth: headCell.width ?? "max-content",
                paddingY: "10px !important",
              }}
            >
              {headCell.getter ? (
                <TableSortLabel
                  active={orderBy === headCell.getter}
                  direction={orderBy === headCell.getter ? order : "asc"}
                  onClick={createSortHandler(
                    headCell?.getter ? headCell?.getter : null
                  )}
                >
                  {cellContent}
                </TableSortLabel>
              ) : (
                cellContent
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
