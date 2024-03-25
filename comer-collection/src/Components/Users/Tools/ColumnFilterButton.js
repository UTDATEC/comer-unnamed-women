import React from "react";
import { Stack, Typography, Menu, MenuItem, Divider, Button } from "@mui/material";
import { FilterAltOutlinedIcon, FilterAltIcon, CheckIcon } from "../../IconImports.js";

export const ColumnFilterButton = (props) => {

    const { columnName, options, optionAll, filter, setFilter, menuAnchorElement, setMenuAnchorElement } = props;

    return (
        <>
            <Button 
                sx={{textTransform: "unset"}}  
                color="primary"
                endIcon={filter ? 
                    (<FilterAltIcon fontSize="large" color="primary" />) : 
                    (<FilterAltOutlinedIcon fontSize="large" />)
                } 
                onClick={(event) => {
                    setMenuAnchorElement(event.currentTarget);
                }}>
                <Typography variant="h6">{columnName}</Typography>
            </Button>
            <Menu MenuListProps={{}} anchorEl={menuAnchorElement} anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }} transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }} open={Boolean(menuAnchorElement)} onClose={() => {
                setMenuAnchorElement(null);
            }}>
                <MenuItem onClick={() => {
                    setMenuAnchorElement(null);
                    setFilter(null);
                }}>
                    <Stack direction="row" spacing={1}>
                        <CheckIcon sx={{ visibility: !filter ? "" : "hidden" }} />
                        <Typography variant="body">{optionAll}</Typography>
                    </Stack>
                </MenuItem>
                <Divider />
                {options.map((option) => (
                    <MenuItem key={option.value} onClick={() => {
                        setMenuAnchorElement(null);
                        setFilter(option.value);
                    }}>
                        <Stack direction="row" spacing={1}>
                            <CheckIcon sx={{ visibility: filter == option.value ? "" : "hidden" }} />
                            <Typography variant="body">{option.displayText}</Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
