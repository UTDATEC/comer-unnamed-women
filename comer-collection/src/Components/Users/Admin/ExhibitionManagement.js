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

  const [sortColumn, setSortColumn] = useState("Modified");
  const [sortAscending, setSortAscending] = useState(false);


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

  const visibleExhibitions = Array.from(exhibitions);


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
      generateTableCell: (exhibition) => (
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{exhibition.id}</Typography>
          </Stack>
        </TableCell>
      ),
      generateSortableValue: (exhibition) => exhibition.id
    },
    {
      columnDescription: "Title",
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
      ),
      generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
    },
    {
      columnDescription: "Owner",
      generateTableCell: (exhibition) => (
        <TableCell>
          <Stack direction="column" paddingTop={1} paddingBottom={1}>
            <Typography variant="body1">{exhibition.User.full_name_reverse}</Typography>
            <Typography variant="body1" sx={{opacity: 0.5}}>{exhibition.User.email}</Typography>
          </Stack>
        </TableCell>
      ),
      generateSortableValue: (exhibition) => exhibition.User.full_name_reverse?.toLowerCase()
    },
    {
      columnDescription: "Created",
      generateTableCell: (exhibition) => (
        <TableCell>
          <Typography variant="body1">{new Date (exhibition.date_created).toLocaleString()}</Typography>
        </TableCell>
      ),
      generateSortableValue: (exhibition) => new Date(exhibition.date_created)
    },
    {
      columnDescription: "Modified",
      generateTableCell: (exhibition) => (
        <TableCell>
          <Typography variant="body1">{new Date (exhibition.date_modified).toLocaleString()}</Typography>
        </TableCell>
      ),
      generateSortableValue: (exhibition) => new Date(exhibition.date_modified)
    },
    {
      columnDescription: "Access",
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
          {...{sortColumn, setSortColumn, sortAscending, setSortAscending}}
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
}


export default ExhibitionManagement;
