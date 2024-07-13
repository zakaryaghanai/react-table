import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

interface ICellsSkeletonProps {
  rowsCount: number;
  headCellsCount: number;
  checkbox?: boolean;
}

const CellsSkeleton: React.FC<ICellsSkeletonProps> = ({
  rowsCount,
  headCellsCount,
  checkbox = false,
}) => {
  
  const id = 'as'

  return (
    <React.Fragment>
      {[...Array(rowsCount ?? 5)].map((_, index) => (
        <TableRow key={id + index} style={{ height: 53 }}>
          {checkbox && (
            <TableCell>
              <Skeleton width={18} height={18} variant='circular' />
            </TableCell>
          )}
          {[...Array(headCellsCount)].map((_, index) => (
            <TableCell key={id + index}>
              <Skeleton
                width={`${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`}
                variant='text'
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );
};

export default CellsSkeleton;
