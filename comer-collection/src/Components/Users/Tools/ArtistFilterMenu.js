import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { BrushIcon, CheckIcon } from "../../IconImports";

export const ArtistFilterMenu = ({ filterValue, setFilterValue, artists }) => {
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
            <BrushIcon />
            {artists.find((c) => c.id == selected) && (
              <Typography variant="body1" sx={{ minWidth: "120px" }}>
                {artists.find((c) => c.id == selected)?.safe_display_name}
              </Typography>
            ) ||
              <Typography variant="body1" sx={{ minWidth: "120px", opacity: 0.5 }}>
                Filter images by artist
              </Typography>}
          </Stack>
        );

      }}
      placeholder="All artists"
    >
      <ListItemButton key={""} value={""}
        onClick={(e) => {
          setFilterValue(null);
        }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CheckIcon sx={{ visibility: Boolean(filterValue) ? "hidden" : "" }} />
          <Typography variant="body1" sx={{ minWidth: "120px" }}>
            Do not filter by artist
          </Typography>
        </Stack>
      </ListItemButton>
      <Divider sx={{padding: "4px"}} />
      {artists.sort((a, b) => a.fullNameReverse > b.fullNameReverse ? 1 : -1).map((artist) => (
        <ListItemButton key={artist.id} value={artist.id}
          onClick={(e) => {
            setFilterValue(artist);
          }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BrushIcon sx={{ visibility: filterValue?.id == artist.id ? "" : "hidden" }} />
            <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
            {artist.fullNameReverse}
            </Typography>
          </Stack>
        </ListItemButton>
      ))}
    </Select>
  );
};
