import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Paper,
  Stack,
  TableContainer, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Unauthorized from "../../ErrorPages/Unauthorized";

const PREFIX = "ImageManagement";

const ImageManagement = (props) => {
  const [images, setImages] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  const { user, setUser, selectedNavItem, setSelectedNavItem } = props;
  setSelectedNavItem("Image Management");

  const navigate = useNavigate();

  const imageColumns = {
    id: "ID",
    accessionNumber: "Accession Number",
    title: "Title",
    year: "Year",
    medium: "Medium",
    subject: "Subject",
  };

  if(user.is_admin) {
    useEffect(() => {
      fetchImages();
    }, []); 
  }

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/images');
      const imageData = response.data;
      console.log('Fetched image data:', imageData); 
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/images/${imageToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      if (response.status === 200 || response.status === 204) {
        fetchImages();
      } else {
        console.error("Error deleting image:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmation(false);
      setImageToDelete(null);
    }
  };

  return !user.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  user.is_admin && (
    <div style={{
      marginLeft: '10%',
      marginRight: '10%',
      paddingTop: '20px'
    }}>
        <TableContainer component={Paper} >
          <Table size="small" aria-label="test table">
            <TableHead
              sx={{
                "& th": { fontWeight: "bold" },
                "&": { backgroundColor: "lightgray" },
              }}
            >
              <TableRow>
                <TableCell
                  colSpan={Object.keys(imageColumns).length + 1}
                  align="center"
                  style={{ fontSize: "25px", padding: "15px" }}
                >
                  List of Images
                </TableCell>
              </TableRow>
              <TableRow>
                {Object.keys(imageColumns).map((col) => (
                  <TableCell key={col}>
                    <Typography variant="h6">{imageColumns[col]}</Typography>
                  </TableCell>
                ))}
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:hover": { backgroundColor: "#EEE" } }}>
              {images.data?.map((image) => (
                <TableRow key={image.id}>
                  {Object.keys(imageColumns).map((col) => (
                    <TableCell key={col}>
                      <Typography variant="body1">{image[col]}</Typography>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Stack direction="row">
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => {
                          navigate(`../ImageEdit/${image.id}`);
                        }}
                      >
                        <EditIcon/>
                      </IconButton>
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => {
                          // Set the image to delete and open the confirmation dialog
                          setImageToDelete(image);
                          setDeleteConfirmation(true);
                        }}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <Dialog
              open={deleteConfirmation}
              onClose={() => setDeleteConfirmation(false)}
            >
              <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Delete Image
              </DialogTitle>

              <DialogContent>
                Are you sure you want to delete the image 
                "{imageToDelete?.title}"
                ?
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  onClick={() => setDeleteConfirmation(false)}
                  color="primary"
                  sx={{
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  color="primary"
                  sx={{
                    color: "red",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "red",
                    },
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Table>
        </TableContainer>

      {/* Delete confirmation dialog */}
    </div>
  );
}

export default ImageManagement;
