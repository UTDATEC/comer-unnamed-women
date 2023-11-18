import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Stack,
  TableContainer, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch, IconButton, Alert
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import Snackbar from "@mui/material/Snackbar";

const UserManagement = (props) => {
  const [curators, setCurators] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [curatorToDelete, setCuratorToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { user, setUser, selectedNavItem, setSelectedNavItem } = props;
  

  const curatorColumns = {
    id: "ID",
    displayName: "Name",
    email: "Email",
    password: "Password",
    courseCount: "Courses",
    exhibitionCount: "Exhibitions",
    type: "User Type",
    isActive: "Active"
  };
  
  useEffect(() => {
    setSelectedNavItem("User Management");
    if(user.is_admin) {
      fetchData();
    }
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const curatorData = response.data;

      setCurators(curatorData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleDeleteClick = (curatorId) => {
    setCuratorToDelete({ curatorId });
    setDeleteConfirmation(true);
  };

  const handleChangeUserActivationStatus = async(userId, willBeActive) => {
    try {
      await axios.put(
        (willBeActive ? 
          `http://localhost:9000/api/users/${userId}/activate` : 
          `http://localhost:9000/api/users/${userId}/deactivate`
          ), null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`User ${userId} is now ${willBeActive ? "activated" : "deactivated"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error deactivating user ${userId}: ${error}`);

      setSnackbarText(`Error deactivating user ${userId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }


  const handleDelete = async () => {
    try {
      const { curatorId } = curatorToDelete;

      const response = await axios.delete(
        `http://localhost:9000/api/users/${curatorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        fetchData();
      } else {
        console.error("Error deleting curator:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    } finally {
      setDeleteConfirmation(false);
      setCuratorToDelete(null);
    }
  };


  return !user.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  user.is_admin && (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={2} padding={2}>
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} width="50%" />
          <Button variant="contained" startIcon={<AddIcon/>} disabled>
            <Typography variant="body1">Create User</Typography>
          </Button>
        </Stack>
        <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 100px)' }}>
          <Table stickyHeader size="small" aria-label="curator table" sx={{ width: "100%" }}>
            <TableHead>
              <TableRow sx={{backgroundColor: "#CCC"}}>
                {Object.keys(curatorColumns).map((col) => (
                  <TableCell key={col} sx={{backgroundColor: "#CCC"}}>
                    <Typography variant="h6">{curatorColumns[col]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {curators.map((curator) => (
                  <TableRow key={curator.id} sx={{
                    [`&:hover`]: {
                      backgroundColor: "#EEE"
                    },
                    display: (
                      searchQuery == "" ||
                      Boolean(curator.family_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      Boolean(curator.given_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      Boolean(`${curator.given_name?.toLowerCase()} ${curator.family_name?.toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
                      Boolean(`${curator.family_name?.toLowerCase()}, ${curator.given_name?.toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
                      Boolean(curator.email?.replace("@utdallas.edu", "").toLowerCase().includes(searchQuery.toLowerCase()))
                    ) ? "" : "none"
                  }}>
                    <TableCell>
                      <Typography variant="body1">{curator.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.family_name}, {curator.given_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {curator.pw_temp ? (
                        <IconButton onClick={() => {
                          try {
                            navigator.clipboard.writeText(curator.pw_temp);
                            setSnackbarSeverity("success")
                            setSnackbarText(`Password for user ${curator.id} copied to clipboard`);
                            setSnackbarOpen(true);
                          } catch (error) {
                            setSnackbarSeverity("error")
                            setSnackbarText(`Error copying password`);
                            setSnackbarOpen(true);
                          }  
                            
                          }}>
                          <ContentCopyIcon />
                        </IconButton>
                      ) : (
                        <Button variant="outlined" disabled>
                          <Typography variant="body1">Reset</Typography>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.Courses.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.Exhibitions.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.is_admin ? "Administrator" : "Curator"}</Typography>
                    </TableCell>


                    <TableCell>
                      <Switch 
                        itemID={curator.id}
                        checked={curator.is_active} 
                        disabled={curator.is_admin} 
                        onClick={(e) => {
                          handleChangeUserActivationStatus(e.target.parentElement.attributes.itemid.value, e.target.checked)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={3000} 
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          onClose={() => {
            setSnackbarOpen(false);
          }}
        >
          <Alert severity={snackbarSeverity} variant="standard" sx={{width: "100%"}}>
            <Stack direction="row" spacing={2}>
              <Typography variant="body1">{snackbarText}</Typography>
            </Stack>
          </Alert>
        </Snackbar>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        // className={classes.dialog}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Delete Curator
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this curator 
          {/* "{curatorToDelete?.curatorId}" */}
          ?
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setDeleteConfirmation(false)}
            color="primary"
            sx={{
              "&:hover": {
                color: "white",
                backgroundColor: "green",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            sx={{
              color: "red",
              "&:hover": {
                color: "white",
                backgroundColor: "red",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserManagement;
