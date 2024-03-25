import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, IconButton, Paper
} from "@mui/material";
import Unauthorized from "../../ErrorPages/Unauthorized.js";
import SearchBox from "../Tools/SearchBox.js";
import { LockIcon, RefreshIcon, DeleteIcon, SearchIcon, InfoIcon, VpnLockIcon, PublicIcon, SettingsIcon, OpenInNewIcon, FilterAltOffOutlinedIcon } from "../../IconImports.js";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog.js";
import { DataTable } from "../Tools/DataTable.js";
import { Navigate } from "react-router";
import { SelectionSummary } from "../Tools/SelectionSummary.js";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls.js";
import { ExhibitionSettingsDialog } from "../Tools/Dialogs/ExhibitionSettingsDialog.js";
import { useSnackbar } from "../../App/AppSnackbar.js";
import { useAppUser } from "../../App/AppUser.js";
import { doesItemMatchSearchQuery } from "../Tools/SearchUtilities.js";
import { CourseFilterMenu } from "../Tools/CourseFilterMenu.js";
import { useTitle } from "../../App/AppTitle.js";
import { useAccountNav } from "../Account.js";

const ExhibitionManagement = () => {
    const [, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogExhibitionId, setEditDialogExhibitionId] = useState(null);
    const [editDialogExhibitionAccess, setEditDialogExhibitionAccess] = useState(null);
    const [editDialogExhibitionTitle, setEditDialogExhibitionTitle] = useState(null);

    const [selectedExhibitions, setSelectedExhibitions] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [sortColumn, setSortColumn] = useState("Modified");
    const [sortAscending, setSortAscending] = useState(false);


    const [, setSelectedNavItem] = useAccountNav();
    const [appUser] = useAppUser();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle();


    const [userCourseIdFilter, setUserCourseIdFilter] = useState(null);


    const clearFilters = () => {
        setUserCourseIdFilter(null);
        setSearchQuery("");
    };


    useEffect(() => {
        setSelectedNavItem("Exhibition Management");
        setTitleText("Exhibition Management");
        if (appUser.is_admin) {
            fetchData();
        }
    }, []);


    const fetchData = async () => {
        try {
            const exhibitionData = await sendAuthenticatedRequest("GET", "/api/admin/exhibitions");
            setExhibitions(exhibitionData.data);

            setSelectedExhibitions(selectedExhibitions.filter((su) => (
                exhibitionData.data.map((u) => u.id).includes(parseInt(su.id))
            )));


            const userData = await sendAuthenticatedRequest("GET", "/api/admin/users");
            setUsers(userData.data);

            const courseData = await sendAuthenticatedRequest("GET", "/api/admin/courses");
            setCourses(courseData.data);

            setTimeout(() => {
                setRefreshInProgress(false);
            }, 1000);


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    const exhibitionFilterFunction = useCallback((exhibition) => {
        return (
            !userCourseIdFilter || userCourseIdFilter && exhibition.User.Courses.map((c) => c.id).includes(userCourseIdFilter.id)
        ) && doesItemMatchSearchQuery(searchQuery, exhibition, ["title"]);
    });

    const visibleExhibitions = useMemo(() => exhibitions.filter((exhibition) => {
        return exhibitionFilterFunction(exhibition);
    }), [exhibitions, searchQuery, userCourseIdFilter]);


    const handleExhibitionEditByAdmin = async (exhibitionId, title, privacy) => {
        try {
            await sendAuthenticatedRequest("PUT", `/api/admin/exhibitions/${exhibitionId}`, { title, privacy });
            setEditDialogIsOpen(false);
            setEditDialogExhibitionId(null);
            setEditDialogExhibitionTitle("");
            setEditDialogExhibitionAccess(null);
            showSnackbar("Exhibition updated", "success");
        } catch (e) {
            console.log(`Error updating exhibition: ${e.message}`);
            showSnackbar("Error updating exhibition", "error");
        }
        fetchData();
    };



    const handleExhibitionDeleteByAdmin = async (exhibitionId) => {
        try {
            await sendAuthenticatedRequest("DELETE", `/api/admin/exhibitions/${exhibitionId}`);
            setDeleteDialogIsOpen(false);
            setDeleteDialogExhibition(null);
            showSnackbar("Exhibition deleted", "success");
        } catch (e) {
            console.log(`Error deleting exhibition: ${e.message}`);
            showSnackbar("Error deleting exhibition", "error");
        }
        fetchData();
    };




    const exhibitionTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (exhibition) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1">{exhibition.id}</Typography>
                </Stack>
            ),
            generateSortableValue: (exhibition) => exhibition.id
        },
        {
            columnDescription: "Title",
            maxWidth: "150px",
            generateTableCell: (exhibition) => (
                exhibition.title ? (
                    <Typography variant="body1">{exhibition.title}</Typography>
                ) : (
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>Not set</Typography>
                )
            ),
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Owner",
            generateTableCell: (exhibition) => (
                <Stack direction="column" paddingTop={1} paddingBottom={1}>
                    <Typography variant="body1">{exhibition.User.full_name_reverse}</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>{exhibition.User.email}</Typography>
                </Stack>
            ),
            generateSortableValue: (exhibition) => exhibition.User.full_name_reverse?.toLowerCase()
        },
        {
            columnDescription: "Created",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date(exhibition.date_created).toLocaleString()}</Typography>
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_created)
        },
        {
            columnDescription: "Modified",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date(exhibition.date_modified).toLocaleString()}</Typography>
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
        },
        {
            columnDescription: "Access",
            generateTableCell: (exhibition) => (
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
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (exhibition) => (
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" endIcon={<OpenInNewIcon />} href={`/Exhibitions/${exhibition.id}`} target="_blank">
                        <Typography variant="body1">Open</Typography>
                    </Button>
                    <IconButton
                        onClick={() => {
                            setEditDialogExhibitionId(exhibition.id);
                            setEditDialogExhibitionAccess(exhibition.privacy);
                            setEditDialogExhibitionTitle(exhibition.title);
                            setEditDialogIsOpen(true);
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
            )
        }
    ];




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
                <SearchBox {...{ searchQuery, setSearchQuery }} placeholder="Search by user name or email" width="30%" />
                <CourseFilterMenu filterValue={userCourseIdFilter} setFilterValue={setUserCourseIdFilter} {...{ courses }} />

                <Stack direction="row" spacing={2}>
                    <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => {
                        setRefreshInProgress(true);
                        fetchData();
                    }}
                    disabled={refreshInProgress}>
                        <Typography variant="body1">Refresh</Typography>
                    </Button>
                    <Button color="primary" variant={
                        visibleExhibitions.length > 0 ? "outlined" : "contained"
                    } startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                    disabled={
                        !(searchQuery || userCourseIdFilter)
                    }>
                        <Typography variant="body1">Clear Filters</Typography>
                    </Button>
                </Stack>
            </Stack>
            <DataTable items={exhibitions} visibleItems={visibleExhibitions} tableFields={exhibitionTableFields}
                rowSelectionEnabled={true}
                selectedItems={selectedExhibitions} setSelectedItems={setSelectedExhibitions}
                defaultSortColumn="Modified"
                defaultSortAscending={false}
                {...{ sortColumn, setSortColumn, sortAscending, setSortAscending }}
                sx={{ gridArea: "table" }}
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                <SelectionSummary
                    items={exhibitions}
                    selectedItems={selectedExhibitions}
                    setSelectedItems={setSelectedExhibitions}
                    visibleItems={visibleExhibitions}
                    entitySingular="exhibition"
                    entityPlural="exhibitions"
                />
            </Stack>


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


        </Box>
    );
};


export default ExhibitionManagement;
