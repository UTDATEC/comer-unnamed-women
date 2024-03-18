import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, IconButton, Paper
} from "@mui/material";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { doesItemMatchSearchQuery } from "../Tools/SearchUtilities";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import { Navigate, useNavigate } from "react-router";
import { SelectionSummary } from "../Tools/SelectionSummary";
import { courseFieldDefinitions, filterItemFields } from "../Tools/HelperMethods/fields";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls";
import { useSnackbar } from "../../App/AppSnackbar";
import { useAppUser } from "../../App/AppUser";
import {
    FilterAltOffOutlinedIcon,
    AddIcon,
    SearchIcon,
    RefreshIcon,
    EditIcon,
    DeleteIcon,
    PersonIcon,
    PersonAddIcon,
    PersonRemoveIcon,
    CheckIcon,
    GroupAddIcon,
    SecurityIcon,
    InfoIcon
} from "../../IconImports";
import { useTitle } from "../../App/AppTitle";
import { useAccountNav } from "../Account";


const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogCourse, setDeleteDialogCourse] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogCourse, setEditDialogCourse] = useState(null);

    const [assignUserDialogIsOpen, setAssignUserDialogIsOpen] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [assignUserDialogCourses, setAssignUserDialogCourses] = useState([]);

    const [usersByCourse, setUsersByCourse] = useState({});

    const editDialogFieldDefinitions = courseFieldDefinitions;
    const createDialogFieldDefinitions = courseFieldDefinitions;

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const clearFilters = () => {
        setSearchQuery("");
    };


    const [sortColumn, setSortColumn] = useState("ID");
    const [sortAscending, setSortAscending] = useState(true);


    const [, setSelectedNavItem] = useAccountNav();
    const showSnackbar = useSnackbar();
    const [appUser] = useAppUser();
    const navigate = useNavigate();
    const setTitleText = useTitle();


    useEffect(() => {
        setSelectedNavItem("Course Management");
        setTitleText("Course Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, []);


    const courseFilterFunction = useCallback((course) => {
        return doesItemMatchSearchQuery(searchQuery, course, ["name", "notes"]);
    }, [searchQuery]);


    const fetchData = async () => {
        try {
            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            setSelectedCourses(selectedCourses.filter((sc) => (
                courseData.data.map((c) => c.id).includes(parseInt(sc.id))
            )));


            const userData = await sendAuthenticatedRequest("GET", "/api/admin/users");
            setUsers(userData.data);

            setTimeout(() => {
                setRefreshInProgress(false);
            }, 1000);


            const usersByCourseDraft = {};
            for (const c of courseData.data) {
                usersByCourseDraft[c.id] = c.Users;
            }
            setUsersByCourse({ ...usersByCourseDraft });


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const visibleCourses = useMemo(() => courses.filter((course) => {
        return courseFilterFunction(course);
    }), [courses, searchQuery]);


    const handleCoursesCreate = async (newCourseArray) => {
        let coursesCreated = 0;
        let courseIndicesWithErrors = [];
        for (const [i, newCourseData] of newCourseArray.entries()) {
            try {
                let filteredCourse = filterItemFields(courseFieldDefinitions, newCourseData);
                await sendAuthenticatedRequest("POST", "/api/admin/courses", filteredCourse);

                coursesCreated++;

            } catch (error) {
                console.error(`Error creating course ${JSON.stringify(newCourseData)}: ${error}`);
                courseIndicesWithErrors.push(i);
            }
        }
        fetchData();

        if (coursesCreated == newCourseArray.length) {
            setDialogIsOpen(false);

            showSnackbar(`Successfully created ${newCourseArray.length} ${newCourseArray.length == 1 ? "course" : "courses"}`, "success");

        } else if (coursesCreated < newCourseArray.length) {

            if (coursesCreated > 0) {
                showSnackbar(`Created ${coursesCreated} of ${newCourseArray.length} ${newCourseArray.length == 1 ? "course." : "courses."}  Make sure each end time is after the start time.`, "warning");
            }
            else {
                showSnackbar(`Failed to create ${newCourseArray.length} ${newCourseArray.length == 1 ? "course." : "courses."}  Make sure each end time is after the start time.`, "error");
            }

        }

        return courseIndicesWithErrors;


    };


    const handleAssignCoursesToUser = useCallback(async (userId, courseIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/enrollments/assign", {
                courses: courseIds,
                users: [userId]
            });
            showSnackbar("Successfully enrolled", "success");

        } catch (error) {
            showSnackbar("Failed to enroll", "error");
        }
        await fetchData();
    }, [showSnackbar]);



    const handleUnassignCoursesFromUser = useCallback(async (userId, courseIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/enrollments/unassign", {
                courses: courseIds,
                users: [userId]
            });
            showSnackbar("Successfully unenrolled", "success");

        } catch (error) {
            showSnackbar("Failed to unenroll", "error");
        }
        await fetchData();
    }, [showSnackbar]);



    const handleCourseEdit = async (courseId, updateFields) => {
        try {
            const filteredCourse = filterItemFields(courseFieldDefinitions, updateFields);
            await sendAuthenticatedRequest("PUT", `/api/admin/courses/${courseId}`, filteredCourse);
            fetchData();

            setEditDialogIsOpen(false);

            showSnackbar("Successfully edited course", "success");

        } catch (error) {
            console.error(`Error editing course ${courseId}: ${error}`);

            showSnackbar("Error editing course.  Make sure the end time is after the start time.", "error");
        }
    };



    const handleDelete = async (courseId) => {
        try {
            await sendAuthenticatedRequest("DELETE", `/api/admin/courses/${courseId}`);
            fetchData();

            showSnackbar(`Course ${courseId} has been deleted`, "success");

        } catch (error) {
            console.error("Error handling delete operation:", error);

            showSnackbar(`Course ${courseId} could not be deleted`, "error");
        }

        setDeleteDialogIsOpen(false);
        setDeleteDialogCourse(null);
    };



    const courseTableFields = [
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
            generateSortableValue: (course) => course.name.toLowerCase()
        },
        {
            columnDescription: "Start",
            generateTableCell: (course) => (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {new Date(course.date_start).toLocaleDateString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            weekday: "short"
                        })}
                    </Typography>
                    <Typography variant="body1">{new Date(course.date_start).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}</Typography>
                </Stack>
            ),
            generateSortableValue: (course) => new Date(course.date_start)
        },
        {
            columnDescription: "End",
            generateTableCell: (course) => (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {new Date(course.date_end).toLocaleDateString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            weekday: "short"
                        })}
                    </Typography>
                    <Typography variant="body1">{new Date(course.date_end).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}</Typography>
                </Stack>
            ),
            generateSortableValue: (course) => new Date(course.date_end)
        },
        {
            columnDescription: "Status",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.status}</Typography>
            )
        },
        {
            columnDescription: "Enrollment",
            generateTableCell: (course) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="outlined" color="primary" startIcon={<PersonIcon />}
                        onClick={() => {
                            setAssignUserDialogCourses([course]);
                            setAssignUserDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">{course.Users.length}</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.notes}</Typography>
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (course) => (
                <>
                    <IconButton
                        onClick={() => {
                            setEditDialogCourse(course);
                            setEditDialogIsOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        disabled={course.Users.length > 0}
                        onClick={() => {
                            setDeleteDialogCourse(course);
                            setDeleteDialogIsOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];


    const userTableFieldsForDialog = [
        {
            columnDescription: "ID",
            generateTableCell: (user) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">{user.id} </Typography>
                    {user.is_admin && (<SecurityIcon color="secondary" />)}
                </Stack>
            ),
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "Name",
            generateTableCell: (user) => (
                <Typography variant="body1">{user.full_name_reverse ?? "not set"}</Typography>
            ),
            generateSortableValue: (user) => user.full_name_reverse?.toLowerCase() ?? ""
        },
        {
            columnDescription: "Email",
            generateTableCell: (user) => (
                <Typography variant="body1">{user.email}</Typography>
            )
        }
    ];

    const userTableFieldsForDialogAll = [...userTableFieldsForDialog, {
        columnDescription: "Enroll",
        generateTableCell: (user) => {
            const quantity = user.quantity_assigned;
            return (
                quantity == assignUserDialogCourses.length && (
                    <Button variant="text" color={user.is_admin ? "secondary" : "primary"} disabled startIcon={<CheckIcon />}>
                        {assignUserDialogCourses.length == 1 ? (
                            <Typography variant="body1">Enrolled</Typography>
                        ) : (
                            <Typography variant="body1">
                                {quantity == 2 ? "Enrolled in both" : `Enrolled in all ${quantity}`}
                            </Typography>
                        )}
                    </Button>) ||
        quantity == 0 && (
            <Button variant="outlined" color={user.is_admin ? "secondary" : "primary"} startIcon={<PersonAddIcon />} onClick={() => {
                handleAssignCoursesToUser(user.id, assignUserDialogCourses.map((c) => c.id));
            }}>
                {assignUserDialogCourses.length == 1 ? (
                    <Typography variant="body1">Enroll</Typography>
                ) : (
                    <Typography variant="body1">Enroll in {assignUserDialogCourses.length}</Typography>
                )}
            </Button>
        ) ||
        quantity > 0 && quantity < assignUserDialogCourses.length && (
            <Button variant="outlined" color={user.is_admin ? "secondary" : "primary"} startIcon={<PersonAddIcon />} onClick={() => {
                handleAssignCoursesToUser(user.id, assignUserDialogCourses.map((c) => c.id));
            }}>
                <Typography variant="body1">Enroll in {assignUserDialogCourses.length - quantity} more</Typography>
            </Button>
        )
            );
        }
    }];

    const userTableFieldsForDialogAssigned = [...userTableFieldsForDialog, {
        columnDescription: "",
        generateTableCell: (user) => {
            const quantity = user.quantity_assigned;
            return (
                quantity == assignUserDialogCourses.length && (
                    <Button variant="outlined" color={user.is_admin ? "secondary" : "primary"} startIcon={<PersonRemoveIcon />} onClick={() => {
                        handleUnassignCoursesFromUser(user.id, assignUserDialogCourses.map((c) => c.id));
                    }}>
                        {assignUserDialogCourses.length == 1 ? (
                            <Typography variant="body1">Unenroll</Typography>
                        ) : (
                            <Typography variant="body1">Unenroll from {quantity}</Typography>
                        )}
                    </Button>
                ) ||
        quantity > 0 && quantity < assignUserDialogCourses.length && (
            <Button variant="outlined" color={user.is_admin ? "secondary" : "primary"} startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignCoursesFromUser(user.id, assignUserDialogCourses.map((c) => c.id));
            }}>
                <Typography variant="body1">Unenroll from {quantity}</Typography>
            </Button>
        )
            );
        }
    }];



    return !appUser.is_admin && (
        <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) ||
    appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) ||
    appUser.is_admin && (
        <Box component={Paper} square sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "80px calc(100vh - 224px) 80px",
            gridTemplateAreas: `
        "top"
        "table"
        "bottom"
      `
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "top" }}>
                <SearchBox {...{ searchQuery, setSearchQuery }} placeholder="Search by course name or notes" width="50%" />
                <Stack direction="row" spacing={2}>
                    <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => {
                        setRefreshInProgress(true);
                        fetchData();
                    }}
                    disabled={refreshInProgress}>
                        <Typography variant="body1">Refresh</Typography>
                    </Button>
                    <Button color="primary" variant={
                        visibleCourses.length > 0 ? "outlined" : "contained"
                    } startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                    disabled={
                        !searchQuery
                    }>
                        <Typography variant="body1">Clear Filters</Typography>
                    </Button>
                    <Button color="primary" variant="contained" startIcon={<AddIcon />}
                        onClick={() => {
                            setDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">Create Courses</Typography>
                    </Button>
                </Stack>
            </Stack>
            <DataTable items={courses} visibleItems={visibleCourses} tableFields={courseTableFields} rowSelectionEnabled={true}
                selectedItems={selectedCourses} setSelectedItems={setSelectedCourses}
                {...{ sortColumn, setSortColumn, sortAscending, setSortAscending }}
                sx={{ gridArea: "table" }}
                emptyMinHeight="300px"
                {...visibleCourses.length == courses.length && {
                    noContentMessage: "No courses yet",
                    noContentButtonAction: () => { setDialogIsOpen(true); },
                    noContentButtonText: "Create a course",
                    NoContentIcon: InfoIcon
                } || visibleCourses.length < courses.length && {
                    noContentMessage: "No results",
                    noContentButtonAction: clearFilters,
                    noContentButtonText: "Clear Filters",
                    NoContentIcon: SearchIcon
                }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
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
                            setAssignUserDialogCourses([...selectedCourses]);
                            setAssignUserDialogIsOpen(true);
                        }}>
                        <Typography variant="body1">Manage User Enrollments for {selectedCourses.length} {selectedCourses.length == 1 ? "course" : "courses"}</Typography>
                    </Button>
                </Stack>
            </Stack>

            <ItemMultiCreateDialog entity="course"
                dialogTitle={"Create Courses"}
                dialogInstructions={"Add courses, edit the course fields, then click 'Create'.  You can enroll users after creating the course."}
                handleItemsCreate={handleCoursesCreate}
                {...{ createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen }} />

            <ItemSingleEditDialog
                entity="course"
                dialogTitle={"Edit Course"}
                dialogInstructions={"Edit the course fields, then click 'Save'."}
                editDialogItem={editDialogCourse}
                handleItemEdit={handleCourseEdit}
                {...{ editDialogFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

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
                        navigate("/Account/UserManagement");
                    }}>
                        <Typography>Go to user management</Typography>
                    </Button>
                </>}
                dialogIsOpen={assignUserDialogIsOpen}
                tableTitleAssigned={
                    assignUserDialogCourses.length == 1 ?
                        `Current Users in ${assignUserDialogCourses[0].safe_display_name}` :
                        "Current Users in Selected Courses"
                }
                tableTitleAll={"All Users"}
                setDialogIsOpen={setAssignUserDialogIsOpen}
                secondaryFieldInPrimary="Users"
                secondaryTableFieldsAll={userTableFieldsForDialogAll}
                secondaryTableFieldsAssignedOnly={userTableFieldsForDialogAssigned}
                secondarySearchFields={["given_name"]}
                secondarySearchBoxPlaceholder={"Search users by name or email"}
                defaultSortAscending={true}
                defaultSortColumn="Name"
            />

        </Box>
    );
};


export default CourseManagement;
