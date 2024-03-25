import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchIcon, ClearIcon } from "../../IconImports.js";
import PropTypes from "prop-types";

const SearchBox = ({ searchQuery, setSearchQuery, width, placeholder }) => {
    return (
        <TextField variant="outlined" placeholder={placeholder ?? "Search"} value={searchQuery} sx={{width}}
            onChange={(e) => {
                setSearchQuery(e.target.value);
            }}
            InputProps={{
                sx: {
                    height: "100%"
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton sx={{
                            display: searchQuery == "" ? "none" : ""
                        }} onClick={() => {
                            setSearchQuery("");
                        }}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}></TextField>
    );
};

SearchBox.propTypes = {
    searchQuery: PropTypes.string,
    setSearchQuery: PropTypes.func,
    width: PropTypes.string,
    placeholder: PropTypes.string
};

export default SearchBox;