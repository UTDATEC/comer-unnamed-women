import React, { useMemo, useRef } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { SaveIcon } from "../../../IconImports";
import { getLocalISOString } from "../HelperMethods/getLocalISOString";

export const ItemSingleEditDialog = ({ entity, dialogTitle, dialogInstructions, editDialogItem, editDialogFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen, handleItemEdit }) => {


    const editDialogFieldRefs = useRef([]);

    editDialogFieldRefs.current = [];

    const editDialogEntryFields = useMemo(() => {
        return (
            editDialogFieldDefinitions.map((f) => {
                return (
                    <TextField multiline={f.multiline}
                        minRows={2}
                        key={f.fieldName} 
                        name={f.fieldName} 
                        label={f.displayName} 
                        required={f.isRequired}
                        inputRef={(element) => editDialogFieldRefs.current.push(element)}
                        defaultValue={
                            f.inputType == "datetime-local" ?
                                getLocalISOString(editDialogItem?.[f.fieldName]) :
                                editDialogItem?.[f.fieldName]
                        }
                        inputProps={{
                            type: f.inputType,
                            min: f.minValue ?? ""
                        }}
                    >
                    </TextField>
                );
            })
        );
    }, [editDialogFieldDefinitions, editDialogItem]);
  
  
    return (
        <Dialog component="form" sx={{zIndex: 10000}}
            open={editDialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setEditDialogIsOpen(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                const editDialogFieldData = {};
                for(const r of editDialogFieldRefs.current) {
                    editDialogFieldData[r.name] = r.value;
                }
                handleItemEdit(editDialogItem.id, editDialogFieldData).then(() => {
                    editDialogFieldRefs.current = [];
                }).catch((e) => {
                    console.log("Error within handleItemEdit subroutine");
                });
            }}
        >
            <DialogTitle variant="h4" textAlign="center">{dialogTitle}</DialogTitle>
            <DialogContent
                sx={{
                    width: "500px",
                }}>
                <Stack spacing={2}>
                    <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
                    {editDialogEntryFields}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
                        setEditDialogIsOpen(false);
                        editDialogFieldRefs.current = [];
                    }}>
                        <Typography variant="body1">Cancel</Typography>
                    </Button>
                    <Button color="primary" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ width: "100%" }}
                        type="submit">
                        <Typography variant="body1">Save {entity}</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
