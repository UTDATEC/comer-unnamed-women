import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  TableCell,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import { DataTable } from "./Tools/DataTable";

const Profile = (props) => {

  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem } = props;
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const fetchMyCourses = async() => {
    try {
      const response = await axios.get(`http://localhost:9000/api/account/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setMyCourses(response.data.data);
    } catch(e) {
      console.log(`Error fetching courses: ${e.message}`);
    }
  }

  useEffect(() => {
    setSelectedNavItem("Profile");
    fetchMyCourses();
  }, [])


  
  const courseTableFields = [
    {
      columnDescription: "Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Name</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{course.name}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Start",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Start</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{new Date (course.date_start).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "End",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">End</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{new Date (course.date_end).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Status",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Status</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          {
            new Date(course.date_start).getTime() > new Date().getTime() && (
              <Typography variant="body1">Upcoming</Typography>
            ) || 
            new Date(course.date_end).getTime() < new Date().getTime() && (
              <Typography variant="body1">Expired</Typography>
            ) || 
            new Date(course.date_end).getTime() >= new Date().getTime() && new Date(course.date_start).getTime() <= new Date().getTime() && (
              <Typography variant="body1">Active</Typography>
            )
          }
        </TableCell>
      )
    },
    {
      columnDescription: "Notes",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Notes</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{course.notes}</Typography>
        </TableCell>
      )
    }
  ]


  return appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) || !appUser.password_change_required && (
    <>
    <Container style={{ paddingTop: "30px" }} maxWidth="xs">
      <Card style={{ border: "1px solid lightgrey" }}>
        <CardContent>
          <Stack direction="column" spacing={2}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontWeight: "bold" }}
          >
            User Information
          </Typography>
            <div>
              <strong>Net ID: </strong>
              <span>{appUser.email}</span>
            </div>
            <div>
              <strong>Name: </strong>
              <span>{`${appUser.given_name} ${appUser.family_name}`}</span>
            </div>
            <div>
              <strong>Password Last Updated: </strong>
              <span>{new Date(appUser.pw_updated).toLocaleString()}</span>
              <span style={{ paddingLeft: "10px" }}>
                <Button variant="outlined" color="primary" onClick={() => {
                  navigate('/Account/ChangePassword')
                }}>
                  <Typography>Change Password</Typography>
                </Button>
              </span>
            </div>
            <div>
              <strong>User Type: </strong>
              <span>{appUser.is_admin ? "Admin" : "Curator"}</span>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Container>
    <Stack spacing={2} margin={2}>
      <Typography variant="h4">My Courses</Typography>
      <DataTable
        items={myCourses}
        tableFields={courseTableFields}
      />
    </Stack>
    </>
  );
}

export default Profile;
