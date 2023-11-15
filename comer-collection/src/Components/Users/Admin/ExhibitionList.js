import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconButton,
  Paper,
  Stack,
  TableContainer,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";

const PREFIX = "ExhibitionList";

const classes = {
  root: `${PREFIX}-root`,
  tableText: `${PREFIX}-tableText`,
  options: `${PREFIX}-options`,
  icon: `${PREFIX}-icon`,
  dialog: `${PREFIX}-dialog`,
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
  [`& .${classes.dialog}`]: {
    "& .MuiDialog-paper": {
      minWidth: "300px",
    },
  },
});

function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [exhibitionToDelete, setExhibitionToDelete] = useState(null);

  const exhibitionColumns = {
    exhibitionTitle: "Exhibition Title",
    exhibitionOwner: "Owner",
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/exhibitions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setExhibitions(response.data.data);
      console.log("Exhibitions:", response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:9000/api/exhibitions/${exhibitionToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Refresh the table after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting exhibition:", error);
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmation(false);
      setExhibitionToDelete(null);
    }
  };

  return (
    <div className="ListContainer">
      <Root className="TableContainer">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="exhibition table">
            <TableHead
              sx={{
                "& th": { fontWeight: "bold" },
                "&": { backgroundColor: "lightgray" },
              }}
            >
              <TableRow>
                <TableCell
                  colSpan={Object.keys(exhibitionColumns).length + 1}
                  className={classes.tableText}
                  align="center"
                  style={{ fontSize: "25px", padding: "15px" }}
                >
                  List of Exhibitions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableText}>
                  {exhibitionColumns.exhibitionTitle}
                </TableCell>
                <TableCell className={classes.tableText}>
                  {exhibitionColumns.exhibitionOwner}
                </TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:hover": { backgroundColor: "#EEE" } }}>
              {exhibitions.map((exhibition) => (
                <TableRow key={exhibition.id}>
                  <TableCell className={classes.tableText}>
                    {exhibition.title}
                  </TableCell>
                  <TableCell className={classes.tableText}>
                    {exhibition.owner}
                  </TableCell>
                  <TableCell className={classes.options}>
                    <Stack direction="row">
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => {
                          // Set the exhibition to delete and open the confirmation dialog
                          setExhibitionToDelete(exhibition);
                          setDeleteConfirmation(true);
                        }}
                      >
                        <DeleteIcon className={classes.icon} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
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
                Are you sure you want to delete the exhibition 
                "{exhibitionToDelete?.title}"
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
      </Root>
    </div>
  );
}

export default ExhibitionList;
