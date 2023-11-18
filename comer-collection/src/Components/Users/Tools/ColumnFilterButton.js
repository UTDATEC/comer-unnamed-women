import React from "react";
import { Stack, Typography, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";

export const ColumnFilterButton = (props) => {

  const { filter, setFilter, menuAnchorElement, setMenuAnchorElement } = props;

  const options = [
    {
      value: "Administrator",
      displayText: "Administrators"
    },
    {
      value: "Curator",
      displayText: "Curators"
    }
  ];

  const optionAll = "All Users";

  return (
    <>
      <IconButton onClick={(event) => {
        setMenuAnchorElement(event.currentTarget);
      }}>
        {filter ? (<FilterAltIcon fontSize="large" color="secondary" />) : (<FilterAltOutlinedIcon fontSize="large" />)}
      </IconButton>
      <Menu MenuListProps={{}} anchorEl={menuAnchorElement} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
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
          <MenuItem onClick={() => {
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
