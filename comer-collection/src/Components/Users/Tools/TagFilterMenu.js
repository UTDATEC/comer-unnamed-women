import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { SellIcon, CheckIcon } from "../../IconImports";

export const TagFilterMenu = ({ filterValue, setFilterValue, tags }) => {
  return (
    <Select displayEmpty value={filterValue?.id ?? ""}
      variant="outlined"
      sx={{
        wordWrap: "break-word", 
        width: "300px"
      }}
      MenuProps={{
        sx: {
          zIndex: 50000
        }
      }}
      renderValue={(selected) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <SellIcon />
            {tags.find((c) => c.id == selected) && (
              <Typography variant="body1" sx={{ minWidth: "120px" }}>
                {tags.find((c) => c.id == selected)?.data}
              </Typography>
            ) ||
              <Typography variant="body1" sx={{ minWidth: "120px", opacity: 0.5 }}>
                Filter images by tag
              </Typography>}
          </Stack>
        );

      }}
      placeholder="All tags"
    >
      <ListItemButton key={""} value={""}
        onClick={(e) => {
          setFilterValue(null);
        }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CheckIcon sx={{ visibility: Boolean(filterValue) ? "hidden" : "" }} />
          <Typography variant="body1" sx={{ minWidth: "120px" }}>
            Do not filter by tag
          </Typography>
        </Stack>
      </ListItemButton>
      <Divider sx={{padding: "4px"}} />
      {tags.sort((a, b) => a.data.toLowerCase() > b.data.toLowerCase() ? 1 : -1).map((tag) => (
        <ListItemButton key={tag.id} value={tag.id}
          onClick={(e) => {
            setFilterValue(tag);
          }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SellIcon sx={{ visibility: filterValue?.id == tag.id ? "" : "hidden" }} />
            <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
            {tag.data}
            </Typography>
          </Stack>
        </ListItemButton>
      ))}
    </Select>
  );
};
