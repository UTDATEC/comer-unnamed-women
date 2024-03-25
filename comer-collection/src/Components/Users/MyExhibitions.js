import React, { useEffect, useState } from "react";
import {
    Typography, Stack, Paper, Box, Button, IconButton
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable.js";
import { PhotoCameraBackIcon, LockIcon, PublicIcon, VpnLockIcon, AddIcon, InfoIcon, OpenInNewIcon, SettingsIcon, DeleteIcon, SecurityIcon } from "../IconImports.js";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls.js";
import { ExhibitionSettingsDialog } from "./Tools/Dialogs/ExhibitionSettingsDialog.js";
import { ItemSingleDeleteDialog } from "./Tools/Dialogs/ItemSingleDeleteDialog.js";
import { useSnackbar } from "../App/AppSnackbar.js";
import { useAppUser } from "../App/AppUser.js";
import { useTitle } from "../App/AppTitle.js";
import { useAccountNav } from "./Account.js";


const MyExhibitions = () => {

    const [, setSelectedNavItem] = useAccountNav();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle();

    const [appUser, , initializeAppUser] = useAppUser();

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogExhibitionId, setDialogExhibitionId] = useState(null);
    const [dialogExhibitionTitle, setDialogExhibitionTitle] = useState("");
    const [dialogExhibitionAccess, setDialogExhibitionAccess] = useState(null);
    const [isDialogInEditMode, setDialogIsEditMode] = useState(false);



    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogExhibition, setDeleteDialogExhibition] = useState(null);


    useEffect(() => {
        setSelectedNavItem("My Exhibitions");
        setTitleText("My Exhibitions");
    }, []);

    const navigate = useNavigate();



    const handleExhibitionCreate = async(title, privacy) => {
        try {
            await sendAuthenticatedRequest("POST", "/api/user/exhibitions", {title, privacy});
            setDialogIsOpen(false);
            setDialogExhibitionId(null);
            setDialogExhibitionTitle("");
            setDialogExhibitionAccess(null);
            showSnackbar("Exhibition created", "success");
        }
        catch(e) {
            console.log(`Error creating exhibition: ${e.message}`);
            showSnackbar("Error creating exhibition.", "error");
        }
        initializeAppUser();
    };

    const handleExhibitionEditByOwner = async(exhibitionId, title, privacy) => {
        try {
            await sendAuthenticatedRequest("PUT", `/api/user/exhibitions/${exhibitionId}`, {title, privacy});
            setDialogIsOpen(false);
            setDialogExhibitionId(null);
            setDialogExhibitionTitle("");
            setDialogExhibitionAccess(null);
            showSnackbar("Exhibition updated", "success");
        } catch(e) {
            console.log(`Error updating exhibition: ${e.message}`);
            showSnackbar("Error updating exhibition", "error");
        }
        initializeAppUser();
    };

  
    const handleExhibitionDeleteByOwner = async(exhibitionId) => {
        try {
            await sendAuthenticatedRequest("DELETE", `/api/user/exhibitions/${exhibitionId}`);
            setDeleteDialogIsOpen(false);
            setDeleteDialogExhibition(null);
            showSnackbar("Exhibition deleted", "success");
        } catch(e) {
            console.log(`Error deleting exhibition: ${e.message}`);
            showSnackbar("Error deleting exhibition", "error");
        }
        initializeAppUser();
    };

  
    const exhibitionTableFields = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.title}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.title.toLowerCase()
        },
        {
            columnDescription: "Open",
            columnHeaderLabel: "",
            generateTableCell: (exhibition) => (
                <Button variant="outlined" endIcon={<OpenInNewIcon />} href={`/Exhibitions/${exhibition.id}`} target="_blank">
                    <Typography variant="body1">Open</Typography>
                </Button>
            )
        },
        {
            columnDescription: "Date Created",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date (exhibition.date_created).toLocaleString()}</Typography>
            ),
            generateSortableValue: (exhibition) => new Date(exhibition.date_created)
        },
        {
            columnDescription: "Date Modified",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date (exhibition.date_modified).toLocaleString()}</Typography>
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
                <Stack direction="row" spacing={2}>

                    <IconButton 
                        onClick={() => {
                            setDialogIsEditMode(true);
                            setDialogExhibitionId(exhibition.id);
                            setDialogExhibitionAccess(exhibition.privacy);
                            setDialogExhibitionTitle(exhibition.title);
                            setDialogIsOpen(true);
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

  


    return appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) || !appUser.pw_change_required && (
        <Box component={Paper} square sx={{height: "100%"}}>
            <Stack spacing={4} padding={5}>
                <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                        <PhotoCameraBackIcon fontSize="large" />
                        <Typography variant="h4">My Exhibitions</Typography>
                    </Stack>
                    <Button color="primary" disabled={!appUser.can_create_exhibition} variant="contained" startIcon={<AddIcon/>} 
                        onClick={() => {
                            setDialogIsEditMode(false);
                            setDialogExhibitionId(null);
                            setDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">Create Exhibition</Typography>
                    </Button>
                </Stack>
                <Stack direction="column" spacing={2}>
                    {appUser.is_admin && (
                        <Stack direction="row" spacing={2} color="gray">
                            <SecurityIcon color="secondary" />
                            <Typography variant="body1">Restrictions on exhibition creation are removed for administrators.</Typography>
                        </Stack>
                    )}
                    {!appUser.is_admin && appUser.Courses.filter((c) => c.status == "Active").length == 0 && (
                        <Stack direction="row" spacing={2} color="gray">
                            <InfoIcon />
                            <Typography variant="body1">You must be enrolled in at least one active course to create exhibitions.</Typography>
                        </Stack>
                    )}
                    {!appUser.is_admin && appUser.Exhibitions.length >= appUser.exhibition_quota && (
                        <Stack direction="row" spacing={2} color="gray">
                            <InfoIcon />
                            <Typography variant="body1">Your account has reached its exhibition quota.  To create an exhibition, first delete an existing exhibition, or contact your instructor to request a quota increase.</Typography>
                        </Stack>
                    )}
                </Stack>
                <DataTable
                    items={appUser.Exhibitions}
                    visibleItems={appUser.Exhibitions}
                    defaultSortColumn={"Date Modified"}
                    defaultSortAscending={false}
                    tableFields={exhibitionTableFields}
                    emptyMinHeight="400px"
                    NoContentIcon={InfoIcon}
                    noContentMessage="You have no exhibitions."
                    noContentButtonText="View your courses"
                    noContentButtonAction={() => {
                        navigate("/Account/Profile");
                    }}
                />
            </Stack>

            <ItemSingleDeleteDialog 
                deleteDialogIsOpen={deleteDialogIsOpen}
                deleteDialogItem={deleteDialogExhibition}
                dialogTitle="Delete Exhibition"
                requireTypedConfirmation={true}
                entity="exhibition"
                handleDelete={handleExhibitionDeleteByOwner}
                setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            />

            <ExhibitionSettingsDialog editMode={isDialogInEditMode} 
                dialogIsOpen={dialogIsOpen && (isDialogInEditMode || appUser.can_create_exhibition)}
                {...{dialogExhibitionId, dialogExhibitionAccess, setDialogExhibitionAccess, 
                    dialogExhibitionTitle, setDialogExhibitionTitle, 
                    setDialogIsOpen, handleExhibitionCreate, handleExhibitionEdit: handleExhibitionEditByOwner}} />
        </Box>
    );
};

export default MyExhibitions;
