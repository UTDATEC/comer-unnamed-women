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
import { DataTable } from "../DataTable";

export const ItemMultiDeleteDialog = ({ entitySingular, entityPlural, deleteDialogItems, deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }) => {

  const [confirmText, setConfirmText] = useState("");
  
  return (
    <Dialog component="form" fullWidth={true} maxWidth="sm"
      open={deleteDialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setDeleteDialogIsOpen(false);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete(deleteDialogItems.map((i) => i.id));
      }}
    >
      <DialogTitle variant="h4" textAlign="center">Delete {deleteDialogItems?.length} {entityPlural[0].toUpperCase()}{entityPlural.substring(1)}</DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={2}>
          <DialogContentText variant="body1">Are you sure you want to delete {deleteDialogItems?.length} {entityPlural}?
          </DialogContentText>

          <TextField autoComplete="off" placeholder="Type 'delete' to confirm" value={confirmText ?? ""}
            onChange={(e) => {
              setConfirmText(e.target.value);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setDeleteDialogIsOpen(false);
            setConfirmText("");
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="error" type="submit" 
            disabled={confirmText?.toLowerCase() != 'delete'}
            variant="contained" size="large" startIcon={<DeleteIcon />} sx={{ width: "100%" }} >
            <Typography variant="body1">Delete ({deleteDialogItems.length})</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};