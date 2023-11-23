import React, { useEffect, useState } from "react";
import {
  Typography, Stack, TableCell
} from "@mui/material";
import { Navigate } from "react-router";
import axios from "axios";
import { DataTable } from "./Tools/DataTable";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import LockIcon from "@mui/icons-material/Lock"
import PublicIcon from "@mui/icons-material/Public"


const MyExhibitions = (props) => {

  const { appUser, setSelectedNavItem, 
    
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;


  const [myExhibitions, setMyExhibitions] = useState([]);
  const fetchMyExhibitions = async() => {
    try {
      const response = await axios.get(`http://localhost:9000/api/account/exhibitions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setMyExhibitions(response.data.data);
    } catch(e) {
      console.log(`Error fetching courses: ${e.message}`);
    }
  }

  useEffect(() => {
    setSelectedNavItem("My Exhibitions");
    fetchMyExhibitions();
  }, [])


  
  const exhibitionTableFields = [
    {
      columnDescription: "Title",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Title</Typography>
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Typography variant="body1">{exhibition.title}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Date Created",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
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
        <TableCell sx={{backgroundColor: "#CCC"}}>
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
        <TableCell sx={{backgroundColor: "#CCC"}}>
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
    <>
    <Stack spacing={4} margin={5}>
      <Stack spacing={2} margin={5}>
      <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
          <PhotoCameraBackIcon fontSize="large" />
          <Typography variant="h4">My Exhibitions</Typography>
        </Stack>
        <DataTable
          items={myExhibitions}
          tableFields={exhibitionTableFields}
        />
      </Stack>
    </Stack>
    </>
  );
}

export default MyExhibitions;
