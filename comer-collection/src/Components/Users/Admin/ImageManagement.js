import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
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

  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const [createDialogImages, createDialogDispatch] = useReducer(createImageDialogReducer, []);

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
    setSelectedNavItem("Image Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []); 


  const fetchData = async () => {
    try {
      const responseImages = await axios.get("http://localhost:9000/api/images", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const imageData = responseImages.data;
      setImages(imageData.data);

      const responseArtists = await axios.get("http://localhost:9000/api/artists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const artistData = responseArtists.data;
      setArtists(artistData.data);

      const responseTags = await axios.get("http://localhost:9000/api/tags", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const tagData = responseTags.data;
      setTags(tagData.data);

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

  const visibleImages = filteredAndSearchedImages.sort((a, b) => {
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
        let filteredImage = filterItemFields(imageFieldDefinitions, newImageData);
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
      setEditDialogFields(getBlankItemFields(imageFieldDefinitions));

      showSnackbar(`Successfully edited image ${imageId}`, "success");

    } catch (error) {
      console.error(`Error editing image ${imageId}: ${error}`);

      showSnackbar(`Error editing for image ${imageId}`, "error");
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

      showSnackbar(`Image ${imageId} has been deleted`, "success")

      if (response.status === 200 || response.status === 204) {
      } else {
        console.error("Error deleting image:", response.statusText);
      }
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
      await axios.post(
        `http://localhost:9000/api/artists/`, filteredArtist,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      showSnackbar(`Artist created`, "success");

    } catch (error) {
      console.error(`Error creating artist: ${error}`);

      showSnackbar(`Error creating artist`, "error");
    }
  }


  
  const handleCreateTag = async(newTag) => {
    try {
      let filteredTag = filterItemFields(tagFieldDefinitions, newTag);
      await axios.post(
        `http://localhost:9000/api/tags/`, filteredTag,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      showSnackbar(`Tag created`, "success");

    } catch (error) {
      console.error(`Error creating tag: ${error}`);

      showSnackbar(`Error creating tag`, "error");
    }
  }

  
  const handleEditArtist = async(artistId, updateFields) => {
    try {
      let filteredartist = filterItemFields(artistFieldDefinitions, updateFields);
      await axios.put(
        `http://localhost:9000/api/artists/${artistId}`, filteredartist,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setArtistEditDialogIsOpen(false);
      setArtistEditDialogFields(getBlankItemFields(artistFieldDefinitions));

      showSnackbar(`Successfully edited artist ${artistId}`, "success");

    } catch (error) {
      console.error(`Error editing artist ${artistId}: ${error}`);

      showSnackbar(`Error editing for artist ${artistId}`, "error");
    }
  }


  
  const handleEditTag = async(tagId, updateFields) => {
    try {
      let filteredtag = filterItemFields(tagFieldDefinitions, updateFields);
      await axios.put(
        `http://localhost:9000/api/tags/${tagId}`, filteredtag,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

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
      await axios.delete(
        `http://localhost:9000/api/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

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
      await axios.delete(
        `http://localhost:9000/api/tags/${tagId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

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
            await axios.put(
              `http://localhost:9000/api/images/${imageId}/artists/${artistId}`, null,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            break;
          case "unassign":
            await axios.delete(
              `http://localhost:9000/api/images/${imageId}/artists/${artistId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
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
    fetchData();

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
            await axios.put(
              `http://localhost:9000/api/images/${imageId}/artists/${artistId}`, null,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            break;
          case "unassign":
            await axios.delete(
              `http://localhost:9000/api/images/${imageId}/artists/${artistId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
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
    fetchData();

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

  const handleAssignImagesToArtist = (artistId, imageIds) => {
    handleManageImagesForArtist("assign", artistId, imageIds);
  }

  const handleUnassignImagesFromArtist = (artistId, imageIds) => {
    handleManageImagesForArtist("unassign", artistId, imageIds);
  }



  
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">ID</Typography>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Name</Typography>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Notes</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">&nbsp;</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">ID</Typography>
        </TableCell>
      ),
      generateTableCell: (tag) => (
        <TableCell>
          <Typography variant="body1">{tag.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Data",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Tag</Typography>
        </TableCell>
      ),
      generateTableCell: (tag) => (
        <TableCell>
          <Typography variant="body1">{tag.data}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Images",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Images</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Notes</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">&nbsp;</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
      columnDescription: "Preview",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6"></Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
      columnDescription: "Artists",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Artists</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
      columnDescription: "Exhibitions",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Exhibitions</Typography>
        </TableCell>
      ),
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
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Options</Typography>
        </TableCell>
      ),
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


  const artistTableFieldsForDialog = [
    {
      columnDescription: "ID",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">ID</Typography>
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.id}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Artist",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
            <Typography variant="h6">Artist</Typography>
        </TableCell>
      ),
      generateTableCell: (artist) => (
        <TableCell>
          <Typography variant="body1">{artist.fullNameReverse ?? `Artist ${artist.id}`}</Typography>
        </TableCell>
      )
    }
  ]


  const artistTableFieldsForDialogAll = [...artistTableFieldsForDialog, {
    columnDescription: "Add",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (artist, extraProperties) => {
      const quantity = extraProperties.getQuantityAssigned(artist);
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
  }]

  const artistTableFieldsForDialogAssigned = [...artistTableFieldsForDialog, {
    columnDescription: "",
    generateTableHeaderCell: () => (
      <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
        <Typography variant="h6">&nbsp;</Typography>
      </TableCell>
    ),
    generateTableCell: (artist, extraProperties) => {
      const quantity = extraProperties.getQuantityAssigned(artist)

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
  }]


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
              setCreateDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">Create Images</Typography>
          </Button>
        </Stack>
      </Stack>
      <DataTable items={images} visibleItems={visibleImages} 
        tableFields={imageTableFields} 
        rowSelectionEnabled={true} 
        selectedItems={selectedImages}
        setSelectedItems={setSelectedImages}
        sx={{gridArea: "table"}}
      />

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
        {...{ createDialogFieldDefinitions, createDialogIsOpen, setCreateDialogIsOpen, createDialogDispatch }} />

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
