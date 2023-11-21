import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import {
  Stack,
  Button,
  Typography,
  Switch, useTheme, Box, IconButton
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import { ColumnFilterButton } from "../Tools/ColumnFilterButton";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LockResetIcon from "@mui/icons-material/LockReset";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { UserEditDialog } from "../Tools/Dialogs/UserEditDialog";
import { DataTable } from "../Tools/DataTable";


const createUserDialogReducer = (createDialogUsers, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogUsers, {
        family_name: "",
        given_name: "",
        email: ""
      }]

    case 'change':
      return createDialogUsers.map((r, i) => {
        if(action.index == i)
          return {...r, [action.field]: action.newValue};
        else
          return r;
      })
      
    case 'remove':
      return createDialogUsers.filter((r, i) => {
        return action.index != i;
      })

    case 'set':
      return action.newArray;
  
    default:
      throw Error("Unknown action type");
  }
}

const UserManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogUser, setDeleteDialogUser] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogUser, setEditDialogUser] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState({email: '', given_name: '', family_name: ''});
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const editDialogFieldNames = [
    {
      fieldName: "given_name",
      displayName: "First Name"
    },
    {
      fieldName: "family_name",
      displayName: "Last Name"
    },
    {
      fieldName: "email",
      displayName: "Email"
    }
  ]
  const createDialogFieldNames = editDialogFieldNames;

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogUsers, createDialogDispatch] = useReducer(createUserDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

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


  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem, 
    snackbarOpen, snackbarText, snackbarSeverity,
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;
  const theme = useTheme();
  

  useEffect(() => {
    setSelectedNavItem("User Management");
    if(appUser.is_admin) {
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
      const userData = response.data;

      setUsers(userData.data);
      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /*
    User display:
    Step 1: apply column filters
    Step 2: apply search query
    Step 3: apply sorting order
  */

  const filterUsers = (userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter) => {
    return users.filter((user) => {
      return (
        // filter by user type
        !userTypeFilter || userTypeFilter == "Administrator" && user.is_admin || userTypeFilter == "Curator" && !user.is_admin
      ) && (
        // filter by user activation status
        !userActivationStatusFilter || userActivationStatusFilter == "Active" && user.is_active || userActivationStatusFilter == "Inactive" && !user.is_active
      ) && (
        // filter by password type
        !userPasswordTypeFilter || userPasswordTypeFilter == "Temporary" && user.pw_temp || userPasswordTypeFilter == "Permanent" && !user.pw_temp
      )
    })
  }


  const filteredUsers = useMemo(() => filterUsers(
    userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
  ), [
    users, userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
  ])


  const searchUsers = (searchQuery) => {
    return filteredUsers.filter((user) => {
      return searchQuery == "" ||
        Boolean((user.family_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
        Boolean((user.given_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
        Boolean(`${(user.given_name ?? "").toLowerCase()} ${(user.family_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
        Boolean(`${(user.family_name ?? "").toLowerCase()}, ${(user.given_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
        Boolean(user.email?.replace("@utdallas.edu", "").toLowerCase().includes(searchQuery.toLowerCase()))
    })
  }

  const filteredAndSearchedUsers = useMemo(() => searchUsers(searchQuery), [filteredUsers, searchQuery])

  const usersToDisplay = filteredAndSearchedUsers.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  

  const handleDeleteClick = (userId) => {
    setDeleteDialogUser({ userId });
    setDeleteDialogIsOpen(true);
  };


  const handleUsersCreate = async(newUserArray) => {
    let usersCreated = 0;
    let userIndicesWithErrors = []
    for(const [i, newUserData] of newUserArray.entries()) {
      try {
        let { email, given_name, family_name } = newUserData;
        await axios.post(
          `http://localhost:9000/api/users`, { email, given_name, family_name },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        usersCreated++;
  
      } catch (error) {
        console.error(`Error creating user ${JSON.stringify(newUserData)}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersCreated == newUserArray.length) {
      setCreateDialogIsOpen(false);
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      setSnackbarText(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } else if(usersCreated < newUserArray.length) {

      if(usersCreated > 0) {
        setSnackbarText(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
        setSnackbarSeverity("warning");
      }
      else {
        setSnackbarText(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);

      createDialogDispatch({
        type: "set",
        newArray: newUserArray.filter((u, i) => {
          return userIndicesWithErrors.includes(i);
        })
      })
    }


  }


  const handleUserEdit = async(userId, updateFields) => {
    const { email, given_name, family_name } = updateFields;
    try {
      await axios.put(
        `http://localhost:9000/api/users/${userId}`, { email, given_name, family_name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setEditDialogIsOpen(false);
      setEditDialogFields({email: '', given_name: '', family_name: ''})

      setSnackbarText(`Successfully edited user ${userId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error editing user ${userId}: ${error}`);

      setSnackbarText(`Error editing for user ${userId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

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


  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarSeverity("success")
      setSnackbarText(`User ${userId} has been deleted`);
      setSnackbarOpen(true);

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);

      setSnackbarSeverity("error")
      setSnackbarText(`User ${userId} could not be deleted`);
      setSnackbarOpen(true);
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogUser(null);
  };


  const handleCopyToClipboard = useCallback((user) => {
    try {
      navigator.clipboard.writeText(user.pw_temp);
      setSnackbarSeverity("success")
      setSnackbarText(`Password for user ${user.id} copied to clipboard`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error")
      setSnackbarText(`Error copying password`);
      setSnackbarOpen(true);
    }
  }, [])


  const userTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
            <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          {
            user.family_name || user.given_name ? (
              <Typography variant="body1">{user.family_name ?? ""}, {user.given_name ?? ""}</Typography>
            ) : (
              <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
            )
          }
        </TableCell>
      )
    },
    {
      columnDescription: "Email",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
            <ColumnSortButton columnName="Email" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.email}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Password",
      generateTableHeaderCell: () => (
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
      ),
      generateTableCell: (user) => (
        <TableCell>
          {user.pw_temp ? (
            <Button startIcon={<ContentCopyIcon />}
              variant="outlined"
              onClick={() => {handleCopyToClipboard(user)}}>
              <Typography variant="body1">Copy</Typography>
            </Button>
          ) : (
            <Button 
              startIcon={<LockResetIcon />}
              itemID={user.id}
              variant="outlined" 
              disabled={appUser.id == user.id}
              onClick={(e) => {
                handleResetPassword(e.target.parentElement.attributes.itemid.value);
              }}>
              <Typography variant="body1">Reset</Typography>
            </Button>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Courses",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Courses</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.Courses.length}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Exhibitions",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Exhibitions</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.Exhibitions.length}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "User Type",
      generateTableHeaderCell: () => (
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
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.is_admin ? "Administrator" : "Curator"}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Active",
      generateTableHeaderCell: () => (
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
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Switch 
            itemID={user.id}
            checked={user.is_active} 
            disabled={user.is_admin} 
            onClick={(e) => {
              handleChangeUserActivationStatus(e.target.parentElement.attributes.itemid.value, e.target.checked)
            }}
          />
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Options</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <IconButton 
            disabled={user.is_admin} 
            onClick={(e) => {
              setEditDialogUser(user);
              const { email, family_name, given_name } = user;
              setEditDialogFields({ email, family_name, given_name });
              setEditDialogSubmitEnabled(true);
              setEditDialogIsOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            disabled={user.is_admin || user.Courses.length > 0 || user.Exhibitions.length > 0} 
            onClick={(e) => {
              setDeleteDialogUser(user);
              setDeleteDialogIsOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )
    }
  ]



  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.is_admin && (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={2} padding={2}>
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by name or email" width="50%" />
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
              setRefreshInProgress(true);
              fetchData();
            }}
              disabled={refreshInProgress}>
              <Typography variant="body1">Refresh</Typography>
            </Button>
            <Button color="primary" variant="outlined" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
              disabled={
                !Boolean(searchQuery || userTypeFilter || userActivationStatusFilter || userPasswordTypeFilter)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button>
            <Button color="primary" variant="contained" startIcon={<GroupAddIcon/>}
              onClick={() => {
                setCreateDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Users</Typography>
            </Button>
          </Stack>
        </Stack>
        <DataTable items={usersToDisplay} tableFields={userTableFields} />
          {
            usersToDisplay.length == 0 && (
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

      <ItemMultiCreateDialog entity="user" 
        dialogTitle={"Create Users"}
        dialogInstructions={"Add users, edit the user fields, then click 'Create'.  The system will generate temporary passwords for each user."}
        createDialogItems={createDialogUsers}
        handleItemsCreate={handleUsersCreate}
       {...{ createDialogFieldNames, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

      <UserEditDialog {...{ editDialogUser, editDialogFieldNames, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled, handleUserEdit }} />

      <ItemSingleDeleteDialog 
        entity="user"
        dialogTitle="Delete User"
        deleteDialogItem={deleteDialogUser}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />

    </>
  );
}


export default UserManagement;
