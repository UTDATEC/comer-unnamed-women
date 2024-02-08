import React, { useState } from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, TextField
} from "@mui/material";
import { SecurityIcon, ArrowDownwardIcon } from "../../../IconImports";

export const UserChangePrivilegesDialog = ({ dialogUser, dialogIsOpen, setDialogIsOpen, handlePromote, handleDemote }) => {

  const [verifyPassword, setVerifyPassword] = useState("");

  return (
    <Dialog fullWidth={true} maxWidth="sm" component="form" sx={{zIndex: 10000}}
      open={dialogIsOpen} disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setDialogIsOpen(false);
      }} 
      onSubmit={(e) => {
        e.preventDefault();
        setVerifyPassword("");
        const passwordToSend = verifyPassword;
        if(dialogUser?.is_admin)
          handleDemote(dialogUser?.id, passwordToSend);
        else
          handlePromote(dialogUser?.id, passwordToSend);
      }}
    >
      <DialogTitle variant="h4" textAlign="center">{dialogUser?.is_admin ? "Remove Administrator Privileges" : "Grant Administrator Privileges"}</DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={2}>
        {dialogUser?.is_admin && (
          <>
          <DialogContentText variant="body1">
            You are about to remove administrator privileges for {dialogUser?.safe_display_name}.
          </DialogContentText>
          <DialogContentText variant="body1">
            This user will no longer be able to manage images, users, exhibitions, or courses.  The user will still be able to access and edit their own exhibitions. 
          </DialogContentText>
          </>
          
        ) || !dialogUser?.is_admin && (
          <>
          <DialogContentText variant="body1">
            You are about to grant administrator privileges to {dialogUser?.safe_display_name}.  This user will be able to manage images, users, exhibitions, and courses.  This means they will have the ability to modify, deactivate, and delete your account.
          </DialogContentText>
          <DialogContentText variant="body1">
            The user will continue to have curator privileges, as well.
          </DialogContentText>
          </>
        )}
          <DialogContentText variant="body1">
            Please type your password to confirm this operation.
          </DialogContentText>
          <TextField label="Verify Password" type="password" required color="secondary"
            onChange={(e) => {
              setVerifyPassword(e.target.value);
            }}
          >{verifyPassword}</TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="secondary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setDialogIsOpen(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="secondary" variant="contained" size="large" type="submit" 
            disabled={!Boolean(verifyPassword)}
            startIcon={
            dialogUser?.is_admin ? <ArrowDownwardIcon /> : <SecurityIcon />
          } sx={{ width: "100%" }}>
            <Typography variant="body1">{dialogUser?.is_admin ? "Demote User" : "Promote User"}</Typography>

          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
