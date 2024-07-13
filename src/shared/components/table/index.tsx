import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { ReactElement } from "react";
import CellsSkeleton from "./cells-skeleton";
import EnhancedTableHead, { GlobalTableHeadCell } from "./enhanced-table-head";
import EnhancedTableToolbar from "./enhanced-table-toolbar";
import { IGlobalTable } from "./hooks/use-global-table";

interface GlobalTableProps<T extends { id: string }> {
  readonly tableData: IGlobalTable<T>;
  readonly children: Function;
  readonly headCells: GlobalTableHeadCell<T>[];
  readonly loading?: boolean;
  readonly toolbarButtons?: ReactElement;
}

export function AppTable<T extends { id: string }>(props: GlobalTableProps<T>) {
  const { children, headCells, loading, toolbarButtons, tableData } = props;

  return (
    <Paper
      sx={{
        boxShadow: "none",
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <EnhancedTableToolbar
        totalRows={tableData.rows.length}
        numSelected={tableData.selected.length}
        handleSelectAll={tableData.handleSelectAllRowsClick}
        handleDeselectAll={tableData.handleDeselectAllRowsClick}
        onSearch={tableData.handleSearch}
        toolbarButtons={toolbarButtons}
        showSearchField={tableData.isSearchable}
      />
      <TableContainer>
        <Table
          id={tableData.id}
          stickyHeader
          aria-label='sticky table'
          aria-labelledby='tableTitle'
        >
          <EnhancedTableHead
            selectable={tableData.selectable}
            order={tableData.order}
            orderBy={tableData.orderBy}
            onSelectAllClick={tableData.handleSelectCurrentPageRowsClick}
            onRequestSort={tableData.handleRequestSort}
            headCells={headCells}
            checked={tableData.checked}
          />
          <TableBody>
            {tableData.visibleRows.map((row, index: number) => {
              const isItemSelected = tableData.isSelected(String(row.id));
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  {tableData.selectable && (
                    <TableCell>
                      <Checkbox
                        sx={{ padding: "0px" }}
                        color='primary'
                        onClick={(event) =>
                          tableData.handleClick(event, String(row.id))
                        }
                        checked={isItemSelected}
                        value={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                          checked: isItemSelected,
                        }}
                        id={row.id}
                      />
                    </TableCell>
                  )}
                  {children(row, tableData)}
                </TableRow>
              );
            })}

            {tableData.emptyRows > 0 && (
              <TableRow
                style={{
                  height: 55 * tableData.emptyRows,
                }}
              >
                <TableCell
                  colSpan={
                    (tableData.isSelectable ? 1 : 0) + headCells.length
                  }
                />
              </TableRow>
            )}

            {loading && !tableData.rows.length && (
              <CellsSkeleton
                rowsCount={tableData.rowsPerPage}
                headCellsCount={headCells.length}
                checkbox={tableData.selectable}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={tableData.rowsPerPageOptions}
        component={Box}
        count={tableData.rows.length}
        rowsPerPage={tableData.rowsPerPage}
        page={tableData.page}
        onPageChange={tableData.handleChangePage}
        onRowsPerPageChange={tableData.handleChangeRowsPerPage}
      />
    </Paper>
  );
}

