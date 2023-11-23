import React, { useEffect, useState } from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, Divider, Box
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"
import SearchIcon from "@mui/icons-material/Search"
import { DataTable } from "../DataTable";
import SearchBox from "../SearchBox";
import { searchItems } from "../SearchUtilities";

export const AssociationManagementDialog = ({ 
  primaryEntity, secondaryEntity, 
  primaryItem, setPrimaryItem, 
  secondaryItemsAll, secondaryItemsAssigned, 
  secondaryTableFieldsAll, secondaryTableFieldsAssignedOnly,
  tableTitleAssigned, tableTitleAll, 
  dialogTitle, dialogInstructions, dialogButtonForSecondaryManagement, 
  dialogIsOpen, setDialogIsOpen, secondarySearchFields
  }) => {

  const [secondarySearchQuery, setSecondarySearchQuery] = useState("");

  const [secondaryItemsAllResults, setSecondaryItemsAllResults] = useState(secondaryItemsAll);
  const [secondaryItemsAssignedResults, setSecondaryItemsAssignedResults] = useState(secondaryItemsAssigned)

  useEffect(() => {
    setSecondaryItemsAssignedResults(searchItems(secondarySearchQuery, secondaryItemsAssigned, secondarySearchFields));
    setSecondaryItemsAllResults(searchItems(secondarySearchQuery, secondaryItemsAll, secondarySearchFields));
  }, [secondaryItemsAssigned, secondaryItemsAll, secondarySearchQuery])
    
    
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
            <SearchBox width="100%" placeholder="Search courses by name" 
              searchQuery={secondarySearchQuery}
              setSearchQuery={setSecondarySearchQuery}
            />
          )}
        </Stack>
        <Stack spacing={2} direction="row" padding={2}>
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAll}</Typography>
            <Box maxHeight="350px">
              {secondaryItemsAllResults.length > 0 && (
                <DataTable tableFields={secondaryTableFieldsAll} items={secondaryItemsAllResults} extraProperties={{ primaryItem, secondaryItemIdsAssigned: secondaryItemsAssigned?.map((si) => si.id)}} />
              ) || secondaryItemsAllResults.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                    <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                      {secondaryItemsAll.length > 0 ? (
                        <>
                          <SearchIcon sx={{fontSize: '150pt'}} />
                          <Typography variant="h4">No results.</Typography>
                        </>
                      ) : (
                        <>
                          <InfoIcon sx={{fontSize: '150pt'}} />
                          <Typography variant="h4">This list is empty.</Typography>
                        </>
                      )}
                    </Stack>
                </Box>
              )}
            </Box>
          </Stack>
          <Divider sx={{borderWidth: "2px"}} />
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAssigned}</Typography>
            <Box maxHeight="350px">
              {secondaryItemsAssignedResults.length > 0 && (
                <DataTable tableFields={secondaryTableFieldsAssignedOnly} items={secondaryItemsAssignedResults} extraProperties={{ primaryItem }} />
              ) || secondaryItemsAssignedResults.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                    <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                      {secondaryItemsAssigned.length > 0 ? (
                        <>
                          <SearchIcon sx={{fontSize: '150pt'}} />
                          <Typography variant="h4">No results.</Typography>
                        </>
                      ) : (
                        <>
                          <InfoIcon sx={{fontSize: '150pt'}} />
                          <Typography variant="h4">This list is empty.</Typography>
                        </>
                      )}
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
