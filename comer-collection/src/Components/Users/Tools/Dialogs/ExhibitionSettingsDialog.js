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

export const exhibitionAccessOptions = (adminMode) => [
  {
    value: "PRIVATE",
    displayText: "Private",
    caption: adminMode ? 
      "Only the owner, you, and other administrators will be able to access this exhibition." :
      "Only you and administrators will be able to access this exhibition.",
    icon: LockIcon
  },
  {
    value: "PUBLIC_ANONYMOUS",
    displayText: "Anonymous",
    caption: adminMode ?
      "This exhibition will be visible to the public, but the owner's name will not be displayed to anyone except the owner and administrators." :
      "This exhibition will be visible to the public, but your name will not be displayed to anyone except you and administrators.",
    icon: VpnLockIcon
  },
  {
    value: "PUBLIC",
    displayText: "Public",
    caption: adminMode ?
      "This exhibition will be visible to the public, and the owner's full name will be visible to anyone who views the exhibition.  The owner's email address and course enrollments will never be displayed publicly." :
      "This exhibition will be visible to the public, and your full name will be visible to anyone who views the exhibition.  Your email address and course enrollments will never be displayed publicly.",
    icon: PublicIcon
  }
]


export const ExhibitionSettingsDialog = ({ editMode, adminMode, dialogIsOpen, setDialogIsOpen, dialogExhibitionId, dialogExhibitionTitle, dialogExhibitionAccess, setDialogExhibitionTitle, setDialogExhibitionAccess, handleExhibitionCreate, handleExhibitionEdit }) => {
  return (
    <Dialog component="form"
      open={dialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        dialogIsOpen(false);
      }}
      fullWidth={true}
      onSubmit={(e) => {
        e.preventDefault();
        if(editMode)
          handleExhibitionEdit(dialogExhibitionId, dialogExhibitionTitle, dialogExhibitionAccess);
        else
          handleExhibitionCreate(dialogExhibitionTitle, dialogExhibitionAccess);
      }}
    >
      <DialogTitle variant="h4" textAlign="center">{editMode ? "Edit Exhibition" : "Create Exhibition"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText variant="body1">{
          adminMode ? 
            "Set the title and access level for this exhibition.  These fields can be changed later by you or the owner." : 
            "Set the title and access level for your exhibition.  These fields can be changed later by you or your instructor/administrator."
          }</DialogContentText>
          <TextField value={dialogExhibitionTitle} label="Exhibition Title" 
            onChange={(e) => {
              setDialogExhibitionTitle(e.target.value)
            }}
            required />
          <DialogContentText variant="body1">
            {
              adminMode ?
                "Note that the privacy settings below will have no effect if you include the owner's personal information in the exhibition title.  The owner's name will remain visible to you and other administrators regardless of this setting." :
                "Note that the privacy settings below will have no effect if you include personal information in the exhibition title.  Your instructor/administrator will be able to see your name regardless of this setting."
            }
          </DialogContentText>
          <ToggleButtonGroup required exclusive orientation="vertical" value={dialogExhibitionAccess}
              onChange={(e, next) => {
                setDialogExhibitionAccess(next)
              }}>
          {exhibitionAccessOptions(Boolean(adminMode)).map((option) => (
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
            setDialogIsOpen(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="primary" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ width: "100%" }}
            disabled={!Boolean(dialogExhibitionAccess && dialogExhibitionTitle)}
            type="submit">
            <Typography variant="body1">{editMode ? "Save Settings" : "Create Exhibition"}</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

