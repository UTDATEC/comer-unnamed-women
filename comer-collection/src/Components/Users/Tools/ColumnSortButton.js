import React from "react";
import { Button, Typography } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export const ColumnSortButton = (props) => {

  const { columnName, sortColumn, setSortColumn, sortAscending, setSortAscending } = props;

  return (
    <Button size="large" variant="text" sx={{textTransform: "unset"}} endIcon={sortColumn == columnName ? (
      sortAscending ? (<ArrowUpwardIcon fontSize="large" />) : (<ArrowDownwardIcon fontSize="large" />)
    ) : (<SwapVertIcon fontSize="large" />)} onClick={() => {
      if (sortColumn == columnName)
        setSortAscending((current) => !current);
      else {
        setSortColumn(columnName);
        setSortAscending(true);
      }
    }}>
      <Typography variant="h6" fontWeight={sortColumn == columnName ? "bold" : ""}>{columnName}</Typography>
    </Button>
  );
};
