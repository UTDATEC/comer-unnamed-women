import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
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
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { searchItems } from "../Tools/SearchUtilities";
import { Navigate, useNavigate } from "react-router";
import { ImageFullScreenViewer } from "../Tools/ImageFullScreenViewer";
import { getBlankItemFields } from "../Tools/HelperMethods";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HeightIcon from "@mui/icons-material/Height";
import PlaceIcon from "@mui/icons-material/Place";
import SellIcon from "@mui/icons-material/Sell";
import BrushIcon from "@mui/icons-material/Brush"
import ImageIcon from "@mui/icons-material/Image"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { filterItemFields } from "../Tools/HelperMethods";
import { EntityManageDialog } from "../Tools/Dialogs/EntityManageDialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


const artistFieldNames = [
  {
    fieldName: "familyName",
    displayName: "Last Name",
    isRequired: true
  },
  {
    fieldName: "givenName",
    displayName: "First Name",
    isRequired: true
  },
  {
    fieldName: "website",
    displayName: "Website",
    isRequired: false,
    inputType: "url"
  },
  {
    fieldName: "notes",
    displayName: "Notes",
    isRequired: false,
    inputType: "textarea"
  }
]

const imageFieldNames = [
  {
    fieldName: "title",
    displayName: "Image Title",
    isRequired: true
  },
  {
    fieldName: "accessionNumber",
    displayName: "Accession Number",
    isRequired: false
  },
  {
    fieldName: "year",
    displayName: "Year",
    isRequired: false,
    inputType: "number"
  },
  {
    fieldName: "additionalPrintYear",
    displayName: "Additional Print Year",
    isRequired: false,
    inputType: "number"
  },
  {
    fieldName: "url",
    displayName: "URL",
    inputType: "url",
    multiline: true
  },
  {
    fieldName: "medium",
    displayName: "Medium",
    isRequired: false
  },
  {
    fieldName: "width",
    displayName: "Image Width",
    isRequired: true,
    inputType: "number"
  },
  {
    fieldName: "height",
    displayName: "Image Height",
    isRequired: true,
    inputType: "number"
  },
  {
    fieldName: "matWidth",
    displayName: "Mat Width",
    inputType: "number"
  },
  {
    fieldName: "matHeight",
    displayName: "Mat Height",
    inputType: "number"
  },
  {
    fieldName: "location",
    displayName: "Location",
    isRequired: false
  },
  {
    fieldName: "condition",
    displayName: "Condition",
    inputType: "textarea"
  },
  {
    fieldName: "valuationNotes",
    displayName: "Valuation Notes",
    inputType: "textarea",
    multiline: true
  },
  {
    fieldName: "otherNotes",
    displayName: "Other Notes",
    inputType: "textarea",
    multiline: true
  },
  {
    fieldName: "copyright",
    displayName: "Copyright",
    inputType: "textarea",
    multiline: true
  },
  {
    fieldName: "subject",
    displayName: "Subject",
    inputType: "textarea",
    multiline: true
  }
]


const createImageDialogReducer = (createDialogImages, action) => {
  switch (action.type) {
    case 'add':
      return [...createDialogImages, {
        name: "",
        date_start: "",
        date_end: "",
        notes: ""
      }]

    case 'change':
      return createDialogImages.map((r, i) => {
        if(action.index == i)
          return {...r, [action.field]: action.newValue};
        else
          return r;
      })
      
    case 'remove':
      return createDialogImages.filter((r, i) => {
        return action.index != i;
      })

    case 'set':
      return action.newArray;
  
    default:
      throw Error("Unknown action type");
  }
}

