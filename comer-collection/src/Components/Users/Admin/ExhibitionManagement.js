import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Stack,
  Button,
  Typography, useTheme, Box, IconButton, Paper
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import LockIcon from "@mui/icons-material/Lock";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { DataTable } from "../Tools/DataTable";
import { Navigate, useNavigate } from "react-router";
import { SelectionSummary } from "../Tools/SelectionSummary";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls";
import SearchIcon from "@mui/icons-material/Search"
import InfoIcon from "@mui/icons-material/Info"
import VpnLockIcon from "@mui/icons-material/VpnLock";
import PublicIcon from "@mui/icons-material/Public"
import { ExhibitionSettingsDialog } from "../Tools/Dialogs/ExhibitionSettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"

const ExhibitionManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogExhibitionId, setEditDialogExhibitionId] = useState(null);
  const [editDialogExhibitionAccess, setEditDialogExhibitionAccess] = useState(null);
  const [editDialogExhibitionTitle, setEditDialogExhibitionTitle] = useState(null);

  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

//   const [dialogIsOpen, setDialogIsOpen] = useState(false);
//   const [createDialogExhibitions, createDialogDispatch] = useReducer(createUserDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

//   const [userTypeFilter, setUserTypeFilter] = useState(null);
//   const [userTypeMenuAnchorElement, setUserTypeMenuAnchorElement] = useState(null);
//   const clearFilters = () => {
//     setSearchQuery("");
//     setUserTypeFilter(null);
//     setUserActivationStatusFilter(null);
//     setUserPasswordTypeFilter(null);
//   }

//   const [userActivationStatusFilter, setUserActivationStatusFilter] = useState(null);
//   const [userActivationStatusMenuAnchorElement, setUserActivationStatusMenuAnchorElement] = useState(null);

