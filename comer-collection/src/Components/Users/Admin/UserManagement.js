import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Switch, useTheme, Box, IconButton, Paper, MenuItem, Chip} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import { ColumnFilterButton } from "../Tools/ColumnFilterButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import { filterItemFields, userFieldDefinitions } from "../Tools/HelperMethods/fields";
import { createUsers, sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls";
import { CourseFilterMenu } from "../Tools/CourseFilterMenu";
import { ItemMultiDeleteDialog } from "../Tools/Dialogs/ItemMultiDeleteDialog";
import SearchIcon from "@mui/icons-material/Search"
import InfoIcon from "@mui/icons-material/Info"
import { useSnackbar } from "../../App/AppSnackbar";
import { useAppUser } from "../../App/AppUser";


const UserManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [privilegesDialogIsOpen, setPrivilegesDialogIsOpen] = useState(false);
  const [privilegesDialogUser, setPrivilegesDialogUser] = useState(null);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogUser, setDeleteDialogUser] = useState(null);

  const [multiDeleteDialogIsOpen, setMultiDeleteDialogIsOpen] = useState(false);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogUser, setEditDialogUser] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState({email: '', given_name: '', family_name: ''});
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const [assignCourseDialogIsOpen, setAssignCourseDialogIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignCourseDialogUsers, setAssignCourseDialogUsers] = useState([]);

  const [coursesByUser, setCoursesByUser] = useState({});

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [createDialogUsers, createDialogDispatch] = useReducer(createUserDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [userTypeMenuAnchorElement, setUserTypeMenuAnchorElement] = useState(null);
  const clearFilters = () => {
    setSearchQuery("");
    setUserTypeFilter(null);
    setUserActivationStatusFilter(null);
    setUserPasswordTypeFilter(null);
    setUserCourseIdFilter(null);
  }

  const [userActivationStatusFilter, setUserActivationStatusFilter] = useState(null);
  const [userActivationStatusMenuAnchorElement, setUserActivationStatusMenuAnchorElement] = useState(null);

  const [userPasswordTypeFilter, setUserPasswordTypeFilter] = useState(null);
  const [userPasswordTypeMenuAnchorElement, setUserPasswordTypeMenuAnchorElement] = useState(null);

  const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);

  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { setSelectedNavItem } = props;
  const [appUser, setAppUser] = useAppUser();
  const showSnackbar = useSnackbar();
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
      const userData = await sendAuthenticatedRequest("GET", "/api/users")
      setUsers(userData.data);

      setSelectedUsers(selectedUsers.filter((su) => (
        userData.data.map((u) => u.id).includes(parseInt(su.id))
      )));


      const courseData = await sendAuthenticatedRequest("GET", "/api/courses");
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

  const filterUsers = (userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter, userCourseIdFilter) => {
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
      ) && (
        // filter by course
        !userCourseIdFilter || userCourseIdFilter && user.Courses.map((c) => c.id).includes(userCourseIdFilter.id)
      )
    })
  }


  const filteredUsers = useMemo(() => filterUsers(
    userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter, userCourseIdFilter
  ), [
    users, userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter, userCourseIdFilter
  ])


  const visibleUsers = useMemo(() => searchItems(searchQuery, filteredUsers, ['family_name', 'given_name', 'email']), [filteredUsers, searchQuery])

  // const visibleUsers = filteredAndSearchedUsers.sort((a, b) => {
  //   if(sortColumn == "Name")
  //     return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
  //   else if(sortColumn == "ID")
  //     return !sortAscending ^ (a.id > b.id);
  //   else if(sortColumn == "Email")
  //     return !sortAscending ^ (a.email > b.email)
  // })



  const handleUsersCreate = async(newUserArray) => {
    createUsers(newUserArray, {showSnackbar, setDialogIsOpen, createDialogDispatch, fetchData})
  }


  const handleUserEdit = async(userId, updateFields) => {
    const filteredUser = filterItemFields(userFieldDefinitions, updateFields);
    try {
      await sendAuthenticatedRequest("PUT", `/api/users/${userId}`, filteredUser);
      fetchData();

      setEditDialogIsOpen(false);
      setEditDialogFields({email: '', given_name: '', family_name: ''})

      showSnackbar(`Successfully edited user ${userId}`, "success");

    } catch (error) {
      console.error(`Error editing user ${userId}: ${error}`);

      showSnackbar(`Error editing for user ${userId}`, "error")
    }
  }





  const handleAssignUsersToCourse = async(courseId, userIds) => {
    let usersEnrolled = 0;
    let userIndicesWithErrors = []
    for(const [i, userId] of userIds.entries()) {
      try {
        await sendAuthenticatedRequest("PUT", `/api/courses/${courseId}/users/${userId}`);

        usersEnrolled++;

      } catch (error) {
        console.error(`Error enrolling user ${userId} in course ${courseId}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersEnrolled == userIds.length) {
      setDialogIsOpen(false);

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
        await sendAuthenticatedRequest("DELETE", `/api/courses/${courseId}/users/${userId}`)

        usersUnenrolled++;

      } catch (error) {
        console.error(`Error unenrolling user ${userId} from course ${courseId}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersUnenrolled == userIds.length) {
      setDialogIsOpen(false);

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







  const handleChangeUserActivationStatus = async(userId, willBeActive) => {
    try {
      await sendAuthenticatedRequest("PUT", (willBeActive ?
        `/api/users/${userId}/activate` :
        `/api/users/${userId}/deactivate`
        ));
      fetchData();

      showSnackbar(`User ${userId} is now ${willBeActive ? "activated" : "deactivated"}`, "success")

    } catch (error) {
      console.error(`Error deactivating user ${userId}: ${error}`);

      showSnackbar(`Error deactivating user ${userId}`, "error")
    }
  }


  const handleChangeUserPrivileges = async(userId, verifyPassword, isPromotion) => {
    try {
      await sendAuthenticatedRequest("PUT", (isPromotion ?
        `/api/users/${userId}/promote` :
        `/api/users/${userId}/demote`
        ), {verifyPassword})
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
      await sendAuthenticatedRequest("PUT", `/api/users/${userId}/resetpassword`)
      fetchData();

      showSnackbar(`Password reset for user ${userId}`, "success");

    } catch (error) {
      console.error(`Error resetting password for user ${userId}: ${error}`);

      showSnackbar(`Error resetting password for user ${userId}`, "error");
    }
  }


  const handleDelete = async (userId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/users/${userId}`)
      fetchData();

      showSnackbar(`User ${userId} has been deleted`, "success")

    } catch (error) {
      console.error("Error handling delete operation:", error);

      showSnackbar(`User ${userId} could not be deleted`, "error")
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogUser(null);
  };


  const handleDeleteMultiple = async(userIds) => {
    
    let usersDeleted = 0;
    for(const [i, userId] of userIds.entries()) {
      try {
        await sendAuthenticatedRequest("DELETE", `/api/users/${userId}`);
        usersDeleted++;
      } catch (error) {
        console.error(`Error deleting user ${userId}: ${error}`);
      }
    }
    fetchData();

    if(usersDeleted == userIds.length) {
      setDialogIsOpen(false);

      showSnackbar(`Successfully deleted ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "success")

      setMultiDeleteDialogIsOpen(false);

    } else if(usersDeleted < userIds.length) {

      if(usersDeleted > 0) {
        showSnackbar(`Deleted ${usersDeleted} of ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "warning")
      }
      else {
        showSnackbar(`Failed to delete ${userIds.length} ${userIds.length == 1 ? "user" : "users"}`, "error")
      }

    }

  }


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
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{user.id}</Typography>
            {user.id == appUser.id && (
              <PersonIcon color="secondary" />
            )}
          </Stack>
        </TableCell>
      ),
      generateSortableValue: (user) => user.id
    },
    {
      columnDescription: "Name",
      generateTableCell: (user) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "150px"}}>
          {
            user.has_name ? (
              <Typography variant="body1">{user.full_name_reverse}</Typography>
            ) : (
              <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
            )
          }
        </TableCell>
      ),
      generateSortableValue: (user) => user.full_name_reverse.toLowerCase()
    },
    {
      columnDescription: "Email",
      generateTableCell: (user) => (
        <TableCell>
          <Button color="grey"
            variant="text" sx={{textTransform: "unset"}}
            onClick={() => {handleCopyToClipboard(user, "email")}}>
            <Typography variant="body1">{user.email}</Typography>
          </Button>
        </TableCell>
      ),
      generateSortableValue: (user) => user.email
    },
    {
      columnDescription: "Password",
      generateTableCell: (user) => (
        <TableCell>
          {appUser.id == user.id ? (
            <Button startIcon={<OpenInNewIcon />} color={user.is_admin ? "secondary" : "primary"}
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
                handleResetPassword(user.id);
              }}>
              <Typography variant="body1">Reset</Typography>
            </Button>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Courses",
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
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{course.id}</Typography>
        </TableCell>
      ),
      generateSortableValue: (course) => course.id
    },
    {
      columnDescription: "Name",
      generateTableCell: (course) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "200px"}}>
          <Typography variant="body1">{course.name}</Typography>
        </TableCell>
      ),
      generateSortableValue: (course) => course.name
    },
    {
      columnDescription: "Dates",
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
    generateTableCell: (course, extraProperties) => {
      const quantity = course.quantity_assigned;
      // const quantity = extraProperties.getQuantityAssigned(course);
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
    generateTableCell: (course, extraProperties) => {
      // const quantity = extraProperties.getQuantityAssigned(course)
      const quantity = course.quantity_assigned;

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
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by user name or email" width="30%" />
          <CourseFilterMenu filterValue={userCourseIdFilter} setFilterValue={setUserCourseIdFilter} {...{courses}} />
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
                !Boolean(searchQuery || userTypeFilter || userActivationStatusFilter || userPasswordTypeFilter || userCourseIdFilter)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button>
            <Button color="primary" variant="contained" startIcon={<GroupAddIcon/>}
              onClick={() => {
                setDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Users</Typography>
            </Button>
          </Stack>
        </Stack>
        <DataTable items={users} visibleItems={visibleUsers} tableFields={userTableFields}
          rowSelectionEnabled={true}
          selectedItems={selectedUsers} setSelectedItems={setSelectedUsers}
          {...{sortColumn, setSortColumn, sortAscending, setSortAscending}}
          sx={{gridArea: "table"}}
          emptyMinHeight="300px"
          {...visibleUsers.length == users.length && {
            noContentMessage: "No users yet",
            noContentButtonAction: () => {setDialogIsOpen(true)},
            noContentButtonText: "Create a user",
            NoContentIcon: InfoIcon
          } || visibleUsers.length < users.length && {
            noContentMessage: "No results",
            noContentButtonAction: clearFilters,
            noContentButtonText: "Clear Filters",
            NoContentIcon: SearchIcon
          }}
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
            {(() => {
              const selectedDeletableUsers = selectedUsers.filter((u) => u.is_deletable);
              return (
                <Button variant="outlined"
                  sx={{
                    display: selectedDeletableUsers.length == 0 ? "none" : ""
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if(selectedDeletableUsers.length == 1) {
                      setDeleteDialogUser(selectedDeletableUsers[0]);
                      setDeleteDialogIsOpen(true);
                    } else {
                      setMultiDeleteDialogIsOpen(true);
                    }
                  }}>
                  <Typography variant="body1">Delete {selectedDeletableUsers.length} {selectedDeletableUsers.length == 1 ? "user" : "users"}</Typography>
                </Button>
              )
            })()}
            <Button variant="outlined"
              sx={{
                display: selectedUsers.length == 0 ? "none" : ""
              }}
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
        {...{ createDialogFieldDefinitions: userFieldDefinitions, dialogIsOpen, setDialogIsOpen, createDialogDispatch }} />

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

      <ItemMultiDeleteDialog
        entitySingular="user"
        entityPlural="users"
        deleteDialogItems={selectedUsers.filter((u) => u.is_deletable)}
        deleteDialogIsOpen={multiDeleteDialogIsOpen}
        setDeleteDialogIsOpen={setMultiDeleteDialogIsOpen}
        handleDelete={handleDeleteMultiple}
      />

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
