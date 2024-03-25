import React from "react";
import { BrushIcon } from "../../IconImports.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";

const artistSortFunction = (a, b) => {
    return a.fullNameReverse > b.fullNameReverse;
};

const artistDisplayFunction = (artist) => {
    return (
        <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
            {artist.fullNameReverse}
        </Typography>
    );
};

export const ArtistFilterMenu = ({ filterValue, setFilterValue, artists }) => {
    return (
        <SecondaryFilterMenu SecondaryIcon={BrushIcon} displayFunction={artistDisplayFunction} 
            helpMessage="Filter images by artist" 
            emptyMessage="No artist filters available" 
            nullMessage="Do not filter by artist"
            sortFunction={artistSortFunction}
            secondaries={artists}
            {...{filterValue, setFilterValue}}
        />
    );
};


ArtistFilterMenu.propTypes = {
    filterValue: PropTypes.object,
    setFilterValue: PropTypes.func,
    artists: PropTypes.arrayOf(PropTypes.object)
};