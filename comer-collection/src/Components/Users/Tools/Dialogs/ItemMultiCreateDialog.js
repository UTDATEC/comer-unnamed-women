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

export const ItemMultiCreateDialog = ({ entity, dialogTitle, dialogInstructions, createDialogItems, createDialogFieldDefinitions, createDialogIsOpen, setCreateDialogIsOpen, handleItemsCreate, createDialogDispatch }) => {
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
        handleItemsCreate([...createDialogItems]);
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
                    label={f.displayName} 
                    autoFocus={fi==0} 
                    value={u[f.fieldName]} 
                    multiline={f.multiline}
                    minRows={2}
                    sx={{ 
                      minWidth: "330px"
                    }}
                    inputProps={{
                      type: f.inputType ?? "text",
                      sx: {...{
                        textAlign: f.inputType == "datetime-local" ? "center" : ""
                      }}
                    }}
                    required={Boolean(f.isRequired)}
                  onChange={(e) => {
                    createDialogDispatch({
                      type: 'change',
                      field: f.fieldName,
                      index: index,
                      newValue: e.target.value
                    });
                  }} />
                ))}
              </Stack>
              <IconButton onClick={() => {
                createDialogDispatch({
                  type: 'remove',
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
            setCreateDialogIsOpen(false);
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
              size="large" sx={{ width: "100%" }} onClick={(e) => {
                createDialogDispatch({
                  type: 'add'
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
