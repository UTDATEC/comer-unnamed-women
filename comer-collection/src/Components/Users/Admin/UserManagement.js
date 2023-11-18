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
  Switch, IconButton, Alert, useTheme, Menu, MenuItem, Divider
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import Snackbar from "@mui/material/Snackbar";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";
import GroupAddIcon from "@mui/icons-material/GroupAdd";


const UserManagement = (props) => {
  const [curators, setCurators] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [curatorToDelete, setCuratorToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [userTypeMenuAnchorElement, setUserTypeMenuAnchorElement] = useState(null);
  const handleUserTypeMenuOpen = (event) => {
    setUserTypeMenuAnchorElement(event.currentTarget);
  }
  const handleUserTypeMenuClose = (event) => {
    setUserTypeMenuAnchorElement(null);
  }


  const { user, setUser, selectedNavItem, setSelectedNavItem } = props;
  const theme = useTheme();
  

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

  const curatorsToDisplay = curators.filter((curator) => {
    return !userTypeFilter || userTypeFilter == "Administrator" && curator.is_admin || userTypeFilter == "Curator" && !curator.is_admin
  }).filter((curator) => {
    return searchQuery == "" ||
    Boolean((curator.family_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
    Boolean((curator.given_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
    Boolean(`${(curator.given_name ?? "").toLowerCase()} ${(curator.family_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
    Boolean(`${(curator.family_name ?? "").toLowerCase()}, ${(curator.given_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
    Boolean(curator.email?.replace("@utdallas.edu", "").toLowerCase().includes(searchQuery.toLowerCase()))
  })
  

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
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<FilterAltOffOutlinedIcon/>} onClick={() => {
              setSearchQuery("");
              setUserTypeFilter(null);
            }}
              disabled={
                !Boolean(searchQuery || userTypeFilter)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button>
            <Button variant="contained" startIcon={<GroupAddIcon/>}>
              <Typography variant="body1">Create Users</Typography>
            </Button>
          </Stack>
        </Stack>
        <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 100px)' }}>
          <Table stickyHeader size="small" aria-label="curator table" sx={{ width: "100%" }}>
            <TableHead>
              <TableRow sx={{backgroundColor: "#CCC"}}>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">ID</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Name</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Email</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Password</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Courses</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Exhibitions</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: userTypeFilter ? theme.palette.secondary["200"] : "#CCC"}}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6">User Type</Typography>
                    <IconButton onClick={handleUserTypeMenuOpen}>
                      {
                        userTypeFilter ? (<FilterAltIcon fontSize="large" color="secondary" />) : (<FilterAltOutlinedIcon fontSize="large" />)
                      }
                    </IconButton>
                  </Stack>
                  <Menu MenuListProps={{
                    }} anchorEl={userTypeMenuAnchorElement} anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }} transformOrigin={{
                      vertical: "top",
                      horizontal: "center"
                    }} open={Boolean(userTypeMenuAnchorElement)} onClose={handleUserTypeMenuClose}>
                    <MenuItem onClick={() => {
                      handleUserTypeMenuClose();
                      setUserTypeFilter(null)
                    }}>
                      <Stack direction="row" spacing={1}>
                        <CheckIcon sx={{ visibility: !userTypeFilter ? "" : "hidden" }}/>
                        <Typography variant="body">
                          All Users
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {
                      handleUserTypeMenuClose();
                      setUserTypeFilter("Administrator")
                    }}>
                      <Stack direction="row" spacing={1}>
                        <CheckIcon sx={{ visibility: userTypeFilter == "Administrator" ? "" : "hidden" }}/>
                        <Typography variant="body">
                          Administrators
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleUserTypeMenuClose();
                      setUserTypeFilter("Curator")
                    }}>
                      <Stack direction="row" spacing={1}>
                        <CheckIcon sx={{ visibility: userTypeFilter == "Curator" ? "" : "hidden" }}/>
                        <Typography variant="body">
                          Curators
                        </Typography>
                      </Stack>
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Active</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {curatorsToDisplay.map((curator) => (
                  <TableRow key={curator.id} sx={{
                    [`&:hover`]: {
                      backgroundColor: "#EEE"
                    }
                  }}>
                    <TableCell>
                      <Typography variant="body1">{curator.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.family_name || curator.given_name ? `${curator.family_name}, ${curator.given_name}` : ""}</Typography>
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
