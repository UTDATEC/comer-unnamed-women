import React, { useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import {
  Stack,
  Button,
  Typography, useTheme, Box, IconButton
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckIcon from "@mui/icons-material/Check";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { searchItems } from "../Tools/SearchUtilities";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import { Navigate, useNavigate } from "react-router";


const createCourseDialogReducer = (createDialogCourses, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogCourses, {
        name: "",
        date_start: "",
        date_end: "",
        notes: ""
      }]

    case 'change':
      return createDialogCourses.map((r, i) => {
        if(action.index == i)
          return {...r, [action.field]: action.newValue};
        else
          return r;
      })
      
    case 'remove':
      return createDialogCourses.filter((r, i) => {
        return action.index != i;
      })

    case 'set':
      return action.newArray;
  
    default:
      throw Error("Unknown action type");
  }
}

const CourseManagement = (props) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogCourse, setDeleteDialogCourse] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogCourse, setEditDialogCourse] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState({name: '', date_start: '', date_end: '', notes: ''});
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);


  const [assignUserDialogIsOpen, setAssignUserDialogIsOpen] = useState(false);
  const [assignUserDialogCourse, setAssignUserDialogCourse] = useState(null);
  const [assignUserDialogUsers, setAssignUserDialogUsers] = useState([]);
  

  const editDialogFieldNames = [
    {
      fieldName: "name",
      displayName: "Course Name",
      inputType: "textarea",
      isRequired: true
    },
    {
      fieldName: "date_start",
      displayName: "Start",
      inputType: "datetime-local",
      isRequired: true
    },
    {
      fieldName: "date_end",
      displayName: "End",
      inputType: "datetime-local",
      isRequired: true
    },
    {
      fieldName: "notes",
      displayName: "Notes",
      inputType: "textarea",
      multiline: true
    }
  ]
  const createDialogFieldNames = editDialogFieldNames;

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogCourses, createDialogDispatch] = useReducer(createCourseDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setSearchQuery("");
  }


  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem, 
    snackbarOpen, snackbarText, snackbarSeverity,
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  

  useEffect(() => {
    setSelectedNavItem("Course Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []); 


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const courseData = response.data;
      setCourses(courseData.data);

      const response2 = await axios.get("http://localhost:9000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const userData = response2.data;
      setUsers(userData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCourseUsers = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const courseData = await response.data;
      setAssignUserDialogUsers([...courseData.data.Users]);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    fetchData();
  }

  /*
    Course display:
    Step 1: apply column filters
    Step 2: apply search query
    Step 3: apply sorting order
  */

  const filterCourses = () => {
    return courses.filter((course) => {
      return true;
      // return (
      //   // filter by course type
      //   !courseTypeFilter || courseTypeFilter == "Administrator" && course.is_admin || courseTypeFilter == "Curator" && !course.is_admin
      // ) && (
      //   // filter by course activation status
      //   !courseActivationStatusFilter || courseActivationStatusFilter == "Active" && course.is_active || courseActivationStatusFilter == "Inactive" && !course.is_active
      // ) && (
      //   // filter by password type
      //   !coursePasswordTypeFilter || coursePasswordTypeFilter == "Temporary" && course.pw_temp || coursePasswordTypeFilter == "Permanent" && !course.pw_temp
      // )
    })
  }


  const filteredCourses = useMemo(() => filterCourses(
    // 
  ), [
    courses
  ])


  const filteredAndSearchedCourses = useMemo(() => searchItems(searchQuery, filteredCourses, ['name', 'notes']), [filteredCourses, searchQuery])

  const coursesToDisplay = filteredAndSearchedCourses.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  

  const handleDeleteClick = (courseId) => {
    setDeleteDialogCourse({ courseId });
    setDeleteDialogIsOpen(true);
  };


  const handleCoursesCreate = async(newCourseArray) => {
    let coursesCreated = 0;
    let courseIndicesWithErrors = []
    for(const [i, newCourseData] of newCourseArray.entries()) {
      try {
        let { name, date_start, date_end, notes } = newCourseData;
        await axios.post(
          `http://localhost:9000/api/courses`, { name, date_start, date_end, notes },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        coursesCreated++;
  
      } catch (error) {
        console.error(`Error creating course ${JSON.stringify(newCourseData)}: ${error}`);
        courseIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(coursesCreated == newCourseArray.length) {
      setCreateDialogIsOpen(false);
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      setSnackbarText(`Successfully created ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } else if(coursesCreated < newCourseArray.length) {

      if(coursesCreated > 0) {
        setSnackbarText(`Created ${coursesCreated} of ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`)
        setSnackbarSeverity("warning");
      }
      else {
        setSnackbarText(`Failed to create ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`)
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);

      createDialogDispatch({
        type: "set",
        newArray: newCourseArray.filter((u, i) => {
          return courseIndicesWithErrors.includes(i);
        })
      })
    }


  }


  const handleAssignCourseToUser = async(userId, courseId) => {
    try {
      await axios.put(
        `http://localhost:9000/api/courses/${courseId}/users/${userId}`, null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchCourseUsers(courseId);

      setEditDialogIsOpen(false);
      setEditDialogFields({email: '', given_name: '', family_name: ''})

      setSnackbarText(`Successfully enrolled user ${userId} in course ${courseId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error enrolling user ${userId} in course ${courseId}: ${error}`);

      setSnackbarText(`Error enrolling user ${userId} in course ${courseId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  
  const handleUnassignCourseFromUser = async(userId, courseId) => {
    try {
      await axios.delete(
        `http://localhost:9000/api/courses/${courseId}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchCourseUsers(courseId);

      setEditDialogIsOpen(false);
      setEditDialogFields({email: '', given_name: '', family_name: ''})

      setSnackbarText(`Successfully unenrolled user ${userId} from course ${courseId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error unenrolling user ${userId} from course ${courseId}: ${error}`);

      setSnackbarText(`Error unenrolling user ${userId} from course ${courseId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }



  
  const handleCourseEdit = async(courseId, updateFields) => {
    const { name, date_start, date_end, notes } = updateFields;
    try {
      await axios.put(
        `http://localhost:9000/api/courses/${courseId}`, { name, date_start, date_end, notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setEditDialogIsOpen(false);
      setEditDialogFields({name: '', date_start: '', date_end: '', notes: ''})

      setSnackbarText(`Successfully edited course ${courseId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error editing course ${courseId}: ${error}`);

      setSnackbarText(`Error editing for course ${courseId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }



  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarSeverity("success")
      setSnackbarText(`Course ${courseId} has been deleted`);
      setSnackbarOpen(true);

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting course:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);

      setSnackbarSeverity("error")
      setSnackbarText(`Course ${courseId} could not be deleted`);
      setSnackbarOpen(true);
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogCourse(null);
  };



  const courseTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
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
        <TableCell sx={{backgroundColor: "#CCC"}}>
            <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
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
      columnDescription: "Enrollment",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Enrollment</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" color="primary" startIcon={<PersonIcon />}
              onClick={() => {
                setAssignUserDialogCourse(course);
                setAssignUserDialogUsers(course.Users);
                setAssignUserDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{course.Users.length}</Typography>
            </Button>
          </Stack>
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
    },
    {
      columnDescription: "Options",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Options</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <IconButton 
            onClick={(e) => {
              setEditDialogCourse(course);
              const { name, date_start, date_end, notes } = course;
              setEditDialogFields({ name, date_start, date_end, notes });
              setEditDialogSubmitEnabled(true);
              setEditDialogIsOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            disabled={course.Users.length > 0} 
            onClick={(e) => {
              setDeleteDialogCourse(course);
              setDeleteDialogIsOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )
    }
  ]


  const userTableFieldsForDialog = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">ID</Typography>
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
          <Typography variant="h6">Name</Typography>
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
          <Typography variant="h6">Email</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Typography variant="body1">{user.email}</Typography>
        </TableCell>
      )
    }
  ]

  const userTableFieldsForDialogAll = [...userTableFieldsForDialog, {
    columnDescription: "Enroll",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: "#CCC"}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (user, extraProperties) => (
      <TableCell>
        {extraProperties.secondaryItemIdsAssigned.indexOf(user.id) == -1 ? 
          <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
            handleAssignCourseToUser(user.id, extraProperties.primaryItem.id);
          }}>
            <Typography variant="body1">Enroll</Typography>
          </Button> :
          <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
          <Typography variant="body1">Enrolled</Typography>
        </Button>
        }
      </TableCell>
    )
  }]

  const userTableFieldsForDialogAssigned = [...userTableFieldsForDialog, {
    columnDescription: "",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: "#CCC"}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (user, extraProperties) => (
      <TableCell>
        <Button variant="outlined" color="primary" startIcon={<PersonRemoveIcon />} onClick={() => {
            handleUnassignCourseFromUser(user.id, extraProperties.primaryItem.id);
          }}>
          <Typography variant="body1">Unenroll</Typography>
        </Button>
      </TableCell>
    )
  }]



  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) ||
  appUser.is_admin && (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={2} padding={2}>
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by course name or notes" width="50%" />
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
                !Boolean(searchQuery)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon/>}
              onClick={() => {
                setCreateDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Courses</Typography>
            </Button>
          </Stack>
        </Stack>
        <DataTable items={coursesToDisplay} tableFields={courseTableFields} />
          {
            coursesToDisplay.length == 0 && (
              <Box sx={{width: '100%'}}>
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                  <SearchIcon sx={{fontSize: '150pt', opacity: 0.5}} />
                  <Typography variant="h4">No courses found</Typography>
                  <Button variant="contained" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}>
                    <Typography variant="body1">Clear Filters</Typography>
                  </Button>
                </Stack>
              </Box>
            )
          }

      <ItemMultiCreateDialog entity="course" 
        dialogTitle={"Create Courses"}
        dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
        createDialogItems={createDialogCourses}
        handleItemsCreate={handleCoursesCreate}
        {...{ createDialogFieldNames, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

      <ItemSingleEditDialog 
        entity="course"
        dialogTitle={"Edit Course"}
        dialogInstructions={"Edit the course fields, then click 'Save'."}
        editDialogItem={editDialogCourse}
        handleItemEdit={handleCourseEdit}
        {...{ editDialogFieldNames, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} />

      <ItemSingleDeleteDialog 
        entity="course"
        dialogTitle="Delete Course"
        deleteDialogItem={deleteDialogCourse}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />


      <AssociationManagementDialog
        primaryEntity="course"
        secondaryEntity="user"
        primaryItem={assignUserDialogCourse}
        secondaryItemsAll={users}
        secondaryItemsAssigned={assignUserDialogUsers}
        dialogTitle={`Manage Roster for Course ${assignUserDialogCourse?.id}`}
        dialogButtonForSecondaryManagement={<>
          <Button variant="outlined" onClick={() => {
            navigate('/Account/UserManagement')
          }}>
            <Typography>Go to user management</Typography>
          </Button>
        </>}
        dialogIsOpen={assignUserDialogIsOpen}
        tableTitleAssigned={`Current Users for Course ${assignUserDialogCourse?.id}`}
        tableTitleAll={`All Users`}
        setDialogIsOpen={setAssignUserDialogIsOpen}
        secondaryTableFieldsAll={userTableFieldsForDialogAll}
        secondaryTableFieldsAssignedOnly={userTableFieldsForDialogAssigned}
        secondarySearchFields={['given_name']}
        secondarySearchBoxPlaceholder={"Search users by name or email"}
      />

    </>
  );
}


export default CourseManagement;
