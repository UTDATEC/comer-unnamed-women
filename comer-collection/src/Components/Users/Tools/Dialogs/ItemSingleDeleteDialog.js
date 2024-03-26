import React, { useEffect, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon } from "../../../IconImports.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../../App/AppSnackbar.js";

export const ItemSingleDeleteDialog = ({ requireTypedConfirmation, allItems, setAllItems, Entity, deleteDialogItem, deleteDialogIsOpen, setDeleteDialogIsOpen }) => {

    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const showSnackbar = useSnackbar();

    useEffect(() => {
        if(deleteDialogIsOpen)
            setSubmitEnabled(true);
    }, [deleteDialogIsOpen]);
  
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
                setSubmitEnabled(false);
                if(deleteDialogItem)
                // handleDelete(deleteDialogItem.id);
                {
                    Entity.handleDelete(deleteDialogItem.id).then((msg) => {
                        setAllItems(allItems.filter((i) => i.id !== deleteDialogItem.id));
                        showSnackbar(msg, "success");
                        setDeleteDialogIsOpen(false);
                    }).catch((err) => {
                        setSubmitEnabled(true);
                        showSnackbar(err, "error");
                    });
                }
                setDeleteConfirmation("");
            }}
        >
            <DialogTitle variant="h4" textAlign="center">Delete {Entity?.singular.substr(0, 1).toUpperCase()}{Entity?.singular.substr(1).toLowerCase()}</DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText variant="body1" sx={{wordWrap: "break-word"}}>Are you sure you want to delete the {Entity?.singular} <i>{deleteDialogItem?.safe_display_name}</i>?</DialogContentText>
                    {requireTypedConfirmation && (
                        <TextField autoComplete="off" value={deleteConfirmation} onChange={(e) => {
                            setDeleteConfirmation(e.target.value);
                        }} placeholder="Type 'delete' to confirm" />
                    )}

                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    <Button color="primary" disabled={!submitEnabled} variant="outlined" sx={{ width: "100%" }} onClick={() => {
                        setDeleteDialogIsOpen(false);
                    }}>
                        <Typography variant="body1">Cancel</Typography>
                    </Button>
                    <Button color="error" disabled={!submitEnabled || requireTypedConfirmation && deleteConfirmation.toLowerCase() != "delete"} 
                        type="submit" variant="contained" size="large" startIcon={<DeleteIcon />} sx={{ width: "100%" }}>
                        <Typography variant="body1">Delete</Typography>

                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    allItems: PropTypes.arrayOf(PropTypes.object),
    setAllItems: PropTypes.func,
    requireTypedConfirmation: PropTypes.bool,
    deleteDialogItem: PropTypes.object,
    deleteDialogIsOpen: PropTypes.bool,
    setDeleteDialogIsOpen: PropTypes.func,
    Entity: PropTypes.any
};