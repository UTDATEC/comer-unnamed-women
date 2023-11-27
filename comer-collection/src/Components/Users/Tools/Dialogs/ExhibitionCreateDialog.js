import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, TextField, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack"

export const exhibitionAccessOptions = [
  {
    value: "PRIVATE",
    displayText: "Private",
    caption: "Only you and administrators will be able to access this exhibition.",
    icon: LockIcon
  },
  {
    value: "PUBLIC_ANONYMOUS",
    displayText: "Anonymous",
    caption: "This exhibition will be visible to the public, but your name will not be displayed to anyone except you and administrators.",
    icon: VpnLockIcon
  },
  {
    value: "PUBLIC",
    displayText: "Public",
    caption: "This exhibition will be visible to the public, and your full name will be visible to anyone who views the exhibition.  Your email address and course enrollments will not be displayed publicly.",
    icon: PublicIcon
  }
]


export const ExhibitionCreateDialog = ({ createDialogIsOpen, setCreateDialogIsOpen, createDialogExhibitionTitle, createDialogExhibitionAccess, setCreateDialogExhibitionTitle, setCreateDialogExhibitionAccess, handleExhibitionCreate }) => {
  return (
    <Dialog component="form"
      open={createDialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        createDialogIsOpen(false);
      }}
      fullWidth={true}
      onSubmit={(e) => {
        e.preventDefault();
        handleExhibitionCreate(createDialogExhibitionTitle, createDialogExhibitionAccess);
      }}
    >
      <DialogTitle variant="h4" textAlign="center">Create Exhibition</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText variant="body1">Set the title and access level for your new exhibition.  These fields can be changed later by you or your instructor/administrator.</DialogContentText>
          <TextField value={createDialogExhibitionTitle} label="Exhibition Title" 
            onChange={(e) => {
              setCreateDialogExhibitionTitle(e.target.value)
            }}
            required />
          <ToggleButtonGroup required exclusive orientation="vertical" value={createDialogExhibitionAccess}
              onChange={(e, next) => {
                setCreateDialogExhibitionAccess(next)
              }}>
          {exhibitionAccessOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value} sx={{textTransform: "unset", minHeight: "100px"}}>
              <Stack direction="row" alignItems="center" spacing={2} paddingLeft={1}>
                <option.icon fontSize="large" />
                <Stack direction="column" sx={{width: "460px"}} justifyContent="left">
                  <Typography fontWeight="bold">{option.displayText}</Typography>
                  <Typography sx={{opacity: 0.5}}>{option.caption}</Typography>
                </Stack>
              </Stack>
            </ToggleButton>
          ))}
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setCreateDialogIsOpen(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="primary" variant="contained" size="large" startIcon={<PhotoCameraBackIcon />} sx={{ width: "100%" }}
            disabled={!Boolean(createDialogExhibitionAccess && createDialogExhibitionTitle)}
            type="submit">
            <Typography variant="body1">Create Exhibition</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

