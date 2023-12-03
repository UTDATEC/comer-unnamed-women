import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Stack,
  Button,
  Typography, useTheme, Box, IconButton, Paper
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
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
import { getBlankItemFields, tagFieldDefinitions } from "../Tools/HelperMethods/fields";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PlaceIcon from "@mui/icons-material/Place";
import SellIcon from "@mui/icons-material/Sell";
import BrushIcon from "@mui/icons-material/Brush";
import ImageIcon from "@mui/icons-material/Image";
import { filterItemFields } from "../Tools/HelperMethods/fields";
import { EntityManageDialog } from "../Tools/Dialogs/EntityManageDialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { imageFieldDefinitions } from "../Tools/HelperMethods/fields";
import { artistFieldDefinitions } from "../Tools/HelperMethods/fields";
import { createImageDialogReducer } from "../Tools/HelperMethods/reducers";
import { SelectionSummary } from "../Tools/SelectionSummary";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import CheckIcon from "@mui/icons-material/Check"
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls";
import { useSnackbar } from "../../App/AppSnackbar";
import { useAppUser } from "../../App/AppUser";


const ImageManagement = (props) => {
  const [images, setImages] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tags, setTags] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteDialogImage, setDeleteDialogImage] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogImage, setEditDialogImage] = useState(null);
  const [editDialogFields, setEditDialogFields] = useState(getBlankItemFields(imageFieldDefinitions));
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  
  const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
  const [assignArtistDialogImages, setAssignArtistDialogImages] = useState([]);
  const [artistsByImage, setArtistsByImage] = useState({});

  const [previewerImage, setPreviewerImage] = useState(null);
  const [previewerOpen, setPreviewerOpen] = useState(false);

  const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
  const [artistDeleteDialogIsOpen, setArtistDeleteDialogIsOpen] = useState(false);
  const [artistDeleteDialogItem, setArtistDeleteDialogItem] = useState(null);
  const [artistEditDialogIsOpen, setArtistEditDialogIsOpen] = useState(false);
  const [artistEditDialogItem, setArtistEditDialogItem] = useState(null);
  const [artistEditDialogFields, setArtistEditDialogFields] = useState(getBlankItemFields(artistFieldDefinitions));
  const [artistEditDialogSubmitEnabled, setArtistEditDialogSubmitEnabled] = useState(false);
  const [artistDialogSearchQuery, setArtistDialogSearchQuery] = useState("");

  const [manageTagDialogIsOpen, setManageTagDialogIsOpen] = useState(false);
  const [tagDeleteDialogIsOpen, setTagDeleteDialogIsOpen] = useState(false);
  const [tagDeleteDialogItem, setTagDeleteDialogItem] = useState(null);
  const [tagEditDialogIsOpen, setTagEditDialogIsOpen] = useState(false);
  const [tagEditDialogItem, setTagEditDialogItem] = useState(null);
  const [tagEditDialogFields, setTagEditDialogFields] = useState(getBlankItemFields(tagFieldDefinitions));
  const [tagEditDialogSubmitEnabled, setTagEditDialogSubmitEnabled] = useState(false);
  const [tagDialogSearchQuery, setTagDialogSearchQuery] = useState("");

  const editDialogFieldDefinitions = imageFieldDefinitions;
  const createDialogFieldDefinitions = imageFieldDefinitions;

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [createDialogImages, createDialogDispatch] = useReducer(createImageDialogReducer, []);

  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setSearchQuery("");
  }


  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { selectedNavItem, setSelectedNavItem } = props;
  const showSnackbar = useSnackbar();
  const theme = useTheme();
  const [appUser, setAppUser] = useAppUser();
  const navigate = useNavigate();
  

  useEffect(() => {
    setSelectedNavItem("Image Management");
    if(appUser.is_admin) {
      fetchImages();
      fetchArtists();
    }
  }, []); 


  const fetchImages = async () => {
    try {
      const imageData = await sendAuthenticatedRequest("GET", "/api/images");
      setImages(imageData.data);

      // const tagData = await sendAuthenticatedRequest("GET", "/api/tags");
      // setTags(tagData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);


      const artistsByImageDraft = {}
      for(const i of imageData.data) {
        artistsByImageDraft[i.id] = i.Artists;
      }
      setArtistsByImage({...artistsByImageDraft});

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const fetchArtists = async () => {
    try {

      const artistData = await sendAuthenticatedRequest("GET", "/api/artists");
      setArtists(artistData.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

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


  const visibleImages = useMemo(() => searchItems(searchQuery, filteredImages, ['title', 'accessionNumber', 'notes']), [filteredImages, searchQuery])


  const handleImagesCreate = async(newImageArray) => {
    let imagesCreated = 0;
    let imageIndicesWithErrors = []
    for(const [i, newImageData] of newImageArray.entries()) {
      try {
        let filteredImage = filterItemFields(imageFieldDefinitions, newImageData);
        await sendAuthenticatedRequest("POST", `/api/images`, filteredImage);

        imagesCreated++;
  
      } catch (error) {
        console.error(`Error creating image ${JSON.stringify(newImageData)}: ${error}`);
        imageIndicesWithErrors.push(i);
      }
    }
    fetchImages();

    if(imagesCreated == newImageArray.length) {
      setDialogIsOpen(false);
      createDialogDispatch({
        type: "set",
        newArray: []
      })

      showSnackbar(`Successfully created ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "success");

    } else if(imagesCreated < newImageArray.length) {

      if(imagesCreated > 0) {
        showSnackbar(`Created ${imagesCreated} of ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "warning");
      }
      else {
        showSnackbar(`Failed to create ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "error");
      }

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
      let filteredImage = filterItemFields(imageFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/images/${imageId}`, filteredImage);
      fetchImages();

      setEditDialogIsOpen(false);
      setEditDialogFields(getBlankItemFields(imageFieldDefinitions));

      showSnackbar(`Successfully edited image ${imageId}`, "success");

    } catch (error) {
      console.error(`Error editing image ${imageId}: ${error}`);

      showSnackbar(`Error editing for image ${imageId}`, "error");
    }
  }



  const handleDelete = async (imageId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/images/${imageId}`);
      fetchImages();

      showSnackbar(`Image ${imageId} has been deleted`, "success")

    } catch (error) {
      console.error("Error handling delete operation:", error);

      showSnackbar(`Image ${imageId} could not be deleted`, "error")
    }

    setDeleteDialogIsOpen(false);
    setDeleteDialogImage(null);
  };


  
  const handleCreateArtist = async(newArtist) => {
    try {
      let filteredArtist = filterItemFields(artistFieldDefinitions, newArtist);
      await sendAuthenticatedRequest("POST", `/api/artists/`, filteredArtist);
      fetchArtists();

      showSnackbar(`Artist created`, "success");

    } catch (error) {
      console.error(`Error creating artist: ${error}`);

      showSnackbar(`Error creating artist`, "error");
    }
  }


  
  const handleCreateTag = async(newTag) => {
    try {
      let filteredTag = filterItemFields(tagFieldDefinitions, newTag);
      await sendAuthenticatedRequest("POST", `/api/tags/`, filteredTag);
      fetchArtists();

      showSnackbar(`Tag created`, "success");

    } catch (error) {
      console.error(`Error creating tag: ${error}`);

      showSnackbar(`Error creating tag`, "error");
    }
  }

  
  const handleEditArtist = async(artistId, updateFields) => {
    try {
      let filteredartist = filterItemFields(artistFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}`, filteredartist);
      fetchArtists();

      setArtistEditDialogIsOpen(false);
      setArtistEditDialogFields(getBlankItemFields(artistFieldDefinitions));
``
      showSnackbar(`Successfully edited artist ${artistId}`, "success");

    } catch (error) {
      console.error(`Error editing artist ${artistId}: ${error}`);

      showSnackbar(`Error editing for artist ${artistId}`, "error");
    }
  }


  
  const handleEditTag = async(tagId, updateFields) => {
    try {
      let filteredtag = filterItemFields(tagFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/tags/${tagId}`, filteredtag);
      fetchArtists();

      setTagEditDialogIsOpen(false);
      setTagEditDialogFields(getBlankItemFields(tagFieldDefinitions));

      showSnackbar(`Successfully edited tag ${tagId}`, "success");

    } catch (error) {
      console.error(`Error editing tag ${tagId}: ${error}`);

      showSnackbar(`Error editing for tag ${tagId}`, "error");
    }
  }


  const handleDeleteArtist = async(artistId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/artists/${artistId}`);
      fetchArtists();

      setArtistDeleteDialogIsOpen(false);
      setArtistDeleteDialogItem(null);

      showSnackbar(`Artist ${artistId} deleted`, "success");

    } catch (error) {
      console.error(`Error deleting artist ${artistId}: ${error}`);

      showSnackbar(`Error deleting artist ${artistId}`, "error");
    }
  }

  
  const handleDeleteTag = async(tagId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/tags/${tagId}`);
      fetchArtists();

      setTagDeleteDialogIsOpen(false);
      setTagDeleteDialogItem(null);

      showSnackbar(`Tag ${tagId} deleted`, "success");

    } catch (error) {
      console.error(`Error deleting tag ${tagId}: ${error}`);

      showSnackbar(`Error deleting tag ${tagId}`, "error");
    }
  }



  const handleManageArtistsForImage = async(operation, imageId, artistIds) => {
    let artistsUpdated = 0;
    let artistIndicesWithErrors = []
    for(const [i, artistId] of artistIds.entries()) {
      try {
        switch (operation) {
          case "assign":
            await sendAuthenticatedRequest("PUT", `/api/images/${imageId}/artists/${artistId}`, null);
            break;
          case "unassign":
            await sendAuthenticatedRequest("DELETE", `/api/images/${imageId}/artists/${artistId}`);
            break;
          default:
            throw Error("Operation must be 'assign' or 'unassign'");
        }
        

        artistsUpdated++;
  
      } catch (error) {
        console.error(`Error ${operation}ing artist ${artistId} for image ${imageId}: ${error}`);
        artistIndicesWithErrors.push(i);
      }
    }
    fetchImages();

    if(artistsUpdated == artistIds.length) {
      showSnackbar(`Successfully ${operation}ed ${artistsUpdated} artists for image ${imageId}`, "success")

    } else if(artistsUpdated < artistIds.length) {

      if(artistsUpdated > 0) {
        showSnackbar(`${artistsUpdated} of ${artistIds.length} ${artistIds.length == 1 ? "artist" : "artists"} ${operation}ed for image ${imageId}`, "warning");
      }
      else {
        showSnackbar(`Failed to ${operation} ${artistIds.length} ${artistIds.length == 1 ? "artist" : "artists"} for image ${imageId}`, "error");
      }

    }
  }

  const handleAssignArtistsToImage = (imageId, artistIds) => {
    handleManageArtistsForImage("assign", imageId, artistIds);
  }

  const handleUnassignArtistsFromImage = (imageId, artistIds) => {
    handleManageArtistsForImage("unassign", imageId, artistIds);
  }



  const handleManageImagesForArtist = async(operation, artistId, imageIds) => {
    let imagesUpdated = 0;
    let imageIndicesWithErrors = []
    for(const [i, imageId] of imageIds.entries()) {
      try {
        switch (operation) {
          case "assign":
            await sendAuthenticatedRequest("PUT", `/api/images/${imageId}/artists/${artistId}`, null);
            break;
          case "unassign":
            await sendAuthenticatedRequest("DELETE", `/api/images/${imageId}/artists/${artistId}`);
            break;
          default:
            throw Error("Operation must be 'assign' or 'unassign'");
        }
        

        imagesUpdated++;
  
      } catch (error) {
        console.error(`Error ${operation}ing artist ${artistId} for image ${imageId}: ${error}`);
        imageIndicesWithErrors.push(i);
      }
    }
    fetchImages();

    if(imagesUpdated == imageIds.length) {
      showSnackbar(`Successfully ${operation}ed ${imagesUpdated} artists for artist ${artistId}`, "success")

    } else if(imagesUpdated < imageIds.length) {

      if(imagesUpdated > 0) {
        showSnackbar(`${imagesUpdated} of ${imageIds.length} ${imageIds.length == 1 ? "image" : "images"} ${operation}ed for artist ${artistId}`, "warning");
      }
      else {
        showSnackbar(`Failed to ${operation} ${imageIds.length} ${imageIds.length == 1 ? "image" : "images"} for artist ${artistId}`, "error");
      }

    }
  }

  const handleAssignImagesToArtist = useCallback(async(artistId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}/images/assign`, {
        images: imageIds
      });
      showSnackbar(`Successfully assigned artist ${artistId} for ${imageIds.length} images`, "success")

    } catch (error) {
      console.error(`Error assigning artist for images ${JSON.stringify(imageIds)}: ${error}`);
      showSnackbar(`Failed to assign artist ${artistId} for ${imageIds.length} images`, "error")
    }
    fetchImages();
  }, [showSnackbar]);

  const handleUnassignImagesFromArtist = useCallback(async(artistId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}/images/unassign`, {
        images: imageIds
      });
      showSnackbar(`Successfully unassigned artist ${artistId} for ${imageIds.length} images`, "success")

    } catch (error) {
      console.error(`Error unassigning artist for images ${JSON.stringify(imageIds)}: ${error}`);
      showSnackbar(`Failed to unassign artist ${artistId} for ${imageIds.length} images`, "error")
    }
    fetchImages();
  }, [showSnackbar]);



  
  const handleCopyToClipboard = useCallback((item, fieldName) => {
    try {
      navigator.clipboard.writeText(item[fieldName]);
      showSnackbar(`Text copied to clipboard`, "success")

    } catch (error) {
      showSnackbar(`Error copying text to clipboard`, "error")
    }
  }, [])


  const artistTableFields = [
    {
      columnDescription: "ID",
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Name",
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.familyName}, {artist.givenName}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Images",
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
      generateTableCell: (artist) => (
        <TableCell>
          {artist.notes && (
            <Typography variant="body1">{artist.notes}</Typography>
          ) || !artist.notes && (
            <Typography variant="body1" sx={{opacity: 0.5}}></Typography>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (artist) => (
        <TableCell>
          <Stack direction="row">
            <IconButton
              onClick={(e) => {
                setArtistEditDialogItem(artist);
                const filteredArtist = filterItemFields(artistFieldDefinitions, artist);
                setArtistEditDialogFields(filteredArtist);
                setArtistEditDialogSubmitEnabled(true);
                setArtistEditDialogIsOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              disabled={!artist.is_deletable} 
              onClick={(e) => {
                setArtistDeleteDialogItem(artist);
                setArtistDeleteDialogIsOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </TableCell>
      )
    }
  ]


  
  const tagTableFields = [
    {
      columnDescription: "ID",
      generateTableCell: (tag) => (
        <TableCell>
          <Typography variant="body1">{tag.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Data",
      generateTableCell: (tag) => (
        <TableCell>
          <Typography variant="body1">{tag.data}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Images",
      generateTableCell: (tag) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon />
            <Typography variant="body1">{tag.Images.length}</Typography>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (tag) => (
        <TableCell>
          {tag.notes && (
            <Typography variant="body1">{tag.notes}</Typography>
          ) || !tag.notes && (
            <Typography variant="body1" sx={{opacity: 0.5}}></Typography>
          )}
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (tag) => (
        <TableCell>
          <Stack direction="row">
            <IconButton
              onClick={(e) => {
                setTagEditDialogItem(tag);
                const filteredTag = filterItemFields(tagFieldDefinitions, tag);
                setTagEditDialogFields(filteredTag);
                setTagEditDialogSubmitEnabled(true);
                setTagEditDialogIsOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              disabled={!tag.is_deletable} 
              onClick={(e) => {
                setTagDeleteDialogItem(tag);
                setTagDeleteDialogIsOpen(true);
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
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.id}</Typography>
        </TableCell>
      ),
      generateSortableValue: (image) => image.id
    },
    {
      columnDescription: "Title",
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.title}</Typography>
        </TableCell>
      ),
      generateSortableValue: (image) => image.title.toLowerCase()
    },
    {
      columnDescription: "Preview",
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row" sx={{height: "50px", maxWidth: "100px"}} 
            justifyContent="center" alignItems="center">
          {(image.thumbnailUrl) && (
            <Button 
              onClick={() => {
                setPreviewerImage(image);
                setPreviewerOpen(true);
              }}
            >
            <img height="50px" src={image.thumbnailUrl} loading="lazy" />
            </Button>
          ) || image.url && (
            <Button variant="outlined" color="primary" 
              startIcon={<VisibilityIcon />}
              onClick={() => {
                setPreviewerImage(image);
                setPreviewerOpen(true);
              }}
            >
              <Typography variant="body1">View</Typography>
            </Button>
          )}
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Accession Number",
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.accessionNumber}</Typography>
        </TableCell>
      ),
      generateSortableValue: (image) => image.accessionNumber?.toLowerCase()
    },
    {
      columnDescription: "Year",
      generateTableCell: (image) => (
        <TableCell>
          <Typography variant="body1">{image.year}</Typography>
        </TableCell>
      ),
      generateSortableValue: (image) => image.year
    },
    {
      columnDescription: "Location",
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
      columnDescription: "Artists",
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color="primary"
              startIcon={<BrushIcon />}
              onClick={() => {
                setAssignArtistDialogImages([image]);
                setAssignArtistDialogIsOpen(true);
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
      columnDescription: "Exhibitions",
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="text" 
              color="primary"
              disabled startIcon={<PhotoCameraBackIcon />}
              onClick={() => {
                // setAssignCourseDialogUser(user);
                // setAssignCourseDialogCourses([...user.Courses]);
                // setAssignCourseDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">{image.Exhibitions.length}</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (image) => (
        <TableCell>
          <Stack direction="row">
            <IconButton 
              onClick={(e) => {
                setEditDialogImage(image);
                const filteredImage = filterItemFields(imageFieldDefinitions, image);
                setEditDialogFields(filteredImage);
                setEditDialogSubmitEnabled(true);
                setEditDialogIsOpen(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              disabled={!image.is_deletable} 
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


  const artistTableFieldsForDialog = useMemo(() =>[
    {
      columnDescription: "ID",
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.id}</Typography>
        </TableCell>
      ),
      generateSortableValue: (artist) => artist.id
    },
    {
      columnDescription: "Artist",
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.fullNameReverse ?? `Artist ${artist.id}`}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.notes ?? ""}</Typography>
        </TableCell>
      )
    }
  ], []);
  


  const artistTableFieldsForDialogAll = useMemo(() => [...artistTableFieldsForDialog, {
    columnDescription: "Add",
    generateTableCell: (artist, extraProperties) => {
      const quantity = artist.quantity_assigned;
      return (
      <TableCell>
        {quantity == assignArtistDialogImages.length && (
          <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
            {assignArtistDialogImages.length == 1 ? (
              <Typography variant="body1">Added</Typography>
            ) : (
              <Typography variant="body1">
                {quantity == 2 ? `Added to both images` : `Added to all ${quantity} images`}
              </Typography>
            )}
          </Button>) || 
          quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignImagesToArtist(artist.id, extraProperties.primaryItems.map((i) => i.id));
            }}>
              {assignArtistDialogImages.length == 1 ? (
                <Typography variant="body1">Add</Typography>
                ) : (
                <Typography variant="body1">Add to {assignArtistDialogImages.length} images</Typography>
              )}
            </Button>
          ) || 
          quantity > 0 && quantity < assignArtistDialogImages.length && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
              handleAssignImagesToArtist(artist.id, extraProperties.primaryItems.map((i) => i.id));
            }}>
              {assignArtistDialogImages.length - quantity == 1 ? (
                <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more image</Typography>
              ) : (
                <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more images</Typography>
              )}
            </Button>
          )
        }
      </TableCell>
    )}
  }], [assignArtistDialogImages, handleAssignImagesToArtist]);

  const artistTableFieldsForDialogAssigned = useMemo(() => [...artistTableFieldsForDialog, {
    columnDescription: "",
    generateTableCell: (artist, extraProperties) => {
      const quantity = artist.quantity_assigned;
      return (
        <TableCell>
          {quantity == assignArtistDialogImages.length && (
              <Button variant="outlined" startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignImagesFromArtist(artist.id, extraProperties.primaryItems.map((i) => i.id));
              }}>
                {assignArtistDialogImages.length == 1 ? (
                  <Typography variant="body1">Remove</Typography>
                  ) : (
                  <Typography variant="body1">Remove from {quantity} images</Typography>
                )}
              </Button>
            ) || 
            quantity > 0 && quantity < assignArtistDialogImages.length && (
              <Button variant="outlined" startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignImagesFromArtist(artist.id, extraProperties.primaryItems.map((i) => i.id));
              }}>
                <Typography variant="body1">Remove from {quantity} {quantity == 1 ? "image" : "images"}</Typography>
              </Button>
            )
          }
        </TableCell>
      )
    }
  }], [assignArtistDialogImages, handleUnassignImagesFromArtist]);



  const imageDataTable = useMemo(() => {
    console.log("Running imageDataTable")
    return (
      <DataTable visibleItems={visibleImages} 
        {...{sortColumn, setSortColumn, sortAscending, setSortAscending}}
        tableFields={imageTableFields} 
        rowSelectionEnabled={true} 
        selectedItems={selectedImages}
        setSelectedItems={setSelectedImages}
        // sx={{gridArea: "table"}}
      />
    )
  }, [visibleImages, selectedImages, sortColumn, sortAscending]);



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
        <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search image fields and notes" width="30%" />
        <Stack direction="row" spacing={2}>
          <Button color="primary" variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
            setRefreshInProgress(true);
            fetchImages();
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
              setManageTagDialogIsOpen(true);
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
              setDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">Create Images</Typography>
          </Button>
        </Stack>
      </Stack>
      
      {imageDataTable}

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{gridArea: "bottom"}}>
        <SelectionSummary
          items={images}
          selectedItems={selectedImages}
          setSelectedItems={setSelectedImages}
          visibleItems={visibleImages}
          entitySingular="image"
          entityPlural="images"
        />
        <Stack direction="row" spacing={2} >
          <Button variant="outlined"
            disabled={selectedImages.length == 0}
            startIcon={<BrushIcon />}
            onClick={() => {
            setAssignArtistDialogImages([...selectedImages])
            setAssignArtistDialogIsOpen(true);
          }}>
            <Typography variant="body1">Manage Credits for {selectedImages.length} {selectedImages.length == 1 ? "image" : "images"}</Typography>
          </Button>
        </Stack>
      </Stack>

      <ItemMultiCreateDialog entity="image"
        dialogTitle={"Create Images"}
        dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
        createDialogItems={createDialogImages}
        handleItemsCreate={handleImagesCreate}
        {...{ createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen, createDialogDispatch }} />

      <ItemSingleEditDialog 
        entity="image"
        dialogTitle={"Edit Image"}
        dialogInstructions={"Edit the image fields, then click 'Save'."}
        editDialogItem={editDialogImage}
        handleItemEdit={handleImageEdit}
        {...{ editDialogFieldDefinitions, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled }} />

      <ItemSingleDeleteDialog 
        entity="image"
        dialogTitle="Delete Image"
        deleteDialogItem={deleteDialogImage}
        {...{ deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }} />


      <EntityManageDialog 
        entitySingular="artist" entityPlural="artists"
        dialogTitle="Manage Artists"
        dialogInstructionsTable="Edit or delete existing artists"
        dialogInstructionsForm="Create a new artist"
        dialogItems={artists}
        setDialogItems={setArtists}
        dialogFieldDefinitions={artistFieldDefinitions}
        dialogTableFields={artistTableFields}
        dialogIsOpen={manageArtistDialogIsOpen}
        setDialogIsOpen={setManageArtistDialogIsOpen}
        handleItemCreate={handleCreateArtist}
        handleItemEdit={handleEditArtist}
        handleItemDelete={handleDeleteArtist}
        searchBoxFields={['fullName', 'fullNameReverse', 'notes']}
        searchBoxPlaceholder="Search artists by name or notes"
        internalDeleteDialogIsOpen={artistDeleteDialogIsOpen}
        setInternalDeleteDialogIsOpen={setArtistDeleteDialogIsOpen}
        internalDeleteDialogItem={artistDeleteDialogItem}
        setInternalDeleteDialogItem={setArtistDeleteDialogItem}
        internalEditDialogIsOpen={artistEditDialogIsOpen}
        setInternalEditDialogIsOpen={setArtistEditDialogIsOpen}
        internalEditDialogItem={artistEditDialogItem}
        setInternalEditDialogItem={setArtistEditDialogItem}
        internalEditDialogFields={artistEditDialogFields}
        setInternalEditDialogFields={setArtistEditDialogFields}
        internalEditDialogSubmitEnabled={artistEditDialogSubmitEnabled}
        setInternalEditDialogSubmitEnabled={setArtistEditDialogSubmitEnabled}
        itemSearchQuery={artistDialogSearchQuery}
        setItemSearchQuery={setArtistDialogSearchQuery}
      />

      <EntityManageDialog 
        entitySingular="tag" entityPlural="tags"
        dialogTitle="Manage Tags"
        dialogInstructionsTable="Edit or delete existing tags"
        dialogInstructionsForm="Create a new tag"
        dialogItems={tags}
        setDialogItems={setTags}
        dialogFieldDefinitions={tagFieldDefinitions}
        dialogTableFields={tagTableFields}
        dialogIsOpen={manageTagDialogIsOpen}
        setDialogIsOpen={setManageTagDialogIsOpen}
        handleItemCreate={handleCreateTag}
        handleItemEdit={handleEditTag}
        handleItemDelete={handleDeleteTag}
        searchBoxFields={['data', 'notes']}
        searchBoxPlaceholder="Search tags by name or notes"
        internalDeleteDialogIsOpen={tagDeleteDialogIsOpen}
        setInternalDeleteDialogIsOpen={setTagDeleteDialogIsOpen}
        internalDeleteDialogItem={tagDeleteDialogItem}
        setInternalDeleteDialogItem={setTagDeleteDialogItem}
        internalEditDialogIsOpen={tagEditDialogIsOpen}
        setInternalEditDialogIsOpen={setTagEditDialogIsOpen}
        internalEditDialogItem={tagEditDialogItem}
        setInternalEditDialogItem={setTagEditDialogItem}
        internalEditDialogFields={tagEditDialogFields}
        setInternalEditDialogFields={setTagEditDialogFields}
        internalEditDialogSubmitEnabled={tagEditDialogSubmitEnabled}
        setInternalEditDialogSubmitEnabled={setTagEditDialogSubmitEnabled}
        itemSearchQuery={tagDialogSearchQuery}
        setItemSearchQuery={setTagDialogSearchQuery}
      />

      <ImageFullScreenViewer 
        image={previewerImage} 
        setImage={setPreviewerImage}
        previewerOpen={previewerOpen}
        setPreviewerOpen={setPreviewerOpen}
      />


      <AssociationManagementDialog
        primaryEntity="image"
        secondaryEntity="artist"
        primaryItems={assignArtistDialogImages}
        secondaryItemsAll={artists}
        secondariesByPrimary={artistsByImage}
        dialogTitle={
          assignArtistDialogImages.length == 1 ?
            `Edit Listed Artists for ${assignArtistDialogImages[0].title}` :
            `Edit Listed Artists for ${assignArtistDialogImages.length} Selected Images`
        }
        dialogButtonForSecondaryManagement={<>
          <Button variant="outlined" onClick={() => {
            // navigate('/Account/UserManagement')
            setAssignArtistDialogIsOpen(false);
            setManageArtistDialogIsOpen(true);
          }}>
            <Typography>Go to artist management</Typography>
          </Button>
        </>}
        dialogIsOpen={assignArtistDialogIsOpen}
        tableTitleAssigned={
          assignArtistDialogImages.length == 1 ?
            `Listed Artists for ${assignArtistDialogImages[0].title}` :
            `Listed Artists for Selected Images`
        }
        tableTitleAll={`All Artists`}
        setDialogIsOpen={setAssignArtistDialogIsOpen}
        secondaryFieldInPrimary="Artists"
        secondaryTableFieldsAll={artistTableFieldsForDialogAll}
        secondaryTableFieldsAssignedOnly={artistTableFieldsForDialogAssigned}
        secondarySearchFields={['fullName', 'fullNameReverse', 'notes']}
        secondarySearchBoxPlaceholder={"Search artists by name or notes"}
      />


      </Box>

  );
}


export default ImageManagement;
