import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconButton,
  Paper,
  Stack,
  TableContainer, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import Unauthorized from "../../ErrorPages/Unauthorized";

const UserManagement = (props) => {
  const [curators, setCurators] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [curatorToDelete, setCuratorToDelete] = useState(null);

  const { user, setUser, selectedNavItem, setSelectedNavItem } = props;
  

  const curatorColumns = {
    id: "ID",
    displayName: "Name",
    email: "Email",
    courseCount: "Courses",
    exhibitionCount: "Exhibitions",
    type: "User Type"
  };
  
  useEffect(() => {
    setSelectedNavItem("User Management");
    if(user.is_admin) {
      fetchData();
    }
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const curatorData = response.data;

      setCurators(curatorData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleDeleteClick = (curatorId) => {
    setCuratorToDelete({ curatorId });
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      const { curatorId } = curatorToDelete;

      const response = await axios.delete(
        `http://localhost:9000/api/users/${curatorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        fetchData();
      } else {
        console.error("Error deleting curator:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    } finally {
      setDeleteConfirmation(false);
      setCuratorToDelete(null);
    }
  };


  return !user.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  user.is_admin && (
    <div style={{
      marginLeft: '10%',
      marginRight: '10%',
      paddingTop: '5%'
    }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table size="small" aria-label="curator table" sx={{ width: "100%" }}>
            <TableHead
              sx={{
                "& th": { fontWeight: "bold" },
                "&": { backgroundColor: "lightgray" },
              }}
            >
              <TableRow>
                {Object.keys(curatorColumns).map((col) => (
                  <TableCell key={col}>
                    <Typography variant="h6">{curatorColumns[col]}</Typography>
                  </TableCell>
                ))}
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:hover": { backgroundColor: "#EEE" } }}>
              {curators.map((curator) => (
                  <TableRow key={curator.id}>
                    <TableCell>
                      <Typography variant="body1">{curator.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.family_name}, {curator.given_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.Courses.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.Exhibitions.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{curator.is_admin ? "Administrator" : "Curator"}</Typography>
                    </TableCell>


                    <TableCell>
                      <Stack direction="row">
                        <IconButton
                          color="primary"
                          variant="contained"
                          size="small"
                          disabled={curator.is_admin}
                          onClick={() =>
                            handleDeleteClick(curator.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        // className={classes.dialog}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Delete Curator
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this curator 
          {/* "{curatorToDelete?.curatorId}" */}
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
    </div>
  );
}

export default UserManagement;
