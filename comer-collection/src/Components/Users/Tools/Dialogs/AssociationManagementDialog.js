import React, { useState } from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, Divider, Box
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import { DataTable } from "../DataTable";
import SearchBox from "../SearchBox";
import { searchItems } from "../SearchUtilities";

const computeSecondaryItemsAssigned = (secondaryItemsAll, secondariesByPrimary, primaryItems) => {
  if(primaryItems?.length == 0) 
    return [];
  return secondaryItemsAll.filter((si) => {
    return (
      Object.entries(secondariesByPrimary)
      .filter((entry) => primaryItems.map((pi) => pi.id).includes(parseInt(entry[0])))
      .map((entry) => entry[1]).filter((secondaries) => secondaries.map(s => s.id).includes(parseInt(si.id))).length > 0
    )
  })
}

export const AssociationManagementDialog = ({ 
  primaryEntity, secondaryEntity, 
  primaryItems, setPrimaryItems, 
  secondaryItemsAll, secondariesByPrimary, 
  secondaryTableFieldsAll, secondaryTableFieldsAssignedOnly,
  tableTitleAssigned, tableTitleAll, 
  dialogTitle, dialogInstructions, dialogButtonForSecondaryManagement, 
  dialogIsOpen, setDialogIsOpen, 
  secondarySearchFields, secondarySearchBoxPlaceholder
  }) => {

  const [secondarySearchQuery, setSecondarySearchQuery] = useState("");

  const secondaryItemsAssigned = computeSecondaryItemsAssigned(secondaryItemsAll, secondariesByPrimary, primaryItems);
  const secondaryItemsAssignedResults = searchItems(secondarySearchQuery, secondaryItemsAssigned, secondarySearchFields ?? []);
  const secondaryItemsAllResults = searchItems(secondarySearchQuery, secondaryItemsAll, secondarySearchFields ?? []);

  return (
    <Dialog fullWidth={true} maxWidth="lg"
      open={dialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
          setDialogIsOpen(false);
      }}
    >
      <DialogTitle textAlign="center" variant="h4">{dialogTitle}</DialogTitle>
      <DialogContent sx={{minHeight: "450px"}}>
        <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
        <Stack direction="column" padding={1}>
          {secondarySearchFields?.length > 0 && (
            <SearchBox width="100%" placeholder={secondarySearchBoxPlaceholder ?? "Search"}
              searchQuery={secondarySearchQuery}
              setSearchQuery={setSecondarySearchQuery}
            />
          )}
        </Stack>
        <Stack spacing={2} direction="row" padding={2}>
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAll}</Typography>
            <Box maxHeight="350px">
              {secondaryItemsAll.length > 0 && secondaryItemsAllResults.length > 0 && (
                <DataTable tableFields={secondaryTableFieldsAll} items={secondaryItemsAllResults} extraProperties={{ primaryItems: primaryItems, secondariesByPrimary
                }} /> 
              ) || secondaryItemsAll.length > 0 && secondaryItemsAllResults.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                  <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                  <SearchIcon sx={{fontSize: '150pt'}} />
                  <Typography variant="h4">No results</Typography>
                  </Stack>
                </Box>
              ) || secondaryItemsAll.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                  <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                  <InfoIcon sx={{fontSize: '150pt'}} />
                  <Typography variant="h4">This list is empty</Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
          <Divider sx={{borderWidth: "2px"}} />
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAssigned}</Typography>
            <Box maxHeight="350px">
              {secondaryItemsAssigned.length > 0 && secondaryItemsAssignedResults.length > 0 && (
                <DataTable tableFields={secondaryTableFieldsAssignedOnly} items={secondaryItemsAssignedResults} extraProperties={{ primaryItems: primaryItems, 
                  secondariesByPrimary
                }} /> 
              ) || secondaryItemsAssigned.length > 0 && secondaryItemsAssignedResults.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                  <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                  <SearchIcon sx={{fontSize: '150pt'}} />
                  <Typography variant="h4">No results</Typography>
                  </Stack>
                </Box>
              ) || secondaryItemsAssigned.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                  <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                  <InfoIcon sx={{fontSize: '150pt'}} />
                  <Typography variant="h4">This list is empty</Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
          
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} justifyContent="space-between" width="100%">
          {dialogButtonForSecondaryManagement}
          <Button type="submit" sx={{
            width: "30%"
          }} color="primary" variant="contained" size="large"
            onClick={() => {
              setDialogIsOpen(false);
            }}
          >
            <Typography variant="body1">Close</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
