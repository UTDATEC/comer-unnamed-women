import React, { useEffect, useState } from "react";
import {
  Typography, Stack, TableCell, Paper, Box
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls";


const MyExhibitions = (props) => {

  const { appUser, setSelectedNavItem, 
    
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;


  const [myExhibitions, setMyExhibitions] = useState([]);
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
                <PublicIcon />
              ) || exhibition.privacy == "PUBLIC" && (
                <PublicIcon />
              )}
              <Typography variant="body1">{exhibition.privacy}</Typography>
          </Stack>
        </TableCell>
      )
    },
  ]

  


  return appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) || !appUser.password_change_required && (
    <Box component={Paper} square sx={{height: "100%"}}>
    <Stack spacing={4} padding={5}>
      <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
          <PhotoCameraBackIcon fontSize="large" />
          <Typography variant="h4">My Exhibitions</Typography>
        </Stack>
        <DataTable
          visibleItems={myExhibitions}
          tableFields={exhibitionTableFields}
        />
      </Stack>
    </Box>
  );
}

export default MyExhibitions;
