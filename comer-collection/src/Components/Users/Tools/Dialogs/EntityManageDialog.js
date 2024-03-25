import React, { useMemo, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Divider, TextField, Box
} from "@mui/material";
import { AddIcon } from "../../../IconImports.js";
import { getBlankItemFields } from "../HelperMethods/fields.js";
import { DataTable } from "../DataTable.js";
import SearchBox from "../SearchBox.js";
import { searchItems } from "../SearchUtilities.js";
import { ItemSingleDeleteDialog } from "./ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "./ItemSingleEditDialog.js";
import PropTypes from "prop-types";

export const EntityManageDialog = ({ entitySingular, entityPlural,
    dialogTitle, dialogInstructionsTable, dialogInstructionsForm,
    dialogItems, 
    dialogFieldDefinitions, dialogTableFields,
    dialogIsOpen, setDialogIsOpen,
    handleItemCreate, handleItemEdit, handleItemDelete,
    searchBoxFields, searchBoxPlaceholder, itemSearchQuery, setItemSearchQuery,

    internalDeleteDialogIsOpen, setInternalDeleteDialogIsOpen,
    internalDeleteDialogItem, 

    internalEditDialogIsOpen, setInternalEditDialogIsOpen,
    internalEditDialogItem, 

    onClose
}) => {

    const blankItem = getBlankItemFields(dialogFieldDefinitions);
    const [itemToAdd, setItemToAdd] = useState(blankItem);

    const visibleItems = useMemo(() => {
        return searchItems(itemSearchQuery, dialogItems, searchBoxFields);
    }, [dialogItems]);

    const entityDataTable = useMemo(() => {
        return (
            <DataTable tableFields={dialogTableFields} items={dialogItems} visibleItems={visibleItems} />
        );
    }, [dialogItems, visibleItems]);

    return (
        <>
            <Dialog fullWidth={true} maxWidth="lg" sx={{ zIndex: 10000 }}
                open={dialogIsOpen} disableEscapeKeyDown
                onClose={(event, reason) => {
                    if (reason == "backdropClick")
                        return;
                    setDialogIsOpen(false);
                }}
            >
                <DialogTitle textAlign="center" variant="h4">{dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gridTemplateRows: "auto auto",
                            gridTemplateAreas: `
            "update"
            "create"
            `
                        }}>
                        <Box sx={{ gridArea: "update" }}>
                            <Stack spacing={2} sx={{ height: "300px" }}>
                                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                                    <DialogContentText textAlign="left" variant="h6">{dialogInstructionsTable}</DialogContentText>
                                    <SearchBox searchQuery={itemSearchQuery} setSearchQuery={setItemSearchQuery}
                                        placeholder={searchBoxPlaceholder} width="40%"
                                    />
                                </Stack>

                                {entityDataTable}

                            </Stack>
                        </Box>
                        <Divider />
                        <Box sx={{ gridArea: "create" }}>
                            <Stack spacing={2}>
                                <DialogContentText textAlign="left" variant="h6">{dialogInstructionsForm}</DialogContentText>
                                <Stack component="form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleItemCreate(itemToAdd);
                                        setItemToAdd(getBlankItemFields(dialogFieldDefinitions));
                                    }}
                                    direction="row" alignItems="center" spacing={2} justifyContent="space-around">
                                    <Stack direction="row" useFlexGap flexWrap="wrap" alignItems="center" spacing={2} >
                                        {dialogFieldDefinitions.map((f, fi) => (
                                            <TextField key={f.fieldName}
                                                name={f.fieldName}
                                                label={f.displayName}
                                                autoFocus={fi == 0}
                                                value={itemToAdd[f.fieldName]}
                                                sx={{
                                                    minWidth: "200px"
                                                }}
                                                multiline={f.multiline}
                                                minRows={2}
                                                inputProps={{
                                                    type: f.inputType ?? "text",
                                                    sx: {
                                                        ...{
                                                            textAlign: f.inputType == "datetime-local" ? "center" : ""
                                                        }
                                                    }
                                                }}
                                                required={Boolean(f.isRequired)}
                                                onChange={(e) => {
                                                    setItemToAdd({
                                                        ...itemToAdd,
                                                        [f.fieldName]: e.target.value
                                                    });
                                                }} />
                                        ))}

                                    </Stack>
                                    <Button type="submit" variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{ minWidth: "200px", height: "100%" }}
                                    >
                                        <Typography variant="body1">{`Create ${entitySingular}`}</Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" justifyContent="space-between" width="100%">
                        <Typography paddingLeft={4} variant="h6" sx={{ opacity: 0.5 }}>{dialogItems.length} {dialogItems.length == 1 ? entitySingular : entityPlural}</Typography>
                        <Button sx={{
                            width: "30%"
                        }} color="primary" variant="contained" size="large"
                        onClick={() => {
                            if (onClose)
                                onClose();
                            setDialogIsOpen(false);
                        }}
                        >
                            <Typography variant="body1">Close</Typography>
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>


            <ItemSingleEditDialog
                editDialogIsOpen={internalEditDialogIsOpen}
                setEditDialogIsOpen={setInternalEditDialogIsOpen}
                editDialogItem={internalEditDialogItem}
                entity={entitySingular}
                dialogTitle={`Edit ${entitySingular[0].toUpperCase()}${entitySingular.substring(1)}`}
                dialogInstructions="Update"
                handleItemEdit={handleItemEdit}
                editDialogFieldDefinitions={dialogFieldDefinitions}
            />


            <ItemSingleDeleteDialog
                deleteDialogIsOpen={internalDeleteDialogIsOpen}
                setDeleteDialogIsOpen={setInternalDeleteDialogIsOpen}
                deleteDialogItem={internalDeleteDialogItem}
                dialogTitle={`Delete ${entitySingular[0].toUpperCase()}${entitySingular.substring(1)}`}
                entity={entitySingular}
                handleDelete={handleItemDelete}
            />

        </>
    );
};


EntityManageDialog.propTypes = {
    entitySingular: PropTypes.string,
    entityPlural: PropTypes.string,
    dialogTitle: PropTypes.string,
    dialogInstructionsTable: PropTypes.string,
    dialogInstructionsForm: PropTypes.string,
    dialogItems: PropTypes.arrayOf(PropTypes.object),
    dialogFieldDefinitions: PropTypes.arrayOf(PropTypes.object),
    dialogTableFields: PropTypes.PropTypes.arrayOf(PropTypes.object),
    dialogIsOpen: PropTypes.bool,
    setDialogIsOpen: PropTypes.func,
    handleItemCreate: PropTypes.func,
    handleItemEdit: PropTypes.func,
    handleItemDelete: PropTypes.func,
    searchBoxFields: PropTypes.arrayOf(PropTypes.string),
    searchBoxPlaceholder: PropTypes.string,
    itemSearchQuery: PropTypes.string,
    setItemSearchQuery: PropTypes.func,
    internalDeleteDialogIsOpen: PropTypes.bool,
    setInternalDeleteDialogIsOpen: PropTypes.func,
    internalDeleteDialogItem: PropTypes.object,
    internalEditDialogIsOpen: PropTypes.bool,
    setInternalEditDialogIsOpen: PropTypes.func,
    internalEditDialogItem: PropTypes.object,
    onClose: PropTypes.func
};