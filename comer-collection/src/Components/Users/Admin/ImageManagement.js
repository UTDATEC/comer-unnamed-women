import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Stack,
  Button,
  Typography, useTheme, Box, IconButton, Paper
} from "@mui/material";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog";
import { DataTable } from "../Tools/DataTable";
import { doesItemMatchSearchQuery, searchItems } from "../Tools/SearchUtilities";
import { Navigate, useNavigate } from "react-router";
import { ImageFullScreenViewer } from "../Tools/ImageFullScreenViewer";
import { tagFieldDefinitions } from "../Tools/HelperMethods/fields";
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
import { SelectionSummary } from "../Tools/SelectionSummary";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckIcon from "@mui/icons-material/Check";
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

  const [selectedImages, setSelectedImages] = useState([]);
  
  const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
  const [assignArtistDialogImages, setAssignArtistDialogImages] = useState([]);
  const [artistsByImage, setArtistsByImage] = useState({});
  
  const [assignTagDialogIsOpen, setAssignTagDialogIsOpen] = useState(false);
  const [assignTagDialogImages, setAssignTagDialogImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});

  const [previewerImage, setPreviewerImage] = useState(null);
  const [previewerOpen, setPreviewerOpen] = useState(false);

  const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
  const [artistDeleteDialogIsOpen, setArtistDeleteDialogIsOpen] = useState(false);
  const [artistDeleteDialogItem, setArtistDeleteDialogItem] = useState(null);
  const [artistEditDialogIsOpen, setArtistEditDialogIsOpen] = useState(false);
  const [artistEditDialogItem, setArtistEditDialogItem] = useState(null);
  const [artistDialogSearchQuery, setArtistDialogSearchQuery] = useState("");

  const [manageTagDialogIsOpen, setManageTagDialogIsOpen] = useState(false);
  const [tagDeleteDialogIsOpen, setTagDeleteDialogIsOpen] = useState(false);
  const [tagDeleteDialogItem, setTagDeleteDialogItem] = useState(null);
  const [tagEditDialogIsOpen, setTagEditDialogIsOpen] = useState(false);
  const [tagEditDialogItem, setTagEditDialogItem] = useState(null);
  const [tagDialogSearchQuery, setTagDialogSearchQuery] = useState("");

  const editDialogFieldDefinitions = imageFieldDefinitions;
  const createDialogFieldDefinitions = imageFieldDefinitions;

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

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
      fetchTags();
    }
  }, []); 

  const imageFilterFunction = useCallback((image) => {
    return (
      doesItemMatchSearchQuery(searchQuery, image, ['title', 'valuationNotes', 'otherNotes'])
    )
  }, [searchQuery]);


  const fetchImages = async () => {
    try {
      const imageData = await sendAuthenticatedRequest("GET", "/api/images");
      setImages(imageData.data);

      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);

      const artistsByImageDraft = {}
      for(const i of imageData.data) {
        artistsByImageDraft[i.id] = i.Artists;
      }
      setArtistsByImage({...artistsByImageDraft});

      const tagsByImageDraft = {}
      for(const i of imageData.data) {
        tagsByImageDraft[i.id] = i.Tags;
      }
      setTagsByImage({...tagsByImageDraft});

    } catch (error) {
      return;
    }
  };


  const fetchArtists = async () => {
    try {
      const artistData = await sendAuthenticatedRequest("GET", "/api/artists");
      setArtists(artistData.data);
    } catch (error) {
      return;
    }
  }


  const fetchTags = async () => {
    try {
      const tagData = await sendAuthenticatedRequest("GET", "/api/tags");
      setTags(tagData.data);
    } catch (error) {
      return;
    }
  }



  const handleImagesCreate = async(newImageArray) => {
    let imagesCreated = 0;
    let imageIndicesWithErrors = []
    for(const [i, newImageData] of newImageArray.entries()) {
      try {
        let filteredImage = filterItemFields(imageFieldDefinitions, newImageData);
        await sendAuthenticatedRequest("POST", `/api/images`, filteredImage);

        imagesCreated++;
  
      } catch (error) {
        imageIndicesWithErrors.push(i);
      }
    }
    await fetchImages();

    if(imagesCreated == newImageArray.length) {
      setDialogIsOpen(false);
      showSnackbar(`Successfully created ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "success");

    } else if(imagesCreated < newImageArray.length) {

      if(imagesCreated > 0) {
        showSnackbar(`Created ${imagesCreated} of ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "warning");
      }
      else {
        showSnackbar(`Failed to create ${newImageArray.length} ${newImageArray.length == 1 ? "image" : "images"}`, "error");
      }

    }

    return imageIndicesWithErrors;


  }


  
  const handleImageEdit = async(imageId, updateFields) => {
    try {
      let filteredImage = filterItemFields(imageFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/images/${imageId}`, filteredImage);
      await fetchImages();

      setEditDialogIsOpen(false);

      showSnackbar(`Successfully edited image`, "success");

    } catch (error) {

      showSnackbar(`Error editing for image`, "error");
    }
  }



  const handleDelete = async (imageId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/images/${imageId}`);
      await fetchImages();

      showSnackbar(`Image has been deleted`, "success")

    } catch (error) {

      showSnackbar(`Image could not be deleted`, "error")
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

      showSnackbar(`Error creating artist`, "error");
    }
  }


  
  const handleCreateTag = async(newTag) => {
    try {
      let filteredTag = filterItemFields(tagFieldDefinitions, newTag);
      await sendAuthenticatedRequest("POST", `/api/tags/`, filteredTag);
      fetchTags();

      showSnackbar(`Tag created`, "success");

    } catch (error) {

      showSnackbar(`Error creating tag`, "error");
    }
  }

  
  const handleEditArtist = async(artistId, updateFields) => {
    try {
      let filteredartist = filterItemFields(artistFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}`, filteredartist);
      fetchArtists();

      setArtistEditDialogIsOpen(false);
      showSnackbar(`Successfully edited artist`, "success");

    } catch (error) {

      showSnackbar(`Error editing for artist`, "error");
    }
  }


  
  const handleEditTag = async(tagId, updateFields) => {
    try {
      let filteredtag = filterItemFields(tagFieldDefinitions, updateFields);
      await sendAuthenticatedRequest("PUT", `/api/tags/${tagId}`, filteredtag);
      fetchTags();

      setTagEditDialogIsOpen(false);

      showSnackbar(`Successfully edited tag`, "success");

    } catch (error) {

      showSnackbar(`Error editing for tag`, "error");
    }
  }


  const handleDeleteArtist = async(artistId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/artists/${artistId}`);
      fetchArtists();

      setArtistDeleteDialogIsOpen(false);
      setArtistDeleteDialogItem(null);

      showSnackbar(`Artist deleted`, "success");

    } catch (error) {

      showSnackbar(`Error deleting artist`, "error");
    }
  }

  
  const handleDeleteTag = async(tagId) => {
    try {
      await sendAuthenticatedRequest("DELETE", `/api/tags/${tagId}`);
      fetchTags();

      setTagDeleteDialogIsOpen(false);
      setTagDeleteDialogItem(null);

      showSnackbar(`Tag ${tagId} deleted`, "success");

    } catch (error) {

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
        artistIndicesWithErrors.push(i);
      }
    }
    await fetchImages();

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



  const handleAssignImagesToArtist = useCallback(async(artistId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}/images/assign`, {
        images: imageIds
      });
      showSnackbar(`Successfully assigned artist ${artistId} for ${imageIds.length} images`, "success")

    } catch (error) {
      showSnackbar(`Failed to assign artist ${artistId} for ${imageIds.length} images`, "error")
    }
    await fetchImages();
  }, [showSnackbar]);

  const handleUnassignImagesFromArtist = useCallback(async(artistId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/artists/${artistId}/images/unassign`, {
        images: imageIds
      });
      showSnackbar(`Successfully unassigned artist ${artistId} for ${imageIds.length} images`, "success")

    } catch (error) {
      showSnackbar(`Failed to unassign artist ${artistId} for ${imageIds.length} images`, "error")
    }
    await fetchImages();
  }, [showSnackbar]);

  
  const handleAssignImagesToTag = useCallback(async(tagId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/tags/${tagId}/images/assign`, {
        images: imageIds
      });
      showSnackbar(`Successfully assigned tag ${tagId} for ${imageIds.length} images`, "success")

    } catch (error) {
      showSnackbar(`Failed to assign tag ${tagId} for ${imageIds.length} images`, "error")
    }
    await fetchImages();
  }, [showSnackbar]);

  const handleUnassignImagesFromTag = useCallback(async(tagId, imageIds) => {
    try {
      await sendAuthenticatedRequest("PUT", `/api/tags/${tagId}/images/unassign`, {
        images: imageIds
      });
      showSnackbar(`Successfully unassigned tag ${tagId} for ${imageIds.length} images`, "success")

    } catch (error) {
      showSnackbar(`Failed to unassign tag ${tagId} for ${imageIds.length} images`, "error")
    }
    await fetchImages();
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
        <Typography variant="body1">{artist.id}</Typography>
      ),
      generateSortableValue: (artist) => artist.id
    },
    {
      columnDescription: "Name",
      maxWidth: "300px",
      generateTableCell: (artist) => (
        <Typography variant="body1">{artist.familyName}, {artist.givenName}</Typography>
      ),
      generateSortableValue: (artist) => `${artist.familyName.toLowerCase()}, ${artist.givenName.toLowerCase()}`
    },
    {
      columnDescription: "Images",
      generateTableCell: (artist) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <ImageIcon />
          <Typography variant="body1">{artist.Images.length}</Typography>
        </Stack>
      )
    },
    {
      columnDescription: "Website",
      generateTableCell: (artist) => (
        artist.website && (
          <Button size="small" 
            sx={{textTransform: "unset"}}
            endIcon={<ContentCopyIcon />} onClick={() => {
            handleCopyToClipboard(artist, "website")
          }}>
            <Typography variant="body1">{artist.website}</Typography>
          </Button>
        )
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (artist) => (
        artist.notes && (
          <Typography variant="body1">{artist.notes}</Typography>
        ) || !artist.notes && (
          <Typography variant="body1" sx={{opacity: 0.5}}></Typography>
        )
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (artist) => (
        <Stack direction="row">
          <IconButton
            onClick={(e) => {
              setArtistEditDialogItem(artist);
              const filteredArtist = filterItemFields(artistFieldDefinitions, artist);
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
      )
    }
  ]


  
  const tagTableFields = [
    {
      columnDescription: "ID",
      generateTableCell: (tag) => (
        <Typography variant="body1">{tag.id}</Typography>
      ),
      generateSortableValue: (tag) => tag.id
    },
    {
      columnDescription: "Data",
      maxWidth: "300px",
      generateTableCell: (tag) => (
        <Typography variant="body1">{tag.data}</Typography>
      ),
      generateSortableValue: (tag) => tag.data.toLowerCase()
    },
    {
      columnDescription: "Images",
      generateTableCell: (tag) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <ImageIcon />
          <Typography variant="body1">{tag.Images.length}</Typography>
        </Stack>
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (tag) => (
        tag.notes && (
          <Typography variant="body1">{tag.notes}</Typography>
        ) || !tag.notes && (
          <Typography variant="body1" sx={{opacity: 0.5}}></Typography>
        )
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (tag) => (
        <Stack direction="row">
          <IconButton
            onClick={(e) => {
              setTagEditDialogItem(tag);
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
      )
    }
  ]


  const imageTableFields = [
    {
      columnDescription: "ID",
      generateTableCell: (image) => (
        <Typography variant="body1">{image.id}</Typography>
      ),
      generateSortableValue: (image) => image.id
    },
    {
      columnDescription: "Title",
      generateTableCell: (image) => (
        <Typography variant="body1">{image.title}</Typography>
      ),
      generateSortableValue: (image) => image.title.toLowerCase()
    },
    {
      columnDescription: "Preview",
      generateTableCell: (image) => (
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
      )
    },
    {
      columnDescription: "Accession Number",
      generateTableCell: (image) => (
        <Typography variant="body1">{image.accessionNumber}</Typography>
      ),
      generateSortableValue: (image) => image.accessionNumber?.toLowerCase()
    },
    {
      columnDescription: "Year",
      generateTableCell: (image) => (
        <Typography variant="body1">{image.year}</Typography>
      ),
      generateSortableValue: (image) => image.year
    },
    {
      columnDescription: "Location",
      generateTableCell: (image) => (
        image.location && (
          <Stack direction="row" spacing={1}>
            <PlaceIcon />
            <Typography variant="body1">{image.location}</Typography>
          </Stack>
        )
      )
    },
    {
      columnDescription: "Artists",
      generateTableCell: (image) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="text" 
            color="primary"
            startIcon={<BrushIcon />}
            onClick={() => {
              setAssignArtistDialogImages([image]);
              setAssignArtistDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">{image.Artists.length}</Typography>
          </Button>
        </Stack>
      )
    },
    {
      columnDescription: "Tags",
      generateTableCell: (image) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="text" 
            color="primary"
            startIcon={<SellIcon />}
            onClick={() => {
              setAssignTagDialogImages([image]);
              setAssignTagDialogIsOpen(true);
            }}
          >
            <Typography variant="body1">{image.Tags.length}</Typography>
          </Button>
        </Stack>
      )
    },
    {
      columnDescription: "Exhibitions",
      generateTableCell: (image) => (
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
      )
    },
    {
      columnDescription: "Options",
      generateTableCell: (image) => (
        <Stack direction="row">
          <IconButton 
            onClick={(e) => {
              setEditDialogImage(image);
              const filteredImage = filterItemFields(imageFieldDefinitions, image);
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
      )
    }
  ]


  const artistTableFieldsForDialog = useMemo(() =>[
    {
      columnDescription: "ID",
      generateTableCell: (artist) => (
        <Typography variant="body1">{artist.id}</Typography>
      ),
      generateSortableValue: (artist) => artist.id
    },
    {
      columnDescription: "Artist",
      generateTableCell: (artist) => (
        <Typography variant="body1">{artist.fullNameReverse ?? `Artist ${artist.id}`}</Typography>
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (artist) => (
        <Typography variant="body1">{artist.notes ?? ""}</Typography>
      )
    }
  ], []);


  const tagTableFieldsForDialog = useMemo(() =>[
    {
      columnDescription: "ID",
      generateTableCell: (tag) => (
        <Typography variant="body1">{tag.id}</Typography>
      ),
      generateSortableValue: (tag) => tag.id
    },
    {
      columnDescription: "Tag",
      generateTableCell: (tag) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <SellIcon />
          <Typography variant="body1">{tag.data}</Typography>
        </Stack>
      )
    },
    {
      columnDescription: "Notes",
      generateTableCell: (tag) => (
        <Typography variant="body1">{tag.notes ?? ""}</Typography>
      )
    }
  ], []);
  


  const artistTableFieldsForDialogAll = useMemo(() => [...artistTableFieldsForDialog, {
    columnDescription: "Add",
    generateTableCell: (artist) => {
      const quantity = artist.quantity_assigned;
      return (
        quantity == assignArtistDialogImages.length && (
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
              handleAssignImagesToArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
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
              handleAssignImagesToArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
            }}>
              {assignArtistDialogImages.length - quantity == 1 ? (
                <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more image</Typography>
              ) : (
                <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more images</Typography>
              )}
            </Button>
          )
        )
      }
    }
  ], [assignArtistDialogImages, handleAssignImagesToArtist]);


  const tagTableFieldsForDialogAll = useMemo(() => [...tagTableFieldsForDialog, {
    columnDescription: "Add",
    generateTableCell: (tag) => {
      const quantity = tag.quantity_assigned;
      return (
        quantity == assignTagDialogImages.length && (
          <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
            {assignTagDialogImages.length == 1 ? (
              <Typography variant="body1">Added</Typography>
            ) : (
              <Typography variant="body1">
                {quantity == 2 ? `Added to both images` : `Added to all ${quantity} images`}
              </Typography>
            )}
          </Button>) || 
          quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => {
              handleAssignImagesToTag(tag.id, assignTagDialogImages.map((i) => i.id));
            }}>
              {assignTagDialogImages.length == 1 ? (
                <Typography variant="body1">Add</Typography>
                ) : (
                <Typography variant="body1">Add to {assignTagDialogImages.length} images</Typography>
              )}
            </Button>
          ) || 
          quantity > 0 && quantity < assignTagDialogImages.length && (
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => {
              handleAssignImagesToTag(tag.id, assignTagDialogImages.map((i) => i.id));
            }}>
              {assignTagDialogImages.length - quantity == 1 ? (
                <Typography variant="body1">Add to {assignTagDialogImages.length - quantity} more image</Typography>
              ) : (
                <Typography variant="body1">Add to {assignTagDialogImages.length - quantity} more images</Typography>
              )}
            </Button>
          )
        )
      }
    }
  ], [assignTagDialogImages, handleAssignImagesToTag]);


  const artistTableFieldsForDialogAssigned = useMemo(() => [...artistTableFieldsForDialog, {
    columnDescription: "",
    generateTableCell: (artist) => {
      const quantity = artist.quantity_assigned;
      return (
        quantity == assignArtistDialogImages.length && (
          <Button variant="outlined" startIcon={<PersonRemoveIcon />} onClick={() => {
            handleUnassignImagesFromArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
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
            handleUnassignImagesFromArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
          }}>
            <Typography variant="body1">Remove from {quantity} {quantity == 1 ? "image" : "images"}</Typography>
          </Button>
        )
      )
    }
  }], [assignArtistDialogImages, handleUnassignImagesFromArtist]);


  
  const tagTableFieldsForDialogAssigned = useMemo(() => [...tagTableFieldsForDialog, {
    columnDescription: "",
    generateTableCell: (tag) => {
      const quantity = tag.quantity_assigned;
      return (
        quantity == assignTagDialogImages.length && (
          <Button variant="outlined" startIcon={<RemoveIcon />} onClick={() => {
            handleUnassignImagesFromTag(tag.id, assignTagDialogImages.map((i) => i.id));
          }}>
            {assignTagDialogImages.length == 1 ? (
              <Typography variant="body1">Remove</Typography>
              ) : (
              <Typography variant="body1">Remove from {quantity} images</Typography>
            )}
          </Button>
        ) || 
        quantity > 0 && quantity < assignTagDialogImages.length && (
          <Button variant="outlined" startIcon={<RemoveIcon />} onClick={() => {
            handleUnassignImagesFromTag(tag.id, assignTagDialogImages.map((i) => i.id));
          }}>
            <Typography variant="body1">Remove from {quantity} {quantity == 1 ? "image" : "images"}</Typography>
          </Button>
        )
      )
    }
  }], [assignTagDialogImages, handleUnassignImagesFromTag]);



  const visibleImages = useMemo(() => images.filter((image) => {
    return imageFilterFunction(image);
  }), [images, searchQuery])


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
      
      <DataTable items={images} visibleItems={visibleImages} 
        tableFields={imageTableFields} 
        rowSelectionEnabled={true} 
        selectedItems={selectedImages}
        setSelectedItems={setSelectedImages}
        emptyMinHeight="300px"
        {...visibleImages.length == images.length && {
          noContentMessage: "No images yet",
          noContentButtonAction: () => {setDialogIsOpen(true)},
          noContentButtonText: "Create a user",
          NoContentIcon: InfoIcon
        } || visibleImages.length < images.length && {
          noContentMessage: "No results",
          noContentButtonAction: clearFilters,
          noContentButtonText: "Clear Filters",
          NoContentIcon: SearchIcon
        }}
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
          <Button variant="outlined"
            disabled={selectedImages.length == 0}
            startIcon={<SellIcon />}
            onClick={() => {
            setAssignTagDialogImages([...selectedImages])
            setAssignTagDialogIsOpen(true);
          }}>
            <Typography variant="body1">Manage Tags for {selectedImages.length} {selectedImages.length == 1 ? "image" : "images"}</Typography>
          </Button>
        </Stack>
      </Stack>

      <ItemMultiCreateDialog entity="image"
        dialogTitle={"Create Images"}
        dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
        handleItemsCreate={handleImagesCreate}
        {...{ createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen }} />

      <ItemSingleEditDialog 
        entity="image"
        dialogTitle={"Edit Image"}
        dialogInstructions={"Edit the image fields, then click 'Save'."}
        editDialogItem={editDialogImage}
        handleItemEdit={handleImageEdit}
        {...{ editDialogFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

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


      <AssociationManagementDialog
        primaryEntity="image"
        secondaryEntity="tag"
        primaryItems={assignTagDialogImages}
        secondaryItemsAll={tags}
        secondariesByPrimary={tagsByImage}
        dialogTitle={
          assignTagDialogImages.length == 1 ?
            `Edit Listed Tags for ${assignTagDialogImages[0].title}` :
            `Edit Listed Tags for ${assignTagDialogImages.length} Selected Images`
        }
        dialogButtonForSecondaryManagement={<>
          <Button variant="outlined" onClick={() => {
            setAssignTagDialogIsOpen(false);
            setManageTagDialogIsOpen(true);
          }}>
            <Typography>Go to tag management</Typography>
          </Button>
        </>}
        dialogIsOpen={assignTagDialogIsOpen}
        tableTitleAssigned={
          assignTagDialogImages.length == 1 ?
            `Listed Tags for ${assignTagDialogImages[0].title}` :
            `Listed Tags for Selected Images`
        }
        tableTitleAll={`All Tags`}
        setDialogIsOpen={setAssignTagDialogIsOpen}
        secondaryFieldInPrimary="Tags"
        secondaryTableFieldsAll={tagTableFieldsForDialogAll}
        secondaryTableFieldsAssignedOnly={tagTableFieldsForDialogAssigned}
        secondarySearchFields={['data', 'notes']}
        secondarySearchBoxPlaceholder={"Search tags by name or notes"}
      />


      </Box>

  );
}


export default ImageManagement;
