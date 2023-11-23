import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const ItemSingleDeleteDialog = ({ entity, dialogTitle, deleteDialogItem, deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }) => {
  return (
    <Dialog fullWidth={true} maxWidth="sm"
      open={deleteDialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setDeleteDialogIsOpen(false);
      }}
    >
      <DialogTitle variant="h4" textAlign="center">{dialogTitle}</DialogTitle>

      <DialogContent>
        <DialogContentText variant="body1">Are you sure you want to delete {entity} {deleteDialogItem?.safe_display_name}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setDeleteDialogIsOpen(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="error" variant="contained" size="large" startIcon={<DeleteIcon />} sx={{ width: "100%" }} onClick={() => {
            if(deleteDialogItem)
              handleDelete(deleteDialogItem.id);
          }}>
            <Typography variant="body1">Delete</Typography>

          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
