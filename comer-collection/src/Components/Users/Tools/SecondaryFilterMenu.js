import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { CheckIcon, RemoveCircleOutlineIcon } from "../../IconImports.js";
import PropTypes from "prop-types";

export const SecondaryFilterMenu = ({ filterValue, setFilterValue, secondaries, helpMessage, emptyMessage, nullMessage, displayFunction, sortFunction, SecondaryIcon }) => {
    return (
        <Select displayEmpty value={filterValue?.id ?? ""}
            variant="outlined"
            sx={{
                wordWrap: "break-word", 
                width: "300px"
            }}
            renderValue={(selected) => {
                return (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <SecondaryIcon />
                        {secondaries.find((i) => i.id == selected) && (
                            <Typography variant="body1" sx={{ minWidth: "120px" }}>
                                {secondaries.find((c) => c.id == selected)?.safe_display_name}
                            </Typography>
                        ) || (
                            <Typography variant="body1" sx={{ minWidth: "120px", opacity: 0.5 }}>{helpMessage}</Typography>
                        )}
                    </Stack>
                );

            }}
            placeholder="All secondaries"
        >
            
            {!secondaries.length && (
                <ListItemButton key={""} value={""} disabled={true} >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <RemoveCircleOutlineIcon />
                        <Typography variant="body1" sx={{ minWidth: "120px" }}>{emptyMessage}</Typography>
                    </Stack>
                </ListItemButton>
            ) || secondaries.length && (
                <>
                    <ListItemButton key={""} value={""}
                        onClick={() => {
                            setFilterValue(null);
                        }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <CheckIcon sx={{ visibility: filterValue ? "hidden" : "" }} />
                            <Typography variant="body1" sx={{ minWidth: "120px" }}>{nullMessage}</Typography>
                        </Stack>
                    </ListItemButton>
                    <Divider sx={{padding: "4px"}} />
                    {secondaries.sort(sortFunction).map((secondary) => (
                        <ListItemButton key={secondary.id} value={secondary.id}
                            onClick={() => {
                                setFilterValue(secondary);
                            }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <CheckIcon sx={{ visibility: filterValue?.id == secondary.id ? "" : "hidden" }} />
                                <Stack direction="column" alignItems="left" spacing={0} sx={{}}>
                                    <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
                                        {secondary.name}
                                    </Typography>
                                    <Typography sx={{opacity: 0.5}}>
                                        {/* {} */}
                                        {displayFunction(secondary)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </ListItemButton>
                    ))}
                </>
            )}
        </Select>
    );
};


SecondaryFilterMenu.propTypes = {
    filterValue: PropTypes.object,
    setFilterValue: PropTypes.func,
    secondaries: PropTypes.arrayOf(PropTypes.object),
    helpMessage: PropTypes.string.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    nullMessage: PropTypes.string.isRequired,
    displayFunction: PropTypes.func.isRequired,
    sortFunction: PropTypes.func.isRequired,
    SecondaryIcon: PropTypes.elementType.isRequired
};