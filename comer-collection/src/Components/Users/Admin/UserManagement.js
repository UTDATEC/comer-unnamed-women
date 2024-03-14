import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Switch, Box, IconButton, Paper
} from "@mui/material";
import { FilterAltOffOutlinedIcon, ContentCopyIcon, LockAddIcon, GroupAddIcon, LockResetIcon, OpenInNewIcon, RefreshIcon, EditIcon, DeleteIcon, SchoolIcon, ClearIcon, CheckIcon, PersonAddIcon, PersonIcon, SecurityIcon, PhotoCameraBackIcon, SearchIcon, InfoIcon, LockIcon } from "../../IconImports";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { doesItemMatchSearchQuery, searchItems } from "../Tools/SearchUtilities";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import { Navigate, useNavigate } from "react-router";
import { UserChangePrivilegesDialog } from "../Tools/Dialogs/UserChangePrivilegesDialog";
import { SelectionSummary } from "../Tools/SelectionSummary";
import { createUserDialogReducer } from "../Tools/HelperMethods/reducers";
import { filterItemFields, userFieldDefinitions } from "../Tools/HelperMethods/fields";
import { createUsers, sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls";
import { CourseFilterMenu } from "../Tools/CourseFilterMenu";
import { ItemMultiDeleteDialog } from "../Tools/Dialogs/ItemMultiDeleteDialog";
import { useSnackbar } from "../../App/AppSnackbar";
import { useAppUser } from "../../App/AppUser";
import { useTitle } from "../../App/AppTitle";
import { UserResetPasswordDialog } from "../Tools/Dialogs/UserResetPasswordDialog";


const UserManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [privilegesDialogIsOpen, setPrivilegesDialogIsOpen] = useState(false);
  const [privilegesDialogUser, setPrivilegesDialogUser] = useState(null);

  const [resetPasswordDialogIsOpen, setResetPasswordDialogIsOpen] = useState(false);
  const [resetPasswordDialogUser, setResetPasswordDialogUser] = useState(null);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogUser, setDeleteDialogUser] = useState(null);

  const [multiDeleteDialogIsOpen, setMultiDeleteDialogIsOpen] = useState(false);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogUser, setEditDialogUser] = useState(null);

  const [assignCourseDialogIsOpen, setAssignCourseDialogIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignCourseDialogUsers, setAssignCourseDialogUsers] = useState([]);

  const [coursesByUser, setCoursesByUser] = useState({});

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setSearchQuery("");
    setUserCourseIdFilter(null);
  }



  const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);


  const { setSelectedNavItem } = props;
  const [appUser, setAppUser, initializeAppUser] = useAppUser();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const setTitleText = useTitle();

  useEffect(() => {
    setSelectedNavItem("User Management");
    setTitleText("User Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []);


  const fetchData = async () => {
    try {
      const userData = await sendAuthenticatedRequest("GET", "/api/users")
      setUsers(userData.data);

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
    }
  };



  const userFilterFunction = useCallback((user) => {
    return (
      !userCourseIdFilter || userCourseIdFilter && user.Courses.map((c) => c.id).includes(userCourseIdFilter.id)
    ) && (
      doesItemMatchSearchQuery(searchQuery, user, ['full_name', 'full_name_reverse', 'email_without_domain'])
    );
  }, [userCourseIdFilter, searchQuery])


  const handleUsersCreate = async(newUserArray) => {
    return await createUsers(newUserArray, {showSnackbar, setDialogIsOpen, fetchData})
  }


  const handleUserEdit = async(userId, updateFields) => {
    const filteredUser = filterItemFields(userFieldDefinitions, updateFields);
    try {
      await sendAuthenticatedRequest("PUT", `/api/users/${userId}`, filteredUser);
      fetchData();

      setEditDialogIsOpen(false);

      if(userId == appUser.id)
        initializeAppUser();

      showSnackbar(`Successfully edited user`, "success");

    } catch (error) {
      showSnackbar(`Error editing user`, "error")
      throw "TestError"
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

      showSnackbar(`User ${willBeActive ? "activated" : "deactivated"}`, "success")

    } catch (error) {
      showSnackbar(`Error ${willBeActive ? "activating" : "deactivating"} user`, "error")
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

      showSnackbar(`Error changing privileges for user ${userId}`, "error")
    }
  }

  const handleUserPromote = async(userId, verifyPassword) => {
    await handleChangeUserPrivileges(userId, verifyPassword, true);
  }

  const handleUserDemote = async(userId, verifyPassword) => {
    await handleChangeUserPrivileges(userId, verifyPassword, false);
  }



  const handleResetPassword = async(userId, newPassword) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/users/${userId}/resetpassword`, {newPassword})
      fetchData();

      showSnackbar(`Password reset for user ${userId}`, "success");

    } catch (error) {

      showSnackbar(`Error resetting password for user ${userId}`, "error");

      throw "Reset Password error"
    }
  }


  const handleDelete = async (userId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/users/${userId}`)
      fetchData();

      showSnackbar(`User ${userId} has been deleted`, "success")

    } catch (error) {

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
      if(fieldName == "email") {
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body1">{user.id}</Typography>
          {user.id == appUser.id && (
            <PersonIcon color="secondary" />
          )}
        </Stack>
      ),
      generateSortableValue: (user) => user.id
    },
    {
      columnDescription: "Name",
      maxWidth: "150px",
      generateTableCell: (user) => (
        user.has_name ? (
          <Typography variant="body1">{user.full_name_reverse}</Typography>
        ) : (
          <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
        )
      ),
      generateSortableValue: (user) => user.full_name_reverse.toLowerCase()
    },
    {
      columnDescription: "Email",
      generateTableCell: (user) => (
        <Button color="grey"
          variant="text" sx={{textTransform: "unset"}}
          onClick={() => {handleCopyToClipboard(user, "email")}}>
          <Typography variant="body1">{user.email}</Typography>
        </Button>
      ),
      generateSortableValue: (user) => user.email
    },
    {
      columnDescription: "Password",
      generateTableCell: (user) => (
        <>
          {appUser.id == user.id ? (
            <Button startIcon={<OpenInNewIcon />} color={user.is_admin ? "secondary" : "primary"}
            variant="outlined"
            onClick={() => {
              navigate('/Account/ChangePassword');
            }}>
            <Typography variant="body1">Change</Typography>
          </Button>
          ) : (
            <Button
              startIcon={user.has_password ? <LockResetIcon /> : <LockIcon/>}
              color={user.is_admin ? "secondary" : "primary"}
              itemID={user.id}
              variant={user.has_password ? "outlined" : "contained"}
              // disabled={true}
              onClick={(e) => {
                setResetPasswordDialogUser(user)
                setResetPasswordDialogIsOpen(true);
              }}>
              <Typography variant="body1">
                {user.has_password ? "Reset" : "Set"}
              </Typography>
            </Button>
          )}
        </>
      )
    },
    {
      columnDescription: "Courses",
      generateTableCell: (user) => (
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
      )
    },
    {
      columnDescription: "Exhibitions",
      generateTableCell: (user) => (
        <Stack direction="row" spacing={1}>
          <Button variant="text" sx={{textTransform: "unset"}}
            color={user.is_admin ? "secondary" : "primary"}
            disabled startIcon={<PhotoCameraBackIcon />}
            onClick={() => {
              // setAssignCourseDialogUser(user);
              // setAssignCourseDialogCourses([...user.Courses]);
              // setAssignCourseDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">{user.Exhibitions.length} of {user.exhibition_quota}</Typography>
          </Button>
        </Stack>
      )
    },
    {
      columnDescription: "User Type",
      generateTableCell: (user) => (
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
      )
    },
    {
      columnDescription: "Active",
      generateTableCell: (user) => (
        <Switch
          itemID={user.id}
          checked={user.is_active && user.has_password}
          disabled={user.id == appUser.id || !user.has_password}
          color={user.is_admin ? "secondary" : "primary"}
          onClick={(e) => {
            handleChangeUserActivationStatus(e.target.parentElement.attributes.itemid.value, e.target.checked)
          }}
        />
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (user) => (
        <>
          <IconButton
            onClick={() => {
              setEditDialogUser(user);
              setEditDialogIsOpen(true);
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
        </>
      )
    }
  ]

  const courseTableFieldsForDialog = [
    {
      columnDescription: "ID",
      generateTableCell: (course) => (
        <Typography variant="body1">{course.id}</Typography>
      ),
      generateSortableValue: (course) => course.id
    },
    {
      columnDescription: "Name",
      maxWidth: "200px",
      generateTableCell: (course) => (
        <Typography variant="body1">{course.name}</Typography>
      ),
      generateSortableValue: (course) => course.name
    },
    {
      columnDescription: "Dates",
      generateTableCell: (course) => (
        <Stack>
          <Typography variant="body1">{new Date (course.date_start).toLocaleDateString()}</Typography>
          <Typography variant="body1">{new Date (course.date_end).toLocaleDateString()}</Typography>
        </Stack>
      )
    }
  ]

  const courseTableFieldsForDialogAll = [...courseTableFieldsForDialog, {
    columnDescription: "Enroll",
    generateTableCell: (course) => {
      const quantity = course.quantity_assigned;
      return (
        quantity == assignCourseDialogUsers.length && (
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
              handleAssignUsersToCourse(course.id, assignCourseDialogUsers.map((u) => u.id));
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
              handleAssignUsersToCourse(course.id, assignCourseDialogUsers.map((u) => u.id));
            }}>
              {assignCourseDialogUsers.length - quantity == 1 ? (
                <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more user</Typography>
              ) : (
                <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more users</Typography>
              )}
            </Button>
          )
        )
      }
    }]

  const courseTableFieldsForDialogAssigned = [...courseTableFieldsForDialog, {
    columnDescription: "",
    generateTableCell: (course) => {
      const quantity = course.quantity_assigned;
      return (
        <Button variant="outlined" color="primary" startIcon={<ClearIcon />} onClick={() => {
          handleUnassignUsersFromCourse(course.id, assignCourseDialogUsers.map((u) => u.id));
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
      )
    }
  }]


  const visibleUsers = useMemo(() => users.filter((user) => {
    return userFilterFunction(user);
  }), [users, searchQuery, userCourseIdFilter]);



  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.pw_change_required && (
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
                !Boolean(searchQuery || userCourseIdFilter)
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
        <DataTable items={users} tableFields={userTableFields}
          rowSelectionEnabled={true}
          selectedItems={selectedUsers} setSelectedItems={setSelectedUsers}
          visibleItems={visibleUsers}
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
        handleItemsCreate={handleUsersCreate}
        {...{ createDialogFieldDefinitions: userFieldDefinitions, dialogIsOpen, setDialogIsOpen }} />

      <ItemSingleEditDialog
        entity="user"
        dialogTitle={"Edit User"}
        dialogInstructions={"Edit the user fields, then click 'Save'."}
        editDialogItem={editDialogUser}
        handleItemEdit={handleUserEdit}
        {...{ editDialogFieldDefinitions: userFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

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

      <UserResetPasswordDialog 
        dialogIsOpen={resetPasswordDialogIsOpen}
        dialogUser={resetPasswordDialogUser}
        setDialogIsOpen={setResetPasswordDialogIsOpen}
        handleResetPassword={handleResetPassword}
      />

    </Box>
  );
}


export default UserManagement;
