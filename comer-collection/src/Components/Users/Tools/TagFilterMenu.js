import React from "react";
import { Typography } from "@mui/material";
import { SellIcon } from "../../IconImports.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";

const tagSortFunction = (a, b) => {
    return a.data > b.data;
};

const tagDisplayFunction = (tag) => {
    return (
        <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
            {tag.data}
        </Typography>
    );
};

export const TagFilterMenu = ({ filterValue, setFilterValue, tags }) => {
    return (
        <SecondaryFilterMenu SecondaryIcon={SellIcon} displayFunction={tagDisplayFunction} 
            helpMessage="Filter images by tag" 
            emptyMessage="No tag filters available" 
            nullMessage="Do not filter by tag"
            sortFunction={tagSortFunction}
            secondaries={tags}
            {...{filterValue, setFilterValue}}
        />
    );
};


TagFilterMenu.propTypes = {
    filterValue: PropTypes.object,
    setFilterValue: PropTypes.func,
    tags: PropTypes.arrayOf(PropTypes.object)
};
