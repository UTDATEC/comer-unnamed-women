import React, { useState } from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, Divider, TextField, IconButton, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { getBlankItemFields } from "../HelperMethods";
import { DataTable } from "../DataTable";

export const EntityManageDialog = ({ entity, dialogTitle, dialogInstructionsTable, dialogInstructionsForm, dialogItems, setDialogItems, dialogFieldNames, dialogTableFields, dialogIsOpen, setDialogIsOpen, handleItemCreate, handleItemEdit, handleItemDelete }) => {

  const [itemToAdd, setItemToAdd] = useState(getBlankItemFields(dialogFieldNames));
  
  return (
    <Dialog fullWidth={true} maxWidth="lg"
      open={dialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setDialogIsOpen(false);
      }}
    >
      <DialogTitle textAlign="center" variant="h4">{dialogTitle}
      <DialogContent>
        <Stack spacing={2}>
        <DialogContentText textAlign="left" variant="body1">{dialogInstructionsForm}</DialogContentText>
          <Stack component="form" direction="row" alignItems="center" spacing={2}>
            <DialogContentText variant="body1"></DialogContentText>
            {dialogFieldNames.map((f, fi) => (
              <TextField key={f.fieldName} 
                name={f.fieldName} 
                label={f.displayName} 
                autoFocus={fi==0} 
                value={itemToAdd[f.fieldName]} 
                sx={{ 
                  width: "100%" 
                }}
                inputProps={{
                  type: f.inputType ?? "text",
                  sx: {...{
                    textAlign: f.inputType == "datetime-local" ? "center" : ""
                  }}
                }}
                required={Boolean(f.isRequired)}
              onChange={(e) => {
                setItemToAdd({
                  ...itemToAdd,
                  [f.fieldName]: e.target.value
                })
              }} />
            ))}
            <Button type="submit" variant="contained" 
              startIcon={<AddIcon />}
              sx={{minWidth: "200px", height: "100%"}}
              onClick={(e) => {
                e.preventDefault();
                handleItemCreate(itemToAdd);
                setItemToAdd(getBlankItemFields(dialogFieldNames))
              }}>
              <Typography variant="body1">{`Create ${entity}`}</Typography>
            </Button>
          </Stack>
        {/* </Stack>
          <Stack spacing={2} maxHeight="200px"> */}
      <Divider />
            <DialogContentText textAlign="left" variant="body1">{dialogInstructionsTable}</DialogContentText>
          </Stack>
      </DialogContent>
      </DialogTitle>
      <DialogContent sx={{maxHeight: "200px"}}>
            <Box overflow="scroll" sx={{maxHeight: "200px"}}>
              <DataTable tableFields={dialogTableFields} items={dialogItems} />
            </Box>

      </DialogContent>
      <Divider />
      <DialogActions>
        <Button sx={{
          width: "30%"
        }} color="primary" variant="contained" size="large"
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
