import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, Divider, Box
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"
import { DataTable } from "../DataTable";

export const AssociationManagementDialog = ({ primaryEntity, secondaryEntity, primaryItem, setPrimaryItem, secondaryItemsAll, secondaryItemsAssigned, secondaryTableFieldsAll, tableTitleAssigned, tableTitleAll, secondaryTableFieldsAssignedOnly, dialogTitle, dialogInstructions, dialogButtonForSecondaryManagement, dialogIsOpen, setDialogIsOpen }) => {
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
      <DialogContent>
        <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
        <Stack spacing={2} direction="row" padding={2}>
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAll}</Typography>
            <Box maxHeight="400px">
              <DataTable tableFields={secondaryTableFieldsAll} items={secondaryItemsAll} extraProperties={{ primaryItem, secondaryItemIdsAssigned: secondaryItemsAssigned?.map((si) => si.id)}} />
            </Box>
          </Stack>
          <Divider sx={{borderWidth: "2px"}} />
          <Stack sx={{width: "50%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAssigned}</Typography>
            <Box maxHeight="400px">
              {secondaryItemsAssigned.length > 0 && (
                <DataTable tableFields={secondaryTableFieldsAssignedOnly} items={secondaryItemsAssigned} extraProperties={{ primaryItem }} />
              ) || secondaryItemsAssigned.length == 0 && (
                <Box sx={{width: '100%', height: '100%'}}>
                    <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{height: '100%', opacity: 0.5}}>
                        <InfoIcon sx={{fontSize: '150pt'}} />
                        <Typography variant="h4">This list is empty.</Typography>
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
