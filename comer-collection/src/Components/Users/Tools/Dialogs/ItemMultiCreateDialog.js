import React, { useCallback, useReducer } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, IconButton, DialogContentText, TextField, Divider
} from "@mui/material";
import { DeleteIcon } from "../../../IconImports";
import { getBlankItemFields } from "../HelperMethods/fields";
import PropTypes from "prop-types";

export const ItemMultiCreateDialog = ({ entity, dialogTitle, dialogInstructions, createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen, handleItemsCreate }) => {


    const createDialogReducer = useCallback((createDialogItems, action) => {
        switch (action.type) {
        case "add":
            return [...createDialogItems, getBlankItemFields(createDialogFieldDefinitions)];
  
        case "change":
            return createDialogItems.map((r, i) => {
                if (action.index == i)
                    return { ...r, [action.field]: action.newValue };
  
                else
                    return r;
            });
  
        case "remove":
            return createDialogItems.filter((r, i) => {
                return action.index != i;
            });
  
        case "set":
            return action.newArray;
  
        default:
            throw Error("Unknown action type");
        }
    }, [createDialogFieldDefinitions]);


    const [createDialogItems, createDialogDispatch] = useReducer(createDialogReducer, []);



    return (
        <Dialog component="form" fullWidth={true} maxWidth="lg" sx={{zIndex: 10000}}
            open={dialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setDialogIsOpen(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                handleItemsCreate([...createDialogItems]).then(indicesWithErrors => {
                    createDialogDispatch({
                        type: "set",
                        newArray: createDialogItems.filter((u, i) => {
                            return indicesWithErrors.includes(i);
                        })
                    });
                });
            }}
        >
            <DialogTitle textAlign="center" variant="h4">{dialogTitle}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
                    {createDialogItems.map((u, index) => (
                        <React.Fragment key={index}>
                            <Divider />
                            <Stack direction="row" spacing={2} alignItems="center" justifyItems="center">
                                <DialogContentText variant="body1">{index + 1}</DialogContentText>
                                <Stack key={index} direction="row" spacing={{xs: 1, sm: 2}} alignItems="center" useFlexGap flexWrap="wrap">
                                    {createDialogFieldDefinitions.map((f, fi) => (
                                        <TextField key={f.fieldName} 
                                            name={f.fieldName} 
                                            label={f.displayName ?? ""} 
                                            autoFocus={fi==0} 
                                            value={u[f.fieldName]} 
                                            multiline={f.multiline}
                                            minRows={2}
                                            sx={{ 
                                                minWidth: "330px"
                                            }}
                                            inputProps={{
                                                type: f.inputType ?? "text",
                                                maxLength: f.maxlength ?? 255,
                                                min: f.minValue
                                            }}
                                            InputLabelProps={
                                                (() => {
                                                    if(f.inputType == "datetime-local") {
                                                        return {
                                                            "shrink": true
                                                        };
                                                    }
                                                })()
                                                // {
                                                //   [f.inputType == "datetime-local" ? "shrink" : ""]: true
                                                // }
                                            }
                                            required={Boolean(f.isRequired)}
                                            onChange={(e) => {
                                                createDialogDispatch({
                                                    type: "change",
                                                    field: f.fieldName,
                                                    index: index,
                                                    newValue: e.target.value
                                                });
                                            }} />
                                    ))}
                                </Stack>
                                <IconButton onClick={() => {
                                    createDialogDispatch({
                                        type: "remove",
                                        index: index
                                    });
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </React.Fragment>
                    ))}
                    <Divider />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    <Button color="primary" variant="outlined" size="large" onClick={() => {
                        setDialogIsOpen(false);
                        createDialogDispatch({
                            type: "set",
                            newArray: []
                        });
                    }}>
                        <Typography variant="body1">
                            {createDialogItems.length > 0 ? "Cancel" : "Close"}
                        </Typography>
                    </Button>
                    <Stack direction="row" spacing={1} sx={{ width: "50%" }}>
                        <Button color="primary"
                            variant={createDialogItems.length ? "outlined" : "contained"}
                            size="large" sx={{ width: "100%" }} onClick={() => {
                                createDialogDispatch({
                                    type: "add"
                                });
                            }}>
                            <Typography variant="body1">{createDialogItems.length ? `Add another ${entity}` : `Add ${entity}`}</Typography>
                        </Button>
                        <Button type="submit" color="primary" variant="contained" size="large" sx={{ width: "100%" }}
                            disabled={createDialogItems.length == 0}>
                            <Typography variant="body1">{createDialogItems.length >= 2 ? `Create (${createDialogItems.length})` : "Create"}</Typography>
                        </Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ItemMultiCreateDialog.propTypes = {
    entity: PropTypes.string,
    dialogTitle: PropTypes.string,
    dialogInstructions: PropTypes.string,
    createDialogFieldDefinitions: PropTypes.arrayOf(PropTypes.object),
    dialogIsOpen: PropTypes.bool,
    setDialogIsOpen: PropTypes.func,
    handleItemsCreate: PropTypes.func
};