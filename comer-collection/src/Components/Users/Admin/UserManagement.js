import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import {
  Stack,
  Button,
  Typography,
  Switch, useTheme, Box, IconButton, Paper
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import { ColumnFilterButton } from "../Tools/ColumnFilterButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { searchItems } from "../Tools/SearchUtilities";
import SchoolIcon from '@mui/icons-material/School';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import { Navigate, useNavigate } from "react-router";
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import SecurityIcon from "@mui/icons-material/Security";
import { UserChangePrivilegesDialog } from "../Tools/Dialogs/UserChangePrivilegesDialog";
import { SelectionSummary } from "../Tools/SelectionSummary";
import { createUserDialogReducer } from "../Tools/HelperMethods/reducers";
import { userFieldDefinitions } from "../Tools/HelperMethods/fields";


const UserManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [privilegesDialogIsOpen, setPrivilegesDialogIsOpen] = useState(false);
  const [privilegesDialogUser, setPrivilegesDialogUser] = useState(null);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogUser, setDeleteDialogUser] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogUser, setEditDialogUser] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState({email: '', given_name: '', family_name: ''});
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const [assignCourseDialogIsOpen, setAssignCourseDialogIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignCourseDialogUsers, setAssignCourseDialogUsers] = useState([]);

  const [coursesByUser, setCoursesByUser] = useState({});

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


  const { appUser, setSelectedNavItem, showSnackbar } = props;
  const theme = useTheme();
  const navigate = useNavigate();

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

      const userData = await response.data;
      setUsers(userData.data);

      setSelectedUsers(selectedUsers.filter((su) => (
        userData.data.map((u) => u.id).includes(parseInt(su.id))
      )));


      const response2 = await axios.get("http://localhost:9000/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const courseData = await response2.data;
      setCourses(courseData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);


      const coursesByUserDraft = {}
      for(const c of userData.data) {
        coursesByUserDraft[c.id] = c.Courses;
      }
      setCoursesByUser({...coursesByUserDraft});

      
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


  const filteredAndSearchedUsers = useMemo(() => searchItems(searchQuery, filteredUsers, ['family_name', 'given_name', 'email']), [filteredUsers, searchQuery])

  const visibleUsers = filteredAndSearchedUsers.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  


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

      showSnackbar(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`, "success");

    } else if(usersCreated < newUserArray.length) {

      if(usersCreated > 0) {
        showSnackbar(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure the email addresses are unique, and try again.`, "warning");
      }
      else {
        showSnackbar(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  
          ${newUserArray.length == 1 ? 
            "Make sure the email address is not already in use, and try again." : 
            "Make sure the email address is not already in use, and try again."}`, "error")
      }

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

      showSnackbar(`Successfully edited user ${userId}`, "success");

    } catch (error) {
      console.error(`Error editing user ${userId}: ${error}`);

      showSnackbar(`Error editing for user ${userId}`, "error")
    }
  }




  const handleUnassignCoursesFromUser = async(userId, courseIds) => {
    let coursesAdded = 0;
    let courseIndicesWithErrors = []
    for(const [i, courseId] of courseIds.entries()) {
      try {
        await axios.delete(
          `http://localhost:9000/api/courses/${courseId}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        coursesAdded++;
  
      } catch (error) {
        console.error(`Error unenrolling user ${userId} from course ${courseId}: ${error}`);
        courseIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(coursesAdded == courseIds.length) {
      setCreateDialogIsOpen(false);
      showSnackbar(`Successfully removed user ${userId} from ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "success")
    } else if(coursesAdded < courseIds.length) {
      if(coursesAdded > 0) {
        showSnackbar(`Removed user ${userId} from ${coursesAdded} of ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "warning")
      }
      else {
        showSnackbar(`Failed to remove user ${userId} from ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "error")
      }

    }
  }

  const handleAssignUsersToCourse = async(courseId, userIds) => {
    let usersEnrolled = 0;
    let userIndicesWithErrors = []
    for(const [i, userId] of userIds.entries()) {
      try {
        await axios.put(
          `http://localhost:9000/api/courses/${courseId}/users/${userId}`, null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        usersEnrolled++;
  
      } catch (error) {
        console.error(`Error enrolling user ${userId} in course ${courseId}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersEnrolled == userIds.length) {
      setCreateDialogIsOpen(false);

      showSnackbar(`Successfully enrolled ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "success")

    } else if(usersEnrolled < userIds.length) {

      if(usersEnrolled > 0) {
        showSnackbar(`Enrolled ${usersEnrolled} of ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "warning")
      }
      else {
        showSnackbar(`Failed to enroll ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "error")
      }

    }


  }

  const handleUnassignUsersFromCourse = async(courseId, userIds) => {
    let usersUnenrolled = 0;
    let userIndicesWithErrors = []
    for(const [i, userId] of userIds.entries()) {
      try {
        await axios.delete(
          `http://localhost:9000/api/courses/${courseId}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        usersUnenrolled++;
  
      } catch (error) {
        console.error(`Error unenrolling user ${userId} from course ${courseId}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersUnenrolled == userIds.length) {
      setCreateDialogIsOpen(false);

      showSnackbar(`Successfully unenrolled ${userIds.length} ${userIds.length == 1 ? "user" : "users"} from course ${courseId}`, "success")

    } else if(usersUnenrolled < userIds.length) {

      if(usersUnenrolled > 0) {
        showSnackbar(`Unenrolled ${usersUnenrolled} of ${userIds.length} ${userIds.length == 1 ? "user" : "users"} from course ${courseId}`, "warning")
      }
      else {
        showSnackbar(`Failed to unenroll ${userIds.length} ${userIds.length == 1 ? "user" : "users"} from course ${courseId}`, "error")
      }

    }


  }


  const handleAssignCoursesToUser = async(userId, courseIds) => {
    let coursesAdded = 0;
    let courseIndicesWithErrors = []
    for(const [i, courseId] of courseIds.entries()) {
      try {
        await axios.put(
          `http://localhost:9000/api/courses/${courseId}/users/${userId}`, null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        coursesAdded++;
  
      } catch (error) {
        console.error(`Error enrolling user ${userId} in course ${courseId}: ${error}`);
        courseIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(coursesAdded == courseIds.length) {
      setCreateDialogIsOpen(false);

      showSnackbar(`Successfully added user ${userId} to ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "success")

    } else if(coursesAdded < courseIds.length) {

      if(coursesAdded > 0) {
        showSnackbar(`Added user ${userId} to ${coursesAdded} of ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "warning")
      }
      else {
        showSnackbar(`Failed to add user ${userId} to ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "error")
      }

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

      showSnackbar(`User ${userId} is now ${willBeActive ? "activated" : "deactivated"}`, "success")

    } catch (error) {
      console.error(`Error deactivating user ${userId}: ${error}`);

      showSnackbar(`Error deactivating user ${userId}`, "error")
    }
  }


  const handleChangeUserPrivileges = async(userId, verifyPassword, isPromotion) => {
    try {
      await axios.put(
        (isPromotion ? 
          `http://localhost:9000/api/users/${userId}/promote` : 
          `http://localhost:9000/api/users/${userId}/demote`
          ), {
            verifyPassword: verifyPassword
          },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();
      
      setPrivilegesDialogIsOpen(false);

      showSnackbar(`User ${userId} is ${isPromotion ? "now" : "no longer"} an administrator.`, "success")


    } catch (error) {
      console.error(`Error changing privileges for user ${userId}: ${error}`);

      showSnackbar(`Error changing privileges for user ${userId}`, "error")
    }
  }

  const handleUserPromote = async(userId, verifyPassword) => {
    await handleChangeUserPrivileges(userId, verifyPassword, true);
  }

  const handleUserDemote = async(userId, verifyPassword) => {
    await handleChangeUserPrivileges(userId, verifyPassword, false);
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

      showSnackbar(`Password reset for user ${userId}`, "success");

    } catch (error) {
      console.error(`Error resetting password for user ${userId}: ${error}`);

      showSnackbar(`Error resetting password for user ${userId}`, "error");
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

      showSnackbar(`User ${userId} has been deleted`, "success")

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);

      showSnackbar(`User ${userId} could not be deleted`, "error")
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogUser(null);
  };


  const handleCopyToClipboard = useCallback((user, fieldName) => {
    try {
      navigator.clipboard.writeText(user[fieldName]);
      if(fieldName == "pw_temp") {
        showSnackbar(`Password for user ${user.id} copied to clipboard`, "success");
      } else if(fieldName == "email") {
        showSnackbar(`Email address for user ${user.id} copied to clipboard`, "success");
      } else {
        showSnackbar(`Text copied to clipboard`, "success");
      }

    } catch (error) {
      showSnackbar(`Error copying text to clipboard`, "error");
    }
  }, [])


  const userTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{user.id}</Typography>
            {user.id == appUser.id && (
              <PersonIcon color="secondary" />
            )}
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          {
            user.has_name ? (
              <Typography variant="body1">{user.full_name_reverse}</Typography>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            <ColumnSortButton columnName="Email" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Button color="grey"
            variant="text" sx={{textTransform: "unset"}}
            onClick={() => {handleCopyToClipboard(user, "email")}}>
            <Typography variant="body1">{user.email}</Typography>
          </Button>
        </TableCell>
      )
    },
    {
      columnDescription: "Password",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: userPasswordTypeFilter ? theme.palette.primary["200"] : theme.palette.grey.translucent}}>
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
          {appUser.id == user.id ? (
            <Button startIcon={<LockIcon />} color={user.is_admin ? "secondary" : "primary"}
            variant="outlined"
            onClick={() => {
              navigate('/Account/ChangePassword');
            }}>
            <Typography variant="body1">Change</Typography>
          </Button>
          ) : user.pw_temp ? (
            <Button startIcon={<ContentCopyIcon />} color={user.is_admin ? "secondary" : "primary"}
              variant="outlined"
              onClick={() => {handleCopyToClipboard(user, "pw_temp")}}>
              <Typography variant="body1">Copy</Typography>
            </Button>
          ) : (
            <Button 
              startIcon={<LockResetIcon />}
              color={user.is_admin ? "secondary" : "primary"}
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Courses</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color={user.is_admin ? "secondary" : "primary"}
              startIcon={<SchoolIcon />}
              onClick={() => {
                setAssignCourseDialogUsers([user])
                setAssignCourseDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{user.Courses.length}</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Exhibitions",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Exhibitions</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color={user.is_admin ? "secondary" : "primary"}
              disabled startIcon={<PhotoCameraBackIcon />}
              onClick={() => {
                // setAssignCourseDialogUser(user);
                // setAssignCourseDialogCourses([...user.Courses]);
                // setAssignCourseDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{user.Exhibitions.length}</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "User Type",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: userTypeFilter ? theme.palette.primary["200"] : theme.palette.grey.translucent}}>
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
          <Button color="grey" sx={{textTransform: "unset"}}
            disabled={user.id == appUser.id}
            onClick={() => {
              setPrivilegesDialogUser(user);
              setPrivilegesDialogIsOpen(true);
            }}
          >
            <Stack direction="row" spacing={1}>
              <Typography variant="body1">{user.is_admin ? "Administrator" : "Curator"}</Typography>
              {user.is_admin && (<SecurityIcon color="secondary" />)}
            </Stack>
          </Button>
        </TableCell>
      )
    },
    {
      columnDescription: "Active",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: userActivationStatusFilter ? theme.palette.primary["200"] : theme.palette.grey.translucent}}>
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
            disabled={user.id == appUser.id} 
            color={user.is_admin ? "secondary" : "primary"}
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Options</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell sx={{minWidth: "100px"}}>
          <IconButton 
            disabled={user.id == appUser.id} 
            onClick={() => {
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
            disabled={!user.is_deletable} 
            onClick={() => {
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

  const courseTableFieldsForDialog = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          {/* <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} /> */}
          <Typography variant="h6">ID</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{course.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            {/* <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} /> */}
            <Typography variant="h6">Course Name</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{course.name}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Dates",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Dates</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Stack>
            <Typography variant="body1">{new Date (course.date_start).toLocaleDateString()}</Typography>
            <Typography variant="body1">{new Date (course.date_end).toLocaleDateString()}</Typography>
          </Stack>
        </TableCell>
      )
    }
  ]

  const courseTableFieldsForDialogAll = [...courseTableFieldsForDialog, {
    columnDescription: "Enroll",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (course, extraProperties) => {
      const quantity = extraProperties.getQuantityAssigned(course);
      return (
      <TableCell>
        {quantity == assignCourseDialogUsers.length && (
          <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
            {assignCourseDialogUsers.length == 1 ? (
              <Typography variant="body1">Enrolled</Typography>
            ) : (
              <Typography variant="body1">
                {quantity == 2 ? `Both users enrolled` : `All ${quantity} users enrolled`}
              </Typography>
            )}
          </Button>) || 
          quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignUsersToCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
            }}>
              {assignCourseDialogUsers.length == 1 ? (
                <Typography variant="body1">Enroll</Typography>
                ) : (
                <Typography variant="body1">Enroll {assignCourseDialogUsers.length} users</Typography>
              )}
            </Button>
          ) || 
          quantity > 0 && quantity < assignCourseDialogUsers.length && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignUsersToCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
            }}>
              {assignCourseDialogUsers.length - quantity == 1 ? (
                <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more user</Typography>
              ) : (
                <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more users</Typography>
              )}
            </Button>
          )
        }
      </TableCell>
    )}
  }]

  const courseTableFieldsForDialogAssigned = [...courseTableFieldsForDialog, {
    columnDescription: "",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (course, extraProperties) => {
      const quantity = Object.entries(extraProperties.secondariesByPrimary)
        .filter(([userId]) => (
          assignCourseDialogUsers.map((u) => u.id).includes(parseInt(userId))
        ))
        .filter(([, courses]) => (
          courses.map((c) => c.id).includes(course.id)
        )).length

      return (
        <TableCell>
          <Button variant="outlined" color="primary" startIcon={<ClearIcon />} onClick={() => {
            handleUnassignUsersFromCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
          }}>
          {quantity == 1 ? (
            assignCourseDialogUsers.length == 1 ? (
              <Typography variant="body1">Unenroll</Typography>
            ) : (
              <Typography variant="body1">Unenroll {quantity} user</Typography>
            )
          ) : (
            <Typography variant="body1">Unenroll {quantity} users</Typography>
          )}
          </Button>
        </TableCell>
      )
    }
  }]



  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) ||
  appUser.is_admin && (
    <Box component={Paper} square sx={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '80px calc(100vh - 224px) 80px',
      gridTemplateAreas: `
        "top"
        "table"
        "bottom"
      `
    }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{gridArea: "top"}}>
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by user name or email" width="50%" />
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
              setRefreshInProgress(true);
              fetchData();
            }}
              disabled={refreshInProgress}>
              <Typography variant="body1">Refresh</Typography>
            </Button>
            <Button color="primary" variant={
              visibleUsers.length > 0 ? "outlined" : "contained"
            } startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
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
        <DataTable items={users} visibleItems={visibleUsers} tableFields={userTableFields} 
          rowSelectionEnabled={true}
          selectedItems={selectedUsers} setSelectedItems={setSelectedUsers}
          sx={{gridArea: "table"}}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{gridArea: "bottom"}}>
          <SelectionSummary 
            items={users}
            selectedItems={selectedUsers}
            setSelectedItems={setSelectedUsers}
            visibleItems={visibleUsers}
            entitySingular="user"
            entityPlural="users"
          />
         <Stack direction="row" spacing={2} >
            <Button variant="outlined"
              disabled={selectedUsers.length == 0}
              startIcon={<SchoolIcon />}
              onClick={() => {
              setAssignCourseDialogUsers([...selectedUsers])
              setAssignCourseDialogIsOpen(true);
            }}>
              <Typography variant="body1">Manage Course Enrollments for {selectedUsers.length} {selectedUsers.length == 1 ? "user" : "users"}</Typography>
            </Button>
          </Stack>
        </Stack>

      <ItemMultiCreateDialog entity="user" 
        dialogTitle={"Create Users"}
        dialogInstructions={"Add users, edit the user fields, then click 'Create'.  The system will generate temporary passwords for each user."}
        createDialogItems={createDialogUsers}
        handleItemsCreate={handleUsersCreate}
        {...{ createDialogFieldDefinitions: userFieldDefinitions, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

      <ItemSingleEditDialog 
        entity="user"
        dialogTitle={"Edit User"}
        dialogInstructions={"Edit the user fields, then click 'Save'."}
        editDialogItem={editDialogUser}
        handleItemEdit={handleUserEdit}
        {...{ editDialogFieldDefinitions: userFieldDefinitions, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} />

      <ItemSingleDeleteDialog 
        entity="user"
        dialogTitle="Delete User"
        deleteDialogItem={deleteDialogUser}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />

      <AssociationManagementDialog
        primaryEntity="user"
        secondaryEntity="course"
        primaryItems={assignCourseDialogUsers}
        secondaryItemsAll={courses}
        secondariesByPrimary={coursesByUser}
        dialogTitle={
          assignCourseDialogUsers.length == 1 ?
            `Manage Course Enrollments for ${assignCourseDialogUsers[0].safe_display_name}` :
            `Manage Course Enrollments for ${assignCourseDialogUsers.length} Selected Users`
        }
        dialogButtonForSecondaryManagement={<>
          <Button variant="outlined" onClick={() => {
            navigate('/Account/CourseManagement')
          }}>
            <Typography>Go to course management</Typography>
          </Button>
        </>}
        dialogIsOpen={assignCourseDialogIsOpen}
        tableTitleAssigned={
          assignCourseDialogUsers.length == 1 ?
            `Current Courses for ${assignCourseDialogUsers[0].safe_display_name}` :
            `Current Courses with Selected Users`
        }
        tableTitleAll={`All Courses`}
        setDialogIsOpen={setAssignCourseDialogIsOpen}
        secondaryTableFieldsAll={courseTableFieldsForDialogAll}
        secondaryTableFieldsAssignedOnly={courseTableFieldsForDialogAssigned}
        // handleAssociationAssign={handleAssignCourseToUser}
        secondarySearchFields={['name']}
        secondarySearchBoxPlaceholder="Search courses by name"
      />

      <UserChangePrivilegesDialog
        dialogUser={privilegesDialogUser}
        dialogIsOpen={privilegesDialogIsOpen}
        setDialogIsOpen={setPrivilegesDialogIsOpen}
        handlePromote={handleUserPromote}
        handleDemote={handleUserDemote}
      />

    </Box>
  );
}


export default UserManagement;
