import { Box, Stack, TableCell, Tooltip, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { PermissionWrapper } from "../../shared/components/permission-wrapper/permission-wrapper";
import { StatusChip } from "../../shared/components/status-chip/status-chip";
import { AppTable } from "../../shared/components/table";
import {
  GlobalTableHeadCell,
  SearchCellsType,
} from "../../shared/components/table/enhanced-table-head";
import { useGlobalTable } from "../../shared/components/table/hooks/use-global-table";
import { useDate } from "../../shared/hooks/use-date";
import { useFetchUsers } from "../../shared/hooks/use-fetch-users";
import { User } from "../../shared/types/user";

export const DemoTable = () => {
  const [allowedToUpdate, _] = useState<boolean>(true);
  const [allowedToDelete, __] = useState<boolean>(true);
  const { users, loading, fetchUsers } = useFetchUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  const { getDateTimeFormat } = useDate();

  const tableHeadCells: GlobalTableHeadCell<User>[] = useMemo(() => {
    return [
      {
        getter: "username",
        label: "Username",
        width: "130px",
      },
      {
        getter: "email",
        label: "Email",
        width: "200px",
      },
      {
        getter: "createdAt",
        label: "Created at",
        width: "110px",
      },
      {
        getter: "updatedAt",
        label: "Updated at",
        width: "110px",
      },
      {
        getter: "role.name" as any,
        label: "Role",
        width: "70px",
      },
      {
        getter: "active",
        label: "Status",
        width: "100px",
      },
      ...(allowedToUpdate
        ? [
            {
              label: "Actions",
            },
          ]
        : []),
    ];
  }, []);

  const searchCells: SearchCellsType<Partial<User>> = [
    "username",
    "email",
    "role.name" as keyof User,
  ];

  const tableData = useGlobalTable<User>({
    id: "users",
    rows: users ?? [],
    searchCells,
    selectable: allowedToDelete,
  });

  return (
    <Box>
      <AppTable
        tableData={tableData}
        headCells={tableHeadCells}
        loading={loading}
      >
        {(user: User) => {
          return (
            <>
              <TableCell>
                <Typography>{user.username}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{user.email}</Typography>
              </TableCell>
              <TableCell>{getDateTimeFormat(user.createdAt)}</TableCell>
              <TableCell>{getDateTimeFormat(user.updatedAt)}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell>
                <StatusChip
                  color={user.active ? "success" : "error"}
                  text={user.active ? "Enabled" : "Disabled"}
                />
              </TableCell>
              <PermissionWrapper permissions={[allowedToUpdate]}>
                <TableCell>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={"2px"}
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    <Tooltip title={"Edit"} placement='top' arrow>
                      <Typography>edit</Typography>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </PermissionWrapper>
            </>
          );
        }}
      </AppTable>
    </Box>
  );
};