//   const [userPasswordTypeFilter, setUserPasswordTypeFilter] = useState(null);
//   const [userPasswordTypeMenuAnchorElement, setUserPasswordTypeMenuAnchorElement] = useState(null);

  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { appUser, setSelectedNavItem, showSnackbar } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedNavItem("Exhibition Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []); 


  const fetchData = async () => {
    try {
      const exhibitionData = await sendAuthenticatedRequest("GET", "/api/exhibitions")
      setExhibitions(exhibitionData.data);

      setSelectedExhibitions(selectedExhibitions.filter((su) => (
        exhibitionData.data.map((u) => u.id).includes(parseInt(su.id))
      )));


      const userData = await sendAuthenticatedRequest("GET", "/api/users")
      setUsers(userData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);


    //   const usersByExhibitionDraft = {}
    //   for(const c of exhibitionData.data) {
    //     usersByExhibitionDraft[c.id] = c.Courses;
    //   }
    //   setCoursesByUser({...usersByExhibitionDraft});

      
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

  const filterExhibitions = () => {
    return exhibitions.filter((exhibition) => {
    //   return (
    //     // filter by user type
    //     !userTypeFilter || userTypeFilter == "Administrator" && user.is_admin || userTypeFilter == "Curator" && !user.is_admin
    //   ) && (
    //     // filter by user activation status
    //     !userActivationStatusFilter || userActivationStatusFilter == "Active" && user.is_active || userActivationStatusFilter == "Inactive" && !user.is_active
    //   ) && (
    //     // filter by password type
    //     !userPasswordTypeFilter || userPasswordTypeFilter == "Temporary" && user.pw_temp || userPasswordTypeFilter == "Permanent" && !user.pw_temp
    //   )
        return true;
    })
  }


//   const filteredExhibitions = useMemo(() => filterExhibitions(
//     // userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
//   ), [
//     // users, userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
//   ])


//   const filteredAndSearchedExhibitions = useMemo(() => searchItems(searchQuery, filteredExhibitions, ['family_name', 'given_name', 'email']), [filteredExhibitions, searchQuery])

  const filteredAndSearchedExhibitions = Array.from(exhibitions);

  const visibleExhibitions = filteredAndSearchedExhibitions.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  


//   const handleUsersCreate = async(newUserArray) => {
//     let usersCreated = 0;
//     let userIndicesWithErrors = []
//     for(const [i, newUserData] of newUserArray.entries()) {
//       try {
//         let { email, given_name, family_name } = newUserData;
//         await axios.post(
//           `http://localhost:9000/api/users`, { email, given_name, family_name },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );

//         usersCreated++;
  
//       } catch (error) {
//         console.error(`Error creating user ${JSON.stringify(newUserData)}: ${error}`);
//         userIndicesWithErrors.push(i);
//       }
//     }
//     fetchData();

//     if(usersCreated == newUserArray.length) {
//       setDialogIsOpen(false);
//       createDialogDispatch({
//         type: "set",
//         newArray: []
//       })

//       showSnackbar(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`, "success");

//     } else if(usersCreated < newUserArray.length) {

//       if(usersCreated > 0) {
//         showSnackbar(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  Make sure the email addresses are unique, and try again.`, "warning");
//       }
//       else {
//         showSnackbar(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}.  
//           ${newUserArray.length == 1 ? 
//             "Make sure the email address is not already in use, and try again." : 
//             "Make sure the email address is not already in use, and try again."}`, "error")
//       }

//       createDialogDispatch({
//         type: "set",
//         newArray: newUserArray.filter((u, i) => {
//           return userIndicesWithErrors.includes(i);
//         })
//       })
//     }


//   }


//   const handleExhibitionEdit = async(exhibitionId, updateFields) => {
//     const { email, given_name, family_name } = updateFields;
//     try {
//       await axios.put(
//         `http://localhost:9000/api/exhibitions/${exhibitionId}`, { email, given_name, family_name },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       fetchData();

//       setEditDialogIsOpen(false);
//       setEditDialogFields({email: '', given_name: '', family_name: ''})

//       showSnackbar(`Successfully edited exhibition ${exhibitionId}`, "success");

//     } catch (error) {
//       console.error(`Error editing exhibition ${exhibitionId}: ${error}`);

//       showSnackbar(`Error editing for exhibition ${exhibitionId}`, "error")
//     }
//   }

const handleExhibitionEditByAdmin = async(exhibitionId, title, privacy) => {
  try {
    await sendAuthenticatedRequest("PUT", `/api/exhibitions/${exhibitionId}`, {title, privacy});
    setEditDialogIsOpen(false);
    setEditDialogExhibitionId(null);
    setEditDialogExhibitionTitle("");
    setEditDialogExhibitionAccess(null);
    showSnackbar(`Exhibition ${title} updated`, "success");
  } catch(e) {
    console.log(`Error updating exhibition: ${e.message}`)
    showSnackbar(`Error updating exhibition`, "error");
  }
  fetchData();
}



const handleExhibitionDeleteByAdmin = async(exhibitionId) => {
  try {
    await sendAuthenticatedRequest("DELETE", `/api/exhibitions/${exhibitionId}`);
    setDeleteDialogIsOpen(false);
    setDeleteDialogExhibition(null);
    showSnackbar(`Exhibition deleted`, "success");
  } catch(e) {
    console.log(`Error deleting exhibition: ${e.message}`)
    showSnackbar(`Error deleting exhibition`, "error");
  }
  fetchData();
}


  const handleCopyToClipboard = useCallback((exhibition, fieldName) => {
    try {
      navigator.clipboard.writeText(exhibition[fieldName]);
      if(fieldName == "pw_temp") {
        showSnackbar(`Password for exhibition ${exhibition.id} copied to clipboard`, "success");
      } else if(fieldName == "email") {
        showSnackbar(`Email address for exhibition ${exhibition.id} copied to clipboard`, "success");
      } else {
        showSnackbar(`Text copied to clipboard`, "success");
      }

    } catch (error) {
      showSnackbar(`Error copying text to clipboard`, "error");
    }
  }, [])


  const exhibitionTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{exhibition.id}</Typography>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Title",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            <ColumnSortButton columnName="Title" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "150px"}}>
          {
            exhibition.title ? (
              <Typography variant="body1">{exhibition.title}</Typography>
            ) : (
              <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
            )
          }
        </TableCell>
      )
    },
    {
      columnDescription: "Owner",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            <ColumnSortButton columnName="Owner" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (exhibition) => (
        <TableCell>
          <Stack direction="column" padding={1}>
            <Typography variant="body1">{exhibition.User.full_name_reverse}</Typography>
            <Typography variant="body1" sx={{opacity: 0.5}}>{exhibition.User.email}</Typography>
          </Stack>
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
                <VpnLockIcon />
              ) || exhibition.privacy == "PUBLIC" && (
                <PublicIcon />
              )}
              <Typography variant="body1">{exhibition.privacy == "PRIVATE" && (
                "Private"
              ) || exhibition.privacy == "PUBLIC_ANONYMOUS" && (
                "Public Anonymous"
              ) || exhibition.privacy == "PUBLIC" && (
                "Public"
              )}</Typography>
          </Stack>
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
      generateTableCell: (exhibition) => (
        <TableCell sx={{minWidth: "100px"}}>
          <Stack direction="row" spacing={1}>

        <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={`/Exhibitions/${exhibition.id}`} target="_blank">
          <Typography variant="body1">Open</Typography>
        </Button>
          <IconButton 
            onClick={() => {
              setEditDialogExhibitionId(exhibition.id);
              setEditDialogExhibitionAccess(exhibition.privacy);
              setEditDialogExhibitionTitle(exhibition.title);
              setEditDialogIsOpen(true)
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton 
            onClick={() => {
              setDeleteDialogExhibition(exhibition);
              setDeleteDialogIsOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
          </Stack>
        </TableCell>
      )
    }
  ]

//   const courseTableFieldsForDialog = [
//     {
//       columnDescription: "ID",
//       generateTableHeaderCell: () => (
//         <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
//           {/* <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} /> */}
//           <Typography variant="h6">ID</Typography>
//         </TableCell>
//       ),
//       generateTableCell: (course) => (
//         <TableCell>
//           <Typography variant="body1">{course.id}</Typography>
//         </TableCell>
//       )
//     },
//     {
//       columnDescription: "Name",
//       generateTableHeaderCell: () => (
//         <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
//             {/* <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} /> */}
//             <Typography variant="h6">Name</Typography>
//         </TableCell>
//       ),
//       generateTableCell: (course) => (
//         <TableCell>
//           <Typography variant="body1">{course.name}</Typography>
//         </TableCell>
//       )
//     },
//     {
//       columnDescription: "Dates",
//       generateTableHeaderCell: () => (
//         <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
//           <Typography variant="h6">Dates</Typography>
//         </TableCell>
//       ),
//       generateTableCell: (course) => (
//         <TableCell>
//           <Stack>
//             <Typography variant="body1">{new Date (course.date_start).toLocaleDateString()}</Typography>
//             <Typography variant="body1">{new Date (course.date_end).toLocaleDateString()}</Typography>
//           </Stack>
//         </TableCell>
//       )
//     }
//   ]

//   const courseTableFieldsForDialogAll = [...courseTableFieldsForDialog, {
//     columnDescription: "Enroll",
//     generateTableHeaderCell: () => (
//       <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
//         <Typography variant="h6">&nbsp;</Typography>
//       </TableCell>
//     ),
//     generateTableCell: (course, extraProperties) => {
//       const quantity = Object.entries(extraProperties.secondariesByPrimary)
//         .filter(([userId]) => (
//           assignCourseDialogUsers.map((u) => u.id).includes(parseInt(userId))
//         ))
//         .filter(([, courses]) => (
//           courses.map((c) => c.id).includes(course.id)
//         )).length
//       return (
//       <TableCell>
//         {quantity == assignCourseDialogUsers.length && (
//           <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
//             {assignCourseDialogUsers.length == 1 ? (
//               <Typography variant="body1">Enrolled</Typography>
//             ) : (
//               <Typography variant="body1">
//                 {quantity == 2 ? `Both users enrolled` : `All ${quantity} users enrolled`}
//               </Typography>
//             )}
//           </Button>) || 
//           quantity == 0 && (
//             <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
//               handleAssignUsersToCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
//             }}>
//               {assignCourseDialogUsers.length == 1 ? (
//                 <Typography variant="body1">Enroll</Typography>
//                 ) : (
//                 <Typography variant="body1">Enroll {assignCourseDialogUsers.length} users</Typography>
//               )}
//             </Button>
//           ) || 
//           quantity > 0 && quantity < assignCourseDialogUsers.length && (
//             <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
//               handleAssignUsersToCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
//             }}>
//               {assignCourseDialogUsers.length - quantity == 1 ? (
//                 <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more user</Typography>
//               ) : (
//                 <Typography variant="body1">Enroll {assignCourseDialogUsers.length - quantity} more users</Typography>
//               )}
//             </Button>
//           )
//         }
//       </TableCell>
//     )}
//   }]

//   const courseTableFieldsForDialogAssigned = [...courseTableFieldsForDialog, {
//     columnDescription: "",
//     generateTableHeaderCell: () => (
//       <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
//         <Typography variant="h6">&nbsp;</Typography>
//       </TableCell>
//     ),
//     generateTableCell: (course, extraProperties) => {
//       const quantity = Object.entries(extraProperties.secondariesByPrimary)
//         .filter(([userId]) => (
//           assignCourseDialogUsers.map((u) => u.id).includes(parseInt(userId))
//         ))
//         .filter(([, courses]) => (
//           courses.map((c) => c.id).includes(course.id)
//         )).length

//       return (
//         <TableCell>
//           <Button variant="outlined" color="primary" startIcon={<ClearIcon />} onClick={() => {
//             handleUnassignUsersFromCourse(course.id, extraProperties.primaryItems.map((u) => u.id));
//           }}>
//           {quantity == 1 ? (
//             assignCourseDialogUsers.length == 1 ? (
//               <Typography variant="body1">Unenroll</Typography>
//             ) : (
//               <Typography variant="body1">Unenroll {quantity} user</Typography>
//             )
//           ) : (
//             <Typography variant="body1">Unenroll {quantity} users</Typography>
//           )}
//           </Button>
//         </TableCell>
//       )
//     }
//   }]

  const clearFilters = () => {
    
  }


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
            {/* <Button color="primary" variant={
              visibleExhibitions.length > 0 ? "outlined" : "contained"
            } startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
              disabled={
                !Boolean(searchQuery || userTypeFilter || userActivationStatusFilter || userPasswordTypeFilter)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button> */}
            {/* <Button color="primary" variant="contained" startIcon={<GroupAddIcon/>}
              onClick={() => {
                setDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Users</Typography>
            </Button> */}
          </Stack>
        </Stack>
        <DataTable items={exhibitions} visibleItems={visibleExhibitions} tableFields={exhibitionTableFields} 
          rowSelectionEnabled={true}
          selectedItems={selectedExhibitions} setSelectedItems={setSelectedExhibitions}
          sx={{gridArea: "table"}}
          emptyMinHeight="300px"
          {...visibleExhibitions.length == exhibitions.length && {
            noContentMessage: "No exhibitions yet",
            NoContentIcon: InfoIcon
          } || visibleExhibitions.length < exhibitions.length && {
            noContentMessage: "No results",
            noContentButtonAction: clearFilters,
            noContentButtonText: "Clear Filters",
            NoContentIcon: SearchIcon
          }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{gridArea: "bottom"}}>
          <SelectionSummary 
            items={exhibitions}
            selectedItems={selectedExhibitions}
            setSelectedItems={setSelectedExhibitions}
            visibleItems={visibleExhibitions}
            entitySingular="exhibition"
            entityPlural="exhibitions"
          />
         {/* <Stack direction="row" spacing={2} >
            <Button variant="outlined"
              disabled={selectedExhibitions.length == 0}
              startIcon={<SchoolIcon />}
              onClick={() => {
              setAssignCourseDialogUsers([...selectedExhibitions])
              setAssignCourseDialogIsOpen(true);
            }}>
              <Typography variant="body1">Manage Course Enrollments for {selectedExhibitions.length} {selectedExhibitions.length == 1 ? "user" : "users"}</Typography>
            </Button>
          </Stack> */}
        </Stack>

      {/* <ItemMultiCreateDialog entity="user" 
        dialogTitle={"Create Users"}
        dialogInstructions={"Add users, edit the user fields, then click 'Create'.  The system will generate temporary passwords for each user."}
        createDialogItems={createDialogExhibitions}
        handleItemsCreate={handleUsersCreate}
        {...{ createDialogFieldDefinitions: userFieldDefinitions, dialogIsOpen, setDialogIsOpen, createDialogDispatch }} /> */}

      {/* <ItemSingleEditDialog 
        entity="exhibition"
        dialogTitle={"Edit Exhibition"}
        dialogInstructions={"Edit the exhibition fields, then click 'Save'."}
        editDialogItem={editDialogExhibition}
        handleItemEdit={handleExhibitionEdit}
        {...{ editDialogFieldDefinitions: userFieldDefinitions, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} /> */}

      <ExhibitionSettingsDialog
        editMode={true}
        adminMode={true}
        dialogExhibitionAccess={editDialogExhibitionAccess}
        setDialogExhibitionAccess={setEditDialogExhibitionAccess}
        dialogExhibitionId={editDialogExhibitionId}
        dialogExhibitionTitle={editDialogExhibitionTitle}
        setDialogExhibitionTitle={setEditDialogExhibitionTitle}
        dialogIsOpen={editDialogIsOpen}
        setDialogIsOpen={setEditDialogIsOpen}
        handleExhibitionEdit={handleExhibitionEditByAdmin}
        />

      <ItemSingleDeleteDialog
        deleteDialogIsOpen={deleteDialogIsOpen}
        deleteDialogItem={deleteDialogExhibition}
        dialogTitle="Delete Exhibition"
        requireTypedConfirmation={true}
        entity="exhibition"
        setDeleteDialogIsOpen={setDeleteDialogIsOpen}
        handleDelete={handleExhibitionDeleteByAdmin}
      />

      {/* <AssociationManagementDialog
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
      /> */}

    </Box>
  );
}


export default ExhibitionManagement;
