import React, { useEffect, useState } from "react";
import {
  Typography, Stack, TableCell, Paper, Box, Button, IconButton
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable";
import { PhotoCameraBackIcon, LockIcon, PublicIcon, VpnLockIcon, AddIcon, InfoIcon, OpenInNewIcon, SettingsIcon, DeleteIcon } from "../IconImports";
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls";
import { getBlankItemFields } from "./Tools/HelperMethods/fields";
import { ExhibitionSettingsDialog } from "./Tools/Dialogs/ExhibitionSettingsDialog";
import { ItemSingleDeleteDialog } from "./Tools/Dialogs/ItemSingleDeleteDialog";
import { useSnackbar } from "../App/AppSnackbar";
import { useAppUser } from "../App/AppUser";
import { useTitle } from "../App/AppTitle";


const MyExhibitions = (props) => {

  const { setSelectedNavItem } = props;
  const showSnackbar = useSnackbar();
  const setTitleText = useTitle();

  const [appUser, setAppUser, initializeAppUser] = useAppUser();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogExhibitionId, setDialogExhibitionId] = useState(null);
  const [dialogExhibitionTitle, setDialogExhibitionTitle] = useState("");
  const [dialogExhibitionAccess, setDialogExhibitionAccess] = useState(null);
  const [isDialogInEditMode, setDialogIsEditMode] = useState(false);



  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);


  useEffect(() => {
    setSelectedNavItem("My Exhibitions");
    setTitleText("My Exhibitions")
    initializeAppUser();
  }, [])

  const theme = useTheme();
  const navigate = useNavigate();



  const handleExhibitionCreate = async(title, privacy) => {
    try {
      await sendAuthenticatedRequest("POST", "/api/account/exhibitions", {title, privacy});
      setDialogIsOpen(false);
      setDialogExhibitionId(null);
      setDialogExhibitionTitle("");
      setDialogExhibitionAccess(null)
      showSnackbar(`Exhibition ${title} created`, "success")
      initializeAppUser();
    }
    catch(e) {
      console.log(`Error creating exhibition: ${e.message}`)
      showSnackbar(`Error creating exhibition.`, "error")
    }
  }

  const handleExhibitionEditByOwner = async(exhibitionId, title, privacy) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/account/exhibitions/${exhibitionId}`, {title, privacy});
      setDialogIsOpen(false);
      setDialogExhibitionId(null);
      setDialogExhibitionTitle("");
      setDialogExhibitionAccess(null);
      showSnackbar(`Exhibition ${title} updated`, "success");
      initializeAppUser();
    } catch(e) {
      console.log(`Error updating exhibition: ${e.message}`)
      showSnackbar(`Error updating exhibition`, "error");
    }
  }

  
  const handleExhibitionDeleteByOwner = async(exhibitionId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/account/exhibitions/${exhibitionId}`);
      setDeleteDialogIsOpen(false);
      setDeleteDialogExhibition(null);
      showSnackbar(`Exhibition deleted`, "success");
      initializeAppUser();
    } catch(e) {
      console.log(`Error deleting exhibition: ${e.message}`)
      showSnackbar(`Error deleting exhibition`, "error");
    }
  }

  
  const exhibitionTableFields = [
    {
      columnDescription: "Title",
      maxWidth: "200px",
      generateTableCell: (exhibition) => (
        <Typography variant="body1">{exhibition.title}</Typography>
      ),
      generateSortableValue: (exhibition) => exhibition.title.toLowerCase()
    },
    {
      columnDescription: "Open",
      columnHeaderLabel: "",
      generateTableCell: (exhibition) => (
        <Button variant="outlined" endIcon={<OpenInNewIcon />} href={`/Exhibitions/${exhibition.id}`} target="_blank">
          <Typography variant="body1">Open</Typography>
        </Button>
      )
    },
    {
      columnDescription: "Date Created",
      generateTableCell: (exhibition) => (
        <Typography variant="body1">{new Date (exhibition.date_created).toLocaleString()}</Typography>
      ),
      generateSortableValue: (exhibition) => new Date(exhibition.date_created)
    },
    {
      columnDescription: "Date Modified",
      generateTableCell: (exhibition) => (
        <Typography variant="body1">{new Date (exhibition.date_modified).toLocaleString()}</Typography>
      ),
      generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
    },
    {
      columnDescription: "Access",
      generateTableCell: (exhibition) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {exhibition.privacy == "PRIVATE" && (
              <LockIcon />
            ) || exhibition.privacy == "PUBLIC_ANONYMOUS" && (
              <VpnLockIcon />
            ) || exhibition.privacy == "PUBLIC" && (
              <PublicIcon />
            )}
            <Typography variant="body1">{exhibition.privacy == "PRIVATE" && (
              "Private"
            ) || exhibition.privacy == "PUBLIC_ANONYMOUS" && (
              "Public Anonymous"
            ) || exhibition.privacy == "PUBLIC" && (
              "Public"
            )}</Typography>
        </Stack>
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (exhibition) => (
        <Stack direction="row" spacing={2}>

          <IconButton 
            onClick={() => {
              setDialogIsEditMode(true);
              setDialogExhibitionId(exhibition.id);
              setDialogExhibitionAccess(exhibition.privacy);
              setDialogExhibitionTitle(exhibition.title);
              setDialogIsOpen(true);
            }}
          >
            <SettingsIcon />
          </IconButton>

          <IconButton 
            onClick={() => {
              setDeleteDialogExhibition(exhibition);
              setDeleteDialogIsOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>

        </Stack>
      )
    }
  ]

  


  return appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) || !appUser.password_change_required && (
    <Box component={Paper} square sx={{height: "100%"}}>
    <Stack spacing={4} padding={5}>
      <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
        <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
          <PhotoCameraBackIcon fontSize="large" />
          <Typography variant="h4">My Exhibitions</Typography>
        </Stack>
          <Button color="primary" disabled={!appUser.can_create_exhibition} variant="contained" startIcon={<AddIcon/>} 
            onClick={() => {
              setDialogIsEditMode(false);
              setDialogExhibitionId(null);
              setDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">Create Exhibition</Typography>
          </Button>
        </Stack>
        <DataTable
          items={appUser.Exhibitions}
          visibleItems={appUser.Exhibitions}
          defaultSortColumn={"Date Modified"}
          defaultSortAscending={false}
          tableFields={exhibitionTableFields}
          emptyMinHeight="400px"
          NoContentIcon={InfoIcon}
          noContentMessage="You have no exhibitions."
          noContentButtonText="View your courses"
          noContentButtonAction={() => {
            navigate("/Account/Profile")
          }}
        />
      </Stack>

      <ItemSingleDeleteDialog 
        deleteDialogIsOpen={deleteDialogIsOpen}
        deleteDialogItem={deleteDialogExhibition}
        dialogTitle="Delete Exhibition"
        requireTypedConfirmation={true}
        entity="exhibition"
        handleDelete={handleExhibitionDeleteByOwner}
        setDeleteDialogIsOpen={setDeleteDialogIsOpen}
      />

      <ExhibitionSettingsDialog editMode={isDialogInEditMode} {...{dialogExhibitionId, dialogExhibitionAccess, setDialogExhibitionAccess, 
          dialogExhibitionTitle, setDialogExhibitionTitle, 
          dialogIsOpen, setDialogIsOpen, 
          handleExhibitionCreate, handleExhibitionEdit: handleExhibitionEditByOwner}} />
    </Box>
  );
}

export default MyExhibitions;
