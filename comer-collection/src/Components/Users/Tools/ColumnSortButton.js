import React from "react";
import { IconButton } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export const ColumnSortButton = (props) => {

  const { columnName, sortColumn, setSortColumn, sortAscending, setSortAscending } = props;

  return (
    <IconButton onClick={() => {
      if (sortColumn == columnName)
        setSortAscending((current) => !current);
      else {
        setSortColumn(columnName);
        setSortAscending(true);
      }
    }}>
      {sortColumn == columnName ? (
        sortAscending ? (<ArrowUpwardIcon fontSize="medium" />) : (<ArrowDownwardIcon fontSize="medium" />)
      ) : (<SwapVertIcon fontSize="medium" />)}
    </IconButton>
  );
};
