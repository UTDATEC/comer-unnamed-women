import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, IconButton, DialogContentText, TextField, Divider, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataTable } from "../DataTable";

export const AssociationManagementDialog = ({ primaryEntity, secondaryEntity, primaryItem, setPrimaryItem, secondaryItemsAll, secondaryItemsAssigned, secondaryTableFieldsAll, tableTitleAssigned, tableTitleAll, secondaryTableFieldsAssignedOnly, dialogTitle, dialogInstructions, dialogIsOpen, setDialogIsOpen }) => {
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
          <Stack sx={{width: "100%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAll}</Typography>
            <Box maxHeight="400px">
              <DataTable tableFields={secondaryTableFieldsAll} items={secondaryItemsAll} extraProperties={{ primaryItem, secondaryItemIdsAssigned: secondaryItemsAssigned?.map((si) => si.id)}} />
            </Box>
          </Stack>
          <Divider sx={{borderWidth: "2px"}} />
          <Stack sx={{width: "100%"}} spacing={2} textAlign="center">
            <Typography variant="h5">{tableTitleAssigned}</Typography>
            <Box maxHeight="400px">
              <DataTable tableFields={secondaryTableFieldsAssignedOnly} items={secondaryItemsAssigned} extraProperties={{ primaryItem }} />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit" color="primary" variant="contained" size="large"
          onClick={() => {
            setDialogIsOpen(false);
          }}
        >
          <Typography variant="body1">Close</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
