import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, IconButton, DialogContentText, TextField, Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const UserCreateDialog = ({ createDialogUsers, createDialogIsOpen, setCreateDialogIsOpen, handleUsersCreate, createDialogDispatch }) => {
  return (
    <Dialog component="form" fullWidth={true} maxWidth="lg"
      open={createDialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setCreateDialogIsOpen(false);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleUsersCreate([...createDialogUsers]);
      }}
    >
      <DialogTitle textAlign="center" variant="h4">Create Users</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText variant="body1">
            Add users, edit the user fields, then click 'Create'.  The system will generate temporary passwords for each user.
          </DialogContentText>
          {createDialogUsers.map((u, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <DialogContentText variant="body1">{index + 1}</DialogContentText>
              <TextField label="First Name" autoFocus value={u.given_name} sx={{ width: "100%" }}
                onChange={(e) => {
                  createDialogDispatch({
                    type: 'change',
                    field: 'given_name',
                    index: index,
                    newValue: e.target.value
                  });
                }} />
              <TextField label="Last Name" value={u.family_name} sx={{ width: "100%" }}
                onChange={(e) => {
                  createDialogDispatch({
                    type: 'change',
                    field: 'family_name',
                    index: index,
                    newValue: e.target.value
                  });
                }} />
              <TextField label="Email" inputProps={{ required: true }} value={u.email} sx={{ width: "100%" }}
                onChange={(e) => {
                  createDialogDispatch({
                    type: 'change',
                    field: 'email',
                    index: index,
                    newValue: e.target.value
                  });
                }} />
              <IconButton onClick={() => {
                createDialogDispatch({
                  type: 'remove',
                  index: index
                });
              }}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Divider />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" size="large" onClick={() => {
            setCreateDialogIsOpen(false);
            createDialogDispatch({
              type: "set",
              newArray: []
            });
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Stack direction="row" spacing={1} sx={{ width: "50%" }}>
            <Button color="primary"
              variant={createDialogUsers.length ? "outlined" : "contained"}
              size="large" sx={{ width: "100%" }} onClick={(e) => {
                createDialogDispatch({
                  type: 'add'
                });
              }}>
              <Typography variant="body1">{createDialogUsers.length ? "Add another user" : "Add User"}</Typography>
            </Button>
            <Button type="submit" color="primary" variant="contained" size="large" sx={{ width: "100%" }}
              disabled={createDialogUsers.length == 0}>
              <Typography variant="body1">Create</Typography>
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
