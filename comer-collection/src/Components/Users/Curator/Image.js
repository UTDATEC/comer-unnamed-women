import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconButton,
  Paper,
  TableContainer,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PREFIX = "ImageList";

const classes = {
  root: `${PREFIX}-root`,
  tableText: `${PREFIX}-tableText`,
  options: `${PREFIX}-options`,
  icon: `${PREFIX}-icon`,
};

const Root = styled("div")({
  [`& .${classes.tableText}`]: {
    fontSize: "14px",
    align: "left",
  },
  [`& .${classes.options}`]: {
    fontSize: "20px",
    align: "right",
    width: "50px",
  },
  [`& .${classes.icon}`]: {
    fontSize: "20px",
  },
});

function Image() {
  const [image, setImage] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Place the useEffect hook at the top level of the component
  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => {
        // Set the state with the data received from the server
        setImage(res.data);
      })
      .catch(err => console.error(err))
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:9000/api/images/${imageToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Refresh the table after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmation(false);
      setImageToDelete(null);
    }
  };

  return (
    <div style={{
      marginLeft: "10%",
      marginRight: "10%",
      paddingTop: "20px",
    }}>
      <Root>
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
                  colSpan={5}
                  className={classes.tableText}
                  align="center"
                  style={{ fontSize: "25px", padding: "15px" }}
                >
                  List of Images
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableText}>
                  Image Name
                </TableCell>
                <TableCell className={classes.tableText}>
                  Photographer
                </TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:hover": { backgroundColor: "#EEE" } }}>
              {/* {admin.map((data, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.tableText}>
                    {data.imageName}
                  </TableCell>
                  <TableCell className={classes.tableText}>
                    {data.photographer}
                  </TableCell>
                  <TableCell className={classes.options}>
                    <Stack direction="row">
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => {
                          // Handle View button click
                        }}
                      >
                        View
                      </IconButton>
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => {
                          // Handle Edit button click
                        }}
                      >
                        Edit
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow> 
              ))} */}

<TableRow>
                <TableCell>Holder</TableCell>
                <TableCell>Holder</TableCell>
                <IconButton
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`../ImageEdit/${image.id}`);
                  }}
                >
                  <EditIcon className={classes.icon} />
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
                  <DeleteIcon className={classes.icon} />
                </IconButton>
              </TableRow>

            </TableBody>

                       {/* Delete confirmation dialog */}
                       <Dialog
              open={deleteConfirmation}
              onClose={() => setDeleteConfirmation(false)}
              className={classes.dialog}
            >
              <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Delete Exhibition
              </DialogTitle>

              <DialogContent>
                Are you sure you want to delete the exhibition "
                {imageToDelete?.imageName}" ?
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
      </Root>

      <Container
          sx={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary",
              color: "white",
              "&:hover": {
                fontWeight: "bold",
              },
            }}
          >
            Create New Image
          </Button>
        </Container>
    </div>
  );
}

export default Image;
