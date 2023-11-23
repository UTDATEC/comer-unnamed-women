import React from "react";
import {
  Stack,
  Button,
  Typography
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export const SelectionSummary = ({ items, selectedItems, setSelectedItems, visibleItems, entitySingular, entityPlural }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {selectedItems.length > 0 && (
        <CheckIcon fontSize="large" sx={{ opacity: 0.5 }} />
      ) || selectedItems.length == 0 && (
        <ArrowUpwardIcon fontSize="large" sx={{ opacity: 0.5 }} />
      )}
      <Stack direction="column">
        <Typography variant="body1" sx={{ opacity: 0.5 }}>
          {visibleItems.length < items.length ?
            `Showing ${visibleItems.length} of ${items.length} ${items.length == 1 ? entitySingular : entityPlural}` :
            `${items.length} ${items.length == 1 ? entitySingular : entityPlural}`}
        </Typography>
        {selectedItems.length > 0 && (
          <Typography variant="body1">{selectedItems.length} {selectedItems.length == 1 ? entitySingular : entityPlural} selected</Typography>
        ) || selectedItems.length == 0 && (
          <Typography variant="body1" sx={{ opacity: 0.5 }}>Select items to use bulk actions</Typography>
        )}

      </Stack>
      {selectedItems.length > 0 && (
        <Button variant="outlined" onClick={() => {
          setSelectedItems([]);
        }}>
          <Typography variant="body1">Clear Selection</Typography>
        </Button>
      )}
    </Stack>
  );
};
