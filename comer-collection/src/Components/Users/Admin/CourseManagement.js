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
import { SelectionSummary } from "../Tools/SelectionSummary";
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import { courseFieldDefinitions } from "../Tools/HelperMethods/fields";
import { createCourseDialogReducer } from "../Tools/HelperMethods/reducers";


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
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [assignUserDialogCourses, setAssignUserDialogCourses] = useState([]);

  const [usersByCourse, setUsersByCourse] = useState({});
  

  const editDialogFieldDefinitions = courseFieldDefinitions;
  const createDialogFieldDefinitions = courseFieldDefinitions;

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogCourses, createDialogDispatch] = useReducer(createCourseDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setSearchQuery("");
  }


  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar } = props;
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

      setSelectedCourses(selectedCourses.filter((sc) => (
        courseData.data.map((c) => c.id).includes(parseInt(sc.id))
      )));


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


      const usersByCourseDraft = {}
      for(const c of courseData.data) {
        usersByCourseDraft[c.id] = c.Users;
      }
      // setAssignUserDialogUsers([...courseData.data.Users]);
      setUsersByCourse({...usersByCourseDraft});


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCourseUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/courses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const courseData = await response.data;

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

  const visibleCourses = filteredAndSearchedCourses.sort((a, b) => {
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

      showSnackbar(`Successfully created ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`, "success");

    } else if(coursesCreated < newCourseArray.length) {

      if(coursesCreated > 0) {
        showSnackbar(`Created ${coursesCreated} of ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`, "warning");
      }
      else {
        showSnackbar(`Failed to create ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`, "error");
      }

      createDialogDispatch({
        type: "set",
        newArray: newCourseArray.filter((u, i) => {
          return courseIndicesWithErrors.includes(i);
        })
      })
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
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      showSnackbar(`Successfully enrolled user ${userId} in ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "success");

    } else if(coursesAdded < courseIds.length) {

      if(coursesAdded > 0) {
        showSnackbar(`Enrolled user ${userId} in ${coursesAdded} of ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "warning");
      }
      else {
        showSnackbar(`Failed to enroll user ${userId} in ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "error");
      }

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
        console.error(`Error enrolling user ${userId} in course ${courseId}: ${error}`);
        courseIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(coursesAdded == courseIds.length) {
      setCreateDialogIsOpen(false);
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      showSnackbar(`Successfully unenrolled user ${userId} from ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "success");

    } else if(coursesAdded < courseIds.length) {

      if(coursesAdded > 0) {
        showSnackbar(`Unenrolled user ${userId} from ${coursesAdded} of ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "warning");
      }
      else {
        showSnackbar(`Failed to unenroll user ${userId} from ${courseIds.length} ${courseIds.length == 1 ? "course" : "courses"}`, "error");
      }
      
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

      showSnackbar(`Successfully unenrolled user ${userId} from course ${courseId}`, "success");

    } catch (error) {
      console.error(`Error unenrolling user ${userId} from course ${courseId}: ${error}`);

      showSnackbar(`Error unenrolling user ${userId} from course ${courseId}`, "error");
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

      showSnackbar(`Successfully edited course ${courseId}`, "success");

    } catch (error) {
      console.error(`Error editing course ${courseId}: ${error}`);

      showSnackbar(`Error editing for course ${courseId}`, "error");
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

      showSnackbar(`Course ${courseId} has been deleted`, "success")

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting course:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);

      showSnackbar(`Course ${courseId} could not be deleted`, "error")
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
                // setSelectedCourses([course]);
                // setAssignUserDialogCourses([course]);
                setAssignUserDialogCourses([course]);
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
    generateTableCell: (user, extraProperties) => {
      const quantity = Object.entries(extraProperties.secondariesByPrimary)
        .filter(([courseId, users]) => (
          assignUserDialogCourses.map((c) => c.id).includes(parseInt(courseId))
        ))
        .filter(([courseId, users]) => (
          users.map((u) => u.id).includes(user.id)
        )).length
      return (
      <TableCell>
        {quantity == assignUserDialogCourses.length && (
          <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
            {assignUserDialogCourses.length == 1 ? (
              <Typography variant="body1">Enrolled</Typography>
            ) : (
              <Typography variant="body1">Enrolled in all {quantity}</Typography>
            )}
          </Button>) || 
          quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignCoursesToUser(user.id, extraProperties.primaryItems.map((c) => c.id));
            }}>
              {assignUserDialogCourses.length == 1 ? (
                <Typography variant="body1">Enroll</Typography>
                ) : (
                <Typography variant="body1">Enroll in {assignUserDialogCourses.length}</Typography>
              )}
            </Button>
          ) || 
          quantity > 0 && quantity < assignUserDialogCourses.length && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignCoursesToUser(user.id, extraProperties.primaryItems.map((c) => c.id));
            }}>
              <Typography variant="body1">Enroll in {assignUserDialogCourses.length - quantity} more</Typography>
            </Button>
          )
        }
      </TableCell>
    )}
  }]

  const userTableFieldsForDialogAssigned = [...userTableFieldsForDialog, {
    columnDescription: "",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: "#CCC"}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (user, extraProperties) => {
      const quantity = Object.entries(extraProperties.secondariesByPrimary)
        .filter(([courseId, users]) => (
          assignUserDialogCourses.map((c) => c.id).includes(parseInt(courseId))
        ))
        .filter(([courseId, users]) => (
          users.map((u) => u.id).includes(user.id)
        )).length

      return (
        <TableCell>
          {quantity == assignUserDialogCourses.length && (
              <Button variant="outlined" color="primary" startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignCoursesFromUser(user.id, extraProperties.primaryItems.map((c) => c.id));
              }}>
                {assignUserDialogCourses.length == 1 ? (
                  <Typography variant="body1">Unenroll</Typography>
                  ) : (
                  <Typography variant="body1">Unenroll from {quantity}</Typography>
                )}
              </Button>
            ) || 
            quantity > 0 && quantity < assignUserDialogCourses.length && (
              <Button variant="outlined" color="primary" startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignCoursesFromUser(user.id, extraProperties.primaryItems.map((c) => c.id));
              }}>
                <Typography variant="body1">Unenroll from {quantity}</Typography>
              </Button>
            )
          }
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
    <Box sx={{
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
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by course name or notes" width="50%" />
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
              setRefreshInProgress(true);
              fetchData();
            }}
              disabled={refreshInProgress}>
              <Typography variant="body1">Refresh</Typography>
            </Button>
            <Button color="primary" variant={
              visibleCourses.length > 0 ? "outlined" : "contained"
            } startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
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
        <DataTable items={courses} visibleItems={visibleCourses} tableFields={courseTableFields} rowSelectionEnabled={true}
          selectedItems={selectedCourses} setSelectedItems={setSelectedCourses}
          sx={{gridArea: "table"}}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{gridArea: "bottom"}}>
          <SelectionSummary 
            items={courses}
            selectedItems={selectedCourses}
            setSelectedItems={setSelectedCourses}
            visibleItems={visibleCourses}
            entitySingular="course"
            entityPlural="courses"
          />
         <Stack direction="row" spacing={2} >
            <Button variant="outlined"
              disabled={selectedCourses.length == 0}
              startIcon={<GroupAddIcon />}
              onClick={() => {
              setAssignUserDialogCourses([...selectedCourses])
              setAssignUserDialogIsOpen(true);
            }}>
              <Typography variant="body1">Manage User Enrollments for {selectedCourses.length} {selectedCourses.length == 1 ? "course" : "courses"}</Typography>
            </Button>
          </Stack>
        </Stack>

      <ItemMultiCreateDialog entity="course" 
        dialogTitle={"Create Courses"}
        dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
        createDialogItems={createDialogCourses}
        handleItemsCreate={handleCoursesCreate}
        {...{ createDialogFieldDefinitions, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

      <ItemSingleEditDialog 
        entity="course"
        dialogTitle={"Edit Course"}
        dialogInstructions={"Edit the course fields, then click 'Save'."}
        editDialogItem={editDialogCourse}
        handleItemEdit={handleCourseEdit}
        {...{ editDialogFieldDefinitions, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} />

      <ItemSingleDeleteDialog 
        entity="course"
        dialogTitle="Delete Course"
        deleteDialogItem={deleteDialogCourse}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />


      <AssociationManagementDialog
        primaryEntity="course"
        secondaryEntity="user"
        primaryItems={assignUserDialogCourses}
        secondaryItemsAll={users}
        secondariesByPrimary={usersByCourse}
        dialogTitle={
          assignUserDialogCourses.length == 1 ?
            `Manage Enrollment for ${assignUserDialogCourses[0].safe_display_name}` :
            `Manage Enrollment for ${assignUserDialogCourses.length} Selected Courses`
        }
        dialogButtonForSecondaryManagement={<>
          <Button variant="outlined" onClick={() => {
            navigate('/Account/UserManagement')
          }}>
            <Typography>Go to user management</Typography>
          </Button>
        </>}
        dialogIsOpen={assignUserDialogIsOpen}
        tableTitleAssigned={
          assignUserDialogCourses.length == 1 ?
            `Current Users in ${assignUserDialogCourses[0].safe_display_name}` :
            `Current Users in Selected Courses`
        }
        tableTitleAll={`All Users`}
        setDialogIsOpen={setAssignUserDialogIsOpen}
        secondaryFieldInPrimary="Users"
        secondaryTableFieldsAll={userTableFieldsForDialogAll}
        secondaryTableFieldsAssignedOnly={userTableFieldsForDialogAssigned}
        secondarySearchFields={['given_name']}
        secondarySearchBoxPlaceholder={"Search users by name or email"}
      />

    </Box>
  );
}


export default CourseManagement;
