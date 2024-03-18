import React from "react";
import { IconButton } from "@mui/material";
import { SwapVertIcon, ArrowUpwardIcon, ArrowDownwardIcon } from "../../IconImports";

export const ColumnSortButton = (props) => {

    const { columnName, sortColumn, setSortColumn, sortAscending, setSortAscending } = props;

    return (
        <IconButton color={sortColumn == columnName ? "primary" : "grey"} size="medium" onClick={() => {
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
