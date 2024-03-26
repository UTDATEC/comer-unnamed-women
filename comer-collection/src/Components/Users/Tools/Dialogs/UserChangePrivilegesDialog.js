import React, { useEffect, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Checkbox, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { SecurityIcon, PersonIcon, CollectionManagerIcon } from "../../../IconImports.js";
import PropTypes from "prop-types";
import { User } from "../Entities/User.js";
import { useSnackbar } from "../../../App/AppSnackbar.js";


const userPrivilegeOptions = () => [
    {
        value: "ADMINISTRATOR",
        displayText: "Administrator",
        caption: "Administrators have full control of the system.  They can manage users, courses, exhibitions, and the collection.  They can also change the access level of other users and revoke your privileges.",
        icon: SecurityIcon,
        color: "secondary"
    },
    {
        value: "COLLECTION_MANAGER",
        displayText: "Collection Manager",
        caption: "Collection managers can manage images, artists, and tags.  They also have curator privileges.  This role is appropriate for student workers who help manage the collection.",
        icon: CollectionManagerIcon,
        color: "secondary"
    },
    {
        value: "CURATOR",
        displayText: "Curator",
        caption: "Curators can create and edit their own exhibitions using existing images.  This role is appropriate for most users, including students.",
        icon: PersonIcon,
        color: "primary"
    }
];


export const UserChangePrivilegesDialog = ({ dialogUser, dialogIsOpen, setDialogIsOpen, refreshAllItems }) => {

    const [confirmAction, setConfirmAction] = useState(false);
    const [newAccess, setNewAccess] = useState(null);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const showSnackbar = useSnackbar();

    const themeColor = newAccess == "CURATOR" ? "primary" : "secondary";

    useEffect(() => {
        if(dialogIsOpen) {
            setNewAccess(dialogUser?.access_level);
            setSubmitEnabled(true);
            setConfirmAction(false);
        }
    }, [dialogUser, dialogIsOpen]);

    return (
        <Dialog fullWidth={true} maxWidth="sm" component="form" sx={{zIndex: 10000}}
            open={dialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setDialogIsOpen(false);
                setConfirmAction(false);
            }} 
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitEnabled(false);
                User.handleChangeUserAccess(dialogUser.id, newAccess).then((msg) => {
                    setDialogIsOpen(false);
                    setConfirmAction(false);
                    refreshAllItems();
                    showSnackbar(msg, "success");
                }).catch((err) => {
                    setConfirmAction(false);
                    setSubmitEnabled(true);
                    showSnackbar(err, "error");
                });
            }}
        >
            <DialogTitle variant="h4" textAlign="center">Set Access Level for <i>{dialogUser?.safe_display_name}</i></DialogTitle>

            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <ToggleButtonGroup required exclusive orientation="vertical" value={newAccess}
                        onChange={(e, next) => {
                            if(next) {
                                setNewAccess(next);
                                setConfirmAction(false);
                            }
                        }}>
                        {userPrivilegeOptions().map((option) => (
                            <ToggleButton disabled={!submitEnabled} color={option.color} key={option.value} value={option.value} sx={{textTransform: "unset", minHeight: "100px"}}>
                                <Stack direction="row" alignItems="center" spacing={2} paddingLeft={1}>
                                    <option.icon fontSize="large" />
                                    <Stack direction="column" sx={{width: "460px"}} justifyContent="left">
                                        <Typography color="white" fontWeight="bold">{option.displayText}</Typography>
                                        <Typography color="white" sx={{opacity: 0.5}}>{option.caption}</Typography>
                                    </Stack>
                                </Stack>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Checkbox disabled={!submitEnabled || newAccess == dialogUser?.access_level} checked={confirmAction}  color={themeColor} size="large"
                            onChange={(e) => {
                                setConfirmAction(e.target.checked);
                            }}
                        />
                        <DialogContentText variant="body1">
              Please check the box to confirm this operation.
                        </DialogContentText>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    <Button color={themeColor} disabled={!submitEnabled} variant="outlined" sx={{ width: "100%" }} onClick={() => {
                        setDialogIsOpen(false);
                        setConfirmAction(false);
                    }}>
                        <Typography variant="body1">Cancel</Typography>
                    </Button>
                    <Button color={themeColor} variant="contained" size="large" type="submit" disabled={!confirmAction || !submitEnabled || newAccess == dialogUser?.access_level} sx={{ width: "100%" }}>
                        <Typography variant="body1">Change Access</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

UserChangePrivilegesDialog.propTypes = {
    dialogUser: PropTypes.object,
    dialogIsOpen: PropTypes.bool,
    setDialogIsOpen: PropTypes.func,
    refreshAllItems: PropTypes.func
};
