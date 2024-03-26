import React, { useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { ContentCopyIcon, SyncIcon } from "../../../IconImports.js";
import { useSnackbar } from "../../../App/AppSnackbar.js";
import PropTypes from "prop-types";


const randomPassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    return password;
};


export const UserResetPasswordDialog = ({ dialogUser, dialogIsOpen, setDialogIsOpen, handleResetPassword }) => {

    const [newPassword, setNewPassword] = useState("");
    const [editMode, setEditMode] = useState(true);
    const [hasCopied, setHasCopied] = useState(false);

    const showSnackbar = useSnackbar();
    const themeColor = dialogUser?.is_admin_or_collection_manager ? "secondary" : "primary";
    

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
                handleResetPassword(dialogUser?.id, newPassword).then(() => {
                    setEditMode(false);
                });
            }}
        >
            <DialogTitle variant="h4" textAlign="center">{dialogUser?.has_password ? "Reset Password" : "Set Password"}</DialogTitle>

            <DialogContent>
                <Stack direction="column" spacing={2}>
                    {editMode && (
                        <>
                            <DialogContentText variant="body1">
                                {dialogUser?.has_password && (
                                    `You are about to reset the password for ${dialogUser?.safe_display_name}, which will invalidate all current access tokens for this user.`
                                ) || !dialogUser?.has_password && (
                                    `You are about to set a password for ${dialogUser?.safe_display_name}.`
                                )}
                            </DialogContentText>
                            <DialogContentText variant="body1">
              Please type a password of your choice or generate a random password for the user.
                            </DialogContentText>
                        </>
                    ) || !editMode && (
                        <DialogContentText variant="body1">
            The new password has been set.  Please copy the password below so you can send it to the user.  You will not be able to see the password again after you close this dialog.
                        </DialogContentText>
                    )}
                    <Stack direction="row" spacing={2}>
                        <TextField label="New Password" disabled={!editMode} type="password" color={themeColor}
                            sx={{width: "80%"}}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                            value={newPassword}
                        ></TextField>
                        {editMode && (
                            <Button variant={newPassword ? "outlined" : "contained"} 
                                startIcon={<SyncIcon />}
                                color={themeColor}
                                onClick={() => {
                                    setNewPassword(randomPassword());
                                }}
                            >
                                <Typography>Random</Typography>
                            </Button>
                        ) || !editMode && (
                            <Button variant={hasCopied ? "outlined" : "contained"}
                                startIcon={<ContentCopyIcon />}
                                color={themeColor}
                                onClick={() => {
                                    try {
                                        navigator.clipboard.writeText(newPassword);
                                        showSnackbar("Copied to clipboard", "success");
                                        setHasCopied(true);
                                    } catch(e) {
                                        showSnackbar("Error copying to clipboard", "error");
                                    }
                                }}
                            >
                                <Typography>Copy</Typography>
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    {editMode && (
                        <>
                            <Button sx={{ width: "100%" }}
                                color={themeColor} variant="outlined"  onClick={() => {
                                    setDialogIsOpen(false);
                                    setEditMode(true);
                                    setHasCopied(false);
                                    setNewPassword("");
                                }}>
                                <Typography variant="body1">Cancel</Typography>
                            </Button>
                            <Button color={themeColor} variant="contained" size="large" type="submit" 
                                disabled={!newPassword}
                                sx={{ width: "100%" }}>
                                <Typography variant="body1">{dialogUser?.has_password ? "Reset Password" : "Set Password"}</Typography>
                            </Button>
                        </>
                    ) || !editMode && (
                        <Button color={themeColor} variant="contained" size="large"
                            disabled={!hasCopied}
                            sx={{ width: "100%" }}
                            onClick={() => {
                                setDialogIsOpen(false);
                                setNewPassword("");
                                setHasCopied(false);
                                setEditMode(true);
                            }}>
                            <Typography variant="body1">Close</Typography>
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

UserResetPasswordDialog.propTypes = {
    dialogUser: PropTypes.object,
    dialogIsOpen: PropTypes.bool,
    setDialogIsOpen: PropTypes.func,
    handleResetPassword: PropTypes.func
};