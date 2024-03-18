import React from "react";
import { IconButton } from "@mui/material";
import { SwapVertIcon, ArrowUpwardIcon, ArrowDownwardIcon } from "../../IconImports";
import PropTypes from "prop-types";

export const ColumnSortButton = ({ columnName, sortColumn, setSortColumn, sortAscending, setSortAscending }) => {

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

ColumnSortButton.propTypes = {
    columnName: PropTypes.string,
    sortColumn: PropTypes.string,
    setSortColumn: PropTypes.func,
    sortAscending: PropTypes.bool,
    setSortAscending: PropTypes.func
};
