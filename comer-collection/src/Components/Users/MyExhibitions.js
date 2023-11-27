import React, { useEffect, useState } from "react";
import {
  Typography, Stack, TableCell, Paper, Box, Button
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddIcon from "@mui/icons-material/Add"
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls";
import { getBlankItemFields } from "./Tools/HelperMethods/fields";
import { ExhibitionCreateDialog } from "./Tools/Dialogs/ExhibitionCreateDialog";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";


const MyExhibitions = (props) => {

  const { appUser, setSelectedNavItem, showSnackbar, 
    
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;


  const [myExhibitions, setMyExhibitions] = useState([]);

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogExhibitionTitle, setCreateDialogExhibitionTitle] = useState("");
  const [createDialogExhibitionAccess, setCreateDialogExhibitionAccess] = useState(null);

  const fetchMyExhibitions = async() => {
    try {
      const response = await sendAuthenticatedRequest("GET", `/api/account/exhibitions`);
      setMyExhibitions(response.data);
    } catch(e) {
      console.log(`Error fetching courses: ${e.message}`);
    }
  }

  useEffect(() => {
    setSelectedNavItem("My Exhibitions");
    fetchMyExhibitions();
  }, [])

  const theme = useTheme();
  const navigate = useNavigate();



  const handleExhibitionCreate = async(title, privacy) => {
    try {
      const response = await sendAuthenticatedRequest("POST", "/api/account/exhibitions", {title, privacy});
      setCreateDialogIsOpen(false);
      setCreateDialogExhibitionTitle("");
      setCreateDialogExhibitionAccess(null)
      showSnackbar(`Exhibition ${title} created`, "success")
    }
    catch(e) {
      console.log(`Error creating exhibition: ${e.message}`)
      showSnackbar(`Error creating exhibition.`, "error")
    }
    fetchMyExhibitions();
  }

  
  const exhibitionTableFields = [
    {
      columnDescription: "Title",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Title</Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "200px"}}>
          <Typography variant="body1">{exhibition.title}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Date Created",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Date Created</Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Typography variant="body1">{new Date (exhibition.date_created).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Date Modified",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Date Modified</Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Typography variant="body1">{new Date (exhibition.date_modified).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Access",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Access</Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
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
        </TableCell>
      )
    },
    {
      columnDescription: "Open",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6"></Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={`/Exhibitions/${exhibition.id}`} target="_blank">
            <Typography variant="body1">Open</Typography>
          </Button>
        </TableCell>
      )
    },
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
              setCreateDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">Create Exhibition</Typography>
          </Button>
        </Stack>
        <DataTable
          visibleItems={myExhibitions}
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

      <ExhibitionCreateDialog {...{createDialogExhibitionAccess, setCreateDialogExhibitionAccess, 
          createDialogExhibitionTitle, setCreateDialogExhibitionTitle, 
          createDialogIsOpen, setCreateDialogIsOpen, 
          handleExhibitionCreate}} />
    </Box>
  );
}

export default MyExhibitions;
