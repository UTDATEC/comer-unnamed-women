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
  Switch, Alert, useTheme, Box
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
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import { ColumnFilterButton } from "../Tools/ColumnFilterButton";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LockResetIcon from "@mui/icons-material/LockReset";
import RefreshIcon from "@mui/icons-material/Refresh";


const UserManagement = (props) => {
  const [curators, setCurators] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [curatorToDelete, setCuratorToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [userTypeMenuAnchorElement, setUserTypeMenuAnchorElement] = useState(null);
  const clearFilters = () => {
    setSearchQuery("");
    setUserTypeFilter(null);
    setUserActivationStatusFilter(null);
    setUserPasswordTypeFilter(null);
  }

  const [userActivationStatusFilter, setUserActivationStatusFilter] = useState(null);
  const [userActivationStatusMenuAnchorElement, setUserActivationStatusMenuAnchorElement] = useState(null);

  const [userPasswordTypeFilter, setUserPasswordTypeFilter] = useState(null);
  const [userPasswordTypeMenuAnchorElement, setUserPasswordTypeMenuAnchorElement] = useState(null);

  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


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
      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const curatorsToDisplay = curators
  .filter((curator) => {
    return !userTypeFilter || userTypeFilter == "Administrator" && curator.is_admin || userTypeFilter == "Curator" && !curator.is_admin
  })
  .filter((curator) => {
    return !userActivationStatusFilter || userActivationStatusFilter == "Active" && curator.is_active || userActivationStatusFilter == "Inactive" && !curator.is_active
  })
  .filter((curator) => {
    return !userPasswordTypeFilter || userPasswordTypeFilter == "Temporary" && curator.pw_temp || userPasswordTypeFilter == "Permanent" && !curator.pw_temp
  })
  .filter((curator) => {
    return searchQuery == "" ||
    Boolean((curator.family_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
    Boolean((curator.given_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
    Boolean(`${(curator.given_name ?? "").toLowerCase()} ${(curator.family_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
    Boolean(`${(curator.family_name ?? "").toLowerCase()}, ${(curator.given_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
    Boolean(curator.email?.replace("@utdallas.edu", "").toLowerCase().includes(searchQuery.toLowerCase()))
  })
  .sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
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

  const handleResetPassword = async(userId) => {
    try {
      await axios.put(
        `http://localhost:9000/api/users/${userId}/resetpassword`, null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`Password reset for user ${userId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error resetting password for user ${userId}: ${error}`);

      setSnackbarText(`Error resetting password for user ${userId}`)
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
            <Button variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
              setRefreshInProgress(true);
              fetchData();
            }}
              disabled={refreshInProgress}>
              <Typography variant="body1">Refresh</Typography>
            </Button>
            <Button variant="outlined" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
              disabled={
                !Boolean(searchQuery || userTypeFilter || userActivationStatusFilter || userPasswordTypeFilter)
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
              <TableRow>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                  </Stack>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                  </Stack>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ColumnSortButton columnName="Email" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                  </Stack>
                </TableCell>
                <TableCell sx={{backgroundColor: userPasswordTypeFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="Password"
                      options={[
                        {
                          value: "Temporary",
                          displayText: "Temporary password"
                        },
                        {
                          value: "Permanent",
                          displayText: "Password set by user"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userPasswordTypeFilter} 
                      setFilter={setUserPasswordTypeFilter} 
                      menuAnchorElement={userPasswordTypeMenuAnchorElement}
                      setMenuAnchorElement={setUserPasswordTypeMenuAnchorElement}
                    />
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Courses</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Exhibitions</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: userTypeFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="User Type"
                      options={[
                        {
                          value: "Administrator",
                          displayText: "Administrators"
                        },
                        {
                          value: "Curator",
                          displayText: "Curators"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userTypeFilter} 
                      setFilter={setUserTypeFilter} 
                      menuAnchorElement={userTypeMenuAnchorElement}
                      setMenuAnchorElement={setUserTypeMenuAnchorElement}
                    />
                </TableCell>
                <TableCell sx={{backgroundColor: userActivationStatusFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="Active" 
                      options={[
                        {
                          value: "Active",
                          displayText: "Active"
                        },
                        {
                          value: "Inactive",
                          displayText: "Inactive"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userActivationStatusFilter} 
                      setFilter={setUserActivationStatusFilter} 
                      menuAnchorElement={userActivationStatusMenuAnchorElement}
                      setMenuAnchorElement={setUserActivationStatusMenuAnchorElement}
                    />
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
                      {
                        curator.family_name || curator.given_name ? (
                          <Typography variant="body1">{curator.family_name ?? ""}, {curator.given_name ?? ""}</Typography>
                        ) : (
                          <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
                        )
                      }
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {curator.pw_temp ? (
                        <Button startIcon={<ContentCopyIcon />}
                          variant="outlined"
                          onClick={() => {
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
                          <Typography variant="body1">Copy</Typography>
                        </Button>
                      ) : (
                        <Button 
                          startIcon={<LockResetIcon />}
                          itemID={curator.id}
                          variant="outlined" 
                          disabled={user.id == curator.id}
                          onClick={(e) => {
                            handleResetPassword(e.target.parentElement.attributes.itemid.value);
                          }}>
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
          {
            curatorsToDisplay.length == 0 && (
              <Box sx={{width: '100%'}}>
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                  <PersonSearchIcon sx={{fontSize: '150pt', opacity: 0.5}} />
                  <Typography variant="h4">No users found</Typography>
                  <Button variant="contained" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}>
                    <Typography variant="body1">Clear Filters</Typography>
                  </Button>
                </Stack>
              </Box>
            )
          }

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
