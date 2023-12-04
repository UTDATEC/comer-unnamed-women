import React, { useState } from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const ItemSingleDeleteDialog = ({ requireTypedConfirmation, entity, dialogTitle, deleteDialogItem, deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }) => {

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  return (
    <Dialog fullWidth={true} maxWidth="sm" component="form" sx={{zIndex: 10000}}
      open={deleteDialogIsOpen} disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setDeleteDialogIsOpen(false);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if(deleteDialogItem)
          handleDelete(deleteDialogItem.id);
          setDeleteConfirmation("");
      }}
    >
      <DialogTitle variant="h4" textAlign="center">{dialogTitle}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText variant="body1" sx={{wordWrap: "break-word"}}>Are you sure you want to delete {entity} {deleteDialogItem?.safe_display_name}?</DialogContentText>
          {requireTypedConfirmation && (
            <TextField autoComplete="off" value={deleteConfirmation} onChange={(e) => {
              setDeleteConfirmation(e.target.value);
            }} placeholder="Type 'delete' to confirm" />
        )}

        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setDeleteDialogIsOpen(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="error" disabled={requireTypedConfirmation && deleteConfirmation.toLowerCase() != "delete"} 
            type="submit" variant="contained" size="large" startIcon={<DeleteIcon />} sx={{ width: "100%" }}>
            <Typography variant="body1">Delete</Typography>

          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