const ImageManagement = (props) => {
  const [images, setImages] = useState([]);
  const [artists, setArtists] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogImage, setDeleteDialogImage] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogImage, setEditDialogImage] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState(getBlankItemFields(imageFieldNames));
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const [backdropImage, setBackdropImage] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
  

  const editDialogFieldNames = imageFieldNames;
  const createDialogFieldNames = imageFieldNames;

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogImages, createDialogDispatch] = useReducer(createImageDialogReducer, []);

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
    setSelectedNavItem("Image Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []); 


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/images", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const imageData = response.data;
      setImages(imageData.data);

      const response2 = await axios.get("http://localhost:9000/api/artists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const artistData = response2.data;
      setArtists(artistData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /*
    Image display:
    Step 1: apply column filters
    Step 2: apply search query
    Step 3: apply sorting order
  */

  const filterImages = () => {
    return images.filter((image) => {
      return true;
      // return (
      //   // filter by image type
      //   !imageTypeFilter || imageTypeFilter == "Administrator" && image.is_admin || imageTypeFilter == "Curator" && !image.is_admin
      // ) && (
      //   // filter by image activation status
      //   !imageActivationStatusFilter || imageActivationStatusFilter == "Active" && image.is_active || imageActivationStatusFilter == "Inactive" && !image.is_active
      // ) && (
      //   // filter by password type
      //   !imagePasswordTypeFilter || imagePasswordTypeFilter == "Temporary" && image.pw_temp || imagePasswordTypeFilter == "Permanent" && !image.pw_temp
      // )
    })
  }


  const filteredImages = useMemo(() => filterImages(
    // 
  ), [
    images
  ])


  const filteredAndSearchedImages = useMemo(() => searchItems(searchQuery, filteredImages, ['title', 'accessionNumber', 'notes']), [filteredImages, searchQuery])

  const imagesToDisplay = filteredAndSearchedImages.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  

  const handleDeleteClick = (imageId) => {
    setDeleteDialogImage({ imageId });
    setDeleteDialogIsOpen(true);
  };


  const handleImagesCreate = async(newImageArray) => {
    let imagesCreated = 0;
    let imageIndicesWithErrors = []
    for(const [i, newImageData] of newImageArray.entries()) {
      try {
        let filteredImage = filterItemFields(imageFieldNames, newImageData);
        await axios.post(
          `http://localhost:9000/api/images`, filteredImage,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        imagesCreated++;
  
      } catch (error) {
        console.error(`Error creating image ${JSON.stringify(newImageData)}: ${error}`);
        imageIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(imagesCreated == newImageArray.length) {
      setCreateDialogIsOpen(false);
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      setSnackbarText(`Successfully created ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } else if(imagesCreated < newImageArray.length) {

      if(imagesCreated > 0) {
        setSnackbarText(`Created ${imagesCreated} of ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`)
        setSnackbarSeverity("warning");
      }
      else {
        setSnackbarText(`Failed to create ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`)
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);

      createDialogDispatch({
        type: "set",
        newArray: newImageArray.filter((u, i) => {
          return imageIndicesWithErrors.includes(i);
        })
      })
    }


  }


  
  const handleImageEdit = async(imageId, updateFields) => {
    try {
      let filteredImage = filterItemFields(imageFieldNames, updateFields);
      await axios.put(
        `http://localhost:9000/api/images/${imageId}`, filteredImage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setEditDialogIsOpen(false);
      setEditDialogFields(getBlankItemFields(imageFieldNames));

      setSnackbarText(`Successfully edited image ${imageId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error editing image ${imageId}: ${error}`);

      setSnackbarText(`Error editing for image ${imageId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }



  const handleDelete = async (imageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarSeverity("success")
      setSnackbarText(`Image ${imageId} has been deleted`);
      setSnackbarOpen(true);

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting image:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);

      setSnackbarSeverity("error")
      setSnackbarText(`Image ${imageId} could not be deleted`);
      setSnackbarOpen(true);
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogImage(null);
  };


  
  const handleCreateArtist = async(newArtist) => {
    try {
      let filteredArtist = filterItemFields(artistFieldNames, newArtist);
      await axios.post(
        `http://localhost:9000/api/artists/`, filteredArtist,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`Artist created`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error creating artist: ${error}`);

      setSnackbarText(`Error creating artist`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  
  const handleDeleteArtist = async(artistId) => {
    try {
      await axios.delete(
        `http://localhost:9000/api/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`Artist ${artistId} deleted`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error deleting artist ${artistId}: ${error}`);

      setSnackbarText(`Error deleting artist ${artistId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  
  const handleCopyToClipboard = useCallback((item, fieldName) => {
    try {
      navigator.clipboard.writeText(item[fieldName]);
      setSnackbarSeverity("success")
      setSnackbarText(`Text copied to clipboard`);

      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error")
      setSnackbarText(`Error copying text to clipboard`);
      setSnackbarOpen(true);
    }
  }, [])


  const artistTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.id}</Typography>
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
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.familyName}, {artist.givenName}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Images",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Images</Typography>
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon />
            <Typography variant="body1">{artist.Images.length}</Typography>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Website",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Website</Typography>
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          {artist.website && (
            <Button size="small" 
              sx={{textTransform: "unset"}}
              endIcon={<ContentCopyIcon />} onClick={() => {
              handleCopyToClipboard(artist, "website")
            }}>
              <Typography variant="body1">{artist.website}</Typography>
            </Button>
          )}
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
      generateTableCell: (artist) => (
        <TableCell>
          {artist.notes && (
            <Typography variant="body1">{artist.notes}</Typography>
          ) || !artist.notes && (
            <Typography variant="body1" sx={{opacity: 0.5}}>None</Typography>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">&nbsp;</Typography>
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          <Stack direction="row">
            <IconButton disabled
              onClick={(e) => {
                // setEditDialogImage(image);
                // const filteredImage = filterItemFields(imageFieldNames, image);
                // setEditDialogFields(filteredImage);
                // setEditDialogSubmitEnabled(true);
                // setEditDialogIsOpen(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              // disabled={course.Users.length > 0} 
              onClick={(e) => {
                handleDeleteArtist(artist.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </TableCell>
      )
    }
  ]


  const imageTableFields = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Title",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
            <ColumnSortButton columnName="Title" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.title}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Accession Number",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
            <ColumnSortButton columnName="Acc No" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.accessionNumber}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Year",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Year</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.year}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Location",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Location</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          {image.location && (
            <Stack direction="row" spacing={1}>
              <PlaceIcon />
              <Typography variant="body1">{image.location}</Typography>
            </Stack>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Dimensions",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Dimensions</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1} sx={{width: "100%"}}>
              <HeightIcon sx={{transform: "rotate(90deg)"}} />
              <Typography variant="body1">{parseFloat(image.width)} in.</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{width: "100%"}}>
              <HeightIcon />
              <Typography variant="body1">{parseFloat(image.height)} in.</Typography>
            </Stack>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Artists",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Artists</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color="primary"
              disabled startIcon={<BrushIcon />}
              onClick={() => {
                // setAssignCourseDialogUser(user);
                // setAssignCourseDialogCourses([...user.Courses]);
                // setAssignCourseDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{image.Artists.length}</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Tags",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">Tags</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color="primary"
              disabled startIcon={<SellIcon />}
              onClick={() => {
                // setAssignCourseDialogUser(user);
                // setAssignCourseDialogCourses([...user.Courses]);
                // setAssignCourseDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{image.Tags.length}</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "View",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: "#CCC"}}>
          <Typography variant="h6">&nbsp;</Typography>
        </TableCell>
      ),
      generateTableCell: (image) => (
        <TableCell>
          {image.url && (
            <Button variant="outlined" color="primary" 
              startIcon={<VisibilityIcon />}
              onClick={() => {
                setBackdropImage(image);
                setBackdropOpen(true);
              }}
            >
              <Typography variant="body1">View</Typography>
            </Button>
          )}
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
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row">
            <IconButton 
              onClick={(e) => {
                setEditDialogImage(image);
                const filteredImage = filterItemFields(imageFieldNames, image);
                setEditDialogFields(filteredImage);
                setEditDialogSubmitEnabled(true);
                setEditDialogIsOpen(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              // disabled={course.Users.length > 0} 
              onClick={(e) => {
                setDeleteDialogImage(image);
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


  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) ||
  appUser.is_admin && (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={2} padding={2}>
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search image fields and notes" width="30%" />
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
            <Button color="primary" variant="outlined" startIcon={<SellIcon />}
              onClick={() => {
                // setCreateDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Tags</Typography>
            </Button>
            <Button color="primary" variant="outlined" startIcon={<BrushIcon />}
              onClick={() => {
                setManageArtistDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Artists</Typography>
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddPhotoAlternateIcon/>}
              onClick={() => {
                setCreateDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Images</Typography>
            </Button>
          </Stack>
        </Stack>
        <DataTable items={imagesToDisplay} tableFields={imageTableFields} rowSelectionEnabled={true} />
          {
            imagesToDisplay.length == 0 && (
              <Box sx={{width: '100%'}}>
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                  <SearchIcon sx={{fontSize: '150pt', opacity: 0.5}} />
                  <Typography variant="h4">No images found</Typography>
                  <Button variant="contained" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}>
                    <Typography variant="body1">Clear Filters</Typography>
                  </Button>
                </Stack>
              </Box>
            )
          }

      <ItemMultiCreateDialog entity="image" 
        dialogTitle={"Create Images"}
        dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
        createDialogItems={createDialogImages}
        handleItemsCreate={handleImagesCreate}
        {...{ createDialogFieldNames, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

      <ItemSingleEditDialog 
        entity="image"
        dialogTitle={"Edit Image"}
        dialogInstructions={"Edit the image fields, then click 'Save'."}
        editDialogItem={editDialogImage}
        handleItemEdit={handleImageEdit}
        {...{ editDialogFieldNames, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} />

      <ItemSingleDeleteDialog 
        entity="image"
        dialogTitle="Delete Image"
        deleteDialogItem={deleteDialogImage}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />


      <EntityManageDialog 
        entity="artist"
        dialogTitle="Manage Artists"
        dialogInstructionsTable="Edit or delete existing artists."
        dialogInstructionsForm="Create new artists."
        dialogItems={artists}
        setDialogItems={setArtists}
        dialogFieldNames={artistFieldNames}
        dialogTableFields={artistTableFields}
        dialogIsOpen={manageArtistDialogIsOpen}
        setDialogIsOpen={setManageArtistDialogIsOpen}
        handleItemCreate={handleCreateArtist}
        handleItemEdit={null}
        handleItemDelete={null}
      />

      <ImageFullScreenViewer 
        image={backdropImage} 
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
      />

    </>
  );
}


export default ImageManagement;
