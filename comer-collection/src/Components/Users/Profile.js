import React, { useCallback, useEffect } from "react";
import {
    Typography,
    Button,
    Stack, Paper,
    Box
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable.js";
import { SecurityIcon, PersonIcon, AccountCircleIcon, SchoolIcon, PhotoCameraBackIcon } from "../IconImports.js";
import { useAppUser } from "../App/AppUser.js";
import { useSnackbar } from "../App/AppSnackbar.js";
import { useTitle } from "../App/AppTitle.js";
import { useAccountNav } from "./Account.js";

const Profile = () => {

    const [, setSelectedNavItem] = useAccountNav();

    const [appUser] = useAppUser();
    const showSnackbar = useSnackbar();

    const navigate = useNavigate();
    const setTitleText = useTitle();

    useEffect(() => {
        setSelectedNavItem("Profile");
        setTitleText("Profile");
    }, []);


  
    const courseTableFields = [
        {
            columnDescription: "Course Name",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Course Name</Typography>
            ),
            generateTableCell: (course) => (
                <Typography variant="body1">{course.name}</Typography>
            )
        },
        {
            columnDescription: "Start",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Start</Typography>
            ),
            generateTableCell: (course) => (
                <Typography variant="body1">{new Date (course.date_start).toLocaleString()}</Typography>
            )
        },
        {
            columnDescription: "End",
            generateTableHeaderCell: () => (
                <Typography variant="h6">End</Typography>
            ),
            generateTableCell: (course) => (
                <Typography variant="body1">{new Date (course.date_end).toLocaleString()}</Typography>
            )
        },
        {
            columnDescription: "Status",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Status</Typography>
            ),
            generateTableCell: (course) => (
                new Date(course.date_start).getTime() > new Date().getTime() && (
                    <Typography variant="body1">Upcoming</Typography>
                ) || 
        new Date(course.date_end).getTime() < new Date().getTime() && (
            <Typography variant="body1">Expired</Typography>
        ) || 
        new Date(course.date_end).getTime() >= new Date().getTime() && new Date(course.date_start).getTime() <= new Date().getTime() && (
            <Typography variant="body1">Active</Typography>
        )
            )
        },
        {
            columnDescription: "Notes",
            maxWidth: "300px",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Notes</Typography>
            ),
            generateTableCell: (course) => (
                <Typography variant="body1">{course.notes}</Typography>
            )
        }
    ];

  
    const userTableFields = [
        {
            columnDescription: "Name",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Name</Typography>
            ),
            generateTableCell: (user) => (
                user.has_name ? (
                    <Typography variant="body1">{user.full_name}</Typography>
                ) : (
                    <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
                )
            )
        },
        {
            columnDescription: "Email",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Email</Typography>
            ),
            generateTableCell: (user) => (
                <Button color="grey"
                    variant="text" sx={{textTransform: "unset"}}
                    onClick={() => {handleCopyToClipboard(user, "email");}}>
                    <Typography variant="body1">{user.email}</Typography>
                </Button>
            )
        },
        {
            columnDescription: "Password",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Password Last Changed</Typography>
            ),
            generateTableCell: (user) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">{new Date(appUser.pw_updated).toLocaleString()}</Typography>
                    <Button color={user.is_admin ? "secondary" : "primary"}
                        variant="outlined"
                        onClick={() => {
                            navigate("/Account/ChangePassword");
                        }}>
                        <Typography variant="body1">Change</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "User Type",
            generateTableHeaderCell: () => (
                <Typography variant="h6">User Type</Typography>
            ),
            generateTableCell: (user) => (
                <Stack direction="row" spacing={1}>
                    <Typography variant="body1">{user.is_admin ? "Administrator" : "Curator"}</Typography>
                    {user.is_admin ? (<SecurityIcon color="secondary" />) : (<PersonIcon color="primary" />)}
                </Stack>
            )
        },
        {
            columnDescription: "Exhibition Quota",
            generateTableHeaderCell: () => (
                <Typography variant="h6">Exhibition Quota</Typography>
            ),
            generateTableCell: (user) => (
                <Stack direction="row" spacing={1}>
                    <PhotoCameraBackIcon />
                    <Typography variant="body1">{user.Exhibitions.length} of {user.exhibition_quota} </Typography>
                    <Typography variant="body1" color="gray">{user.is_admin ? " (ignored for administrators)" : ""}</Typography>
                </Stack>
            )
        }
    ];

    const handleCopyToClipboard = useCallback((user, fieldName) => {
        try {
            navigator.clipboard.writeText(user[fieldName]);
            showSnackbar("Copied to clipboard", "success");
        } catch (error) {
            showSnackbar("Error copying text to clipboard", "error");
        }
    }, []);

    return appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) || !appUser.pw_change_required && (
        <Box component={Paper} square sx={{height: "100%"}}>
            <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5}>
                <Stack spacing={2}>
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                        <AccountCircleIcon fontSize="large" />
                        <Typography variant="h4">Profile Information</Typography>
                    </Stack>
                    <DataTable
                        items={[appUser]}
                        visibleItems={[appUser]}
                        tableFields={userTableFields}
                    />
                </Stack>
            </Stack>
            <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5} height="400px">
                <Stack spacing={2}  sx={{
                    display: "grid",
                    gridTemplateRows: "50px 350px",
                    gridTemplateColumns: "1fr",
                    gridTemplateAreas: `
          "title"
          "content"
        `
                }}  overflow="hidden">
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center"
                        sx={{gridArea: "title"}}>
                        <SchoolIcon fontSize="large" />
                        <Typography variant="h4">My Courses</Typography>
                    </Stack>
                    <DataTable sx={{overflow: "scroll"}}
                        nonEmptyHeight="350px"
                        items={appUser.Courses}
                        visibleItems={appUser.Courses}
                        tableFields={courseTableFields}
                        NoContentIcon={SchoolIcon}
                        emptyMinHeight="400px"
                        noContentMessage="You are not enrolled in any courses."
                    />
                </Stack>
            </Stack>
        </Box>
    );
};

export default Profile;
