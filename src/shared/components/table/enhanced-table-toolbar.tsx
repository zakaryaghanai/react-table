import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ReactElement } from "react";
import { If, Then } from "react-if";
interface EnhancedTableToolbarProps {
  readonly totalRows: number;
  readonly numSelected: number;
  readonly handleSelectAll: () => void;
  readonly handleDeselectAll: () => void;
  readonly onSearch: (value: string) => void;
  readonly toolbarButtons?: ReactElement;
  readonly showSearchField?: boolean;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    handleSelectAll,
    handleDeselectAll,
    totalRows,
    onSearch,
    toolbarButtons,
    showSearchField = false,
  } = props;

  const defaultHeader = (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      gap={1}
      flex={1}
      justifyContent={"space-between"}
      alignItems={{ xs: "flex-end", sm: "center" }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onSearch(e.target.value.trim().toLowerCase())
      }
      sx={{ padding: "15px" }}
    >
      <If condition={showSearchField}>
        <Then>
          <TextField
            sx={{
              width: {
                xs: "100%",
                sm: "200px",
              },
              maxWidth: {
                xs: "100%",
                sm: "200px",
              },
            }}
            size='small'
            type='search'
            id='search'
            placeholder='Type to search...'
          />
        </Then>
      </If>

      <Stack direction={"row"} gap={1}>
        {toolbarButtons}
      </Stack>
    </Stack>
  );

  const selectedRows = (
    <Stack
      direction={"row"}
      columnGap={1}
      flexGrow={1}
      sx={{
        padding: "10px 15px",
        backgroundColor: (theme) => theme.palette.background.default,
        borderTop: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
      alignItems={"center"}
    >
      <Typography variant='body2' flexGrow={1}>
        {numSelected} record selected
      </Typography>
      <Stack direction={"row"} gap={1}>
        {totalRows == numSelected ? null : (
          <Button variant='text' onClick={() => handleSelectAll()}>
            Select all {totalRows}
          </Button>
        )}

        <Button
          variant='text'
          color='error'
          onClick={() => handleDeselectAll()}
        >
          Deselect all
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Box>
      <Stack direction={"column"} flexGrow={1}>
        {defaultHeader}
        {numSelected > 0 && selectedRows}
      </Stack>
    </Box>
  );
}
