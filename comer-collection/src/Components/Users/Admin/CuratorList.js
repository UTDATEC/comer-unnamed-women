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

const PREFIX = "CuratorList";

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

function CuratorList() {
  const [curator, setCurator] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [curatorToDelete, setCuratorToDelete] = useState(null);

  const curatorColumns = {
    status: "Status",
    givenName: "First",
    familyName: "Last",
    course: "Course",
    exhibition: "Exhibition",
    deactivationDays: "Deactivation in (Days)",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/courses", {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_BEARER}`,
          },
        });

        setCurator(response.data.data);
        console.log("Curator:", response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // if need to display date
  const formatISODate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDeactivationInDays = (deactivationDate) => {
    const today = new Date();
    const deactivation = new Date(deactivationDate);

    const differenceInTime = deactivation.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays < 0) {
      return "Expired";
    } else {
      return differenceInDays.toString();
    }
  };

  const calculateDeactivationStatusAndColor = (deactivationDate) => {
    const differenceInDays = calculateDeactivationInDays(deactivationDate);

    return {
      status: differenceInDays > 0 ? "Active" : "Inactive",
      color: differenceInDays > 0 ? "green" : "red",
    };
  };

  const handleDeleteClick = (curatorId, courseId) => {
    setCuratorToDelete({ curatorId, courseId });
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      const { curatorId, courseId } = curatorToDelete;

      const response = await axios.delete(
        `http://localhost:9000/api/courses/${courseId}/curators/${curatorId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_BEARER}`,
          },
        }
      );

      if (response.status === 200) {
        setCurator((prevCurator) =>
          prevCurator.filter((cur) => cur.id !== curatorId)
        );
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

  return (
    <div className="ListContainer">
      <Root className="TableContainer">
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table size="small" aria-label="curator table" sx={{ width: "100%" }}>
            <TableHead
              sx={{
                "& th": { fontWeight: "bold" },
                "&": { backgroundColor: "lightgray" },
              }}
            >
              <TableCell
                colSpan={Object.keys(curatorColumns).length + 1}
                className={classes.tableText}
                align="center"
                style={{ fontSize: "25px", padding: "15px" }}
              >
                List of Curators
              </TableCell>
              <TableRow>
                {Object.keys(curatorColumns).map((col) => (
                  <TableCell className={classes.tableText}>
                    {curatorColumns[col]}
                  </TableCell>
                ))}
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:hover": { backgroundColor: "#EEE" } }}>
              {curator.map((course) => {
                const { status, color } = calculateDeactivationStatusAndColor(
                  course.date_end
                );

                return (
                  <TableRow key={course.id}>
                    <TableCell
                      className={classes.tableText}
                      sx={{ color, fontWeight: "bold" }}
                    >
                      {status}
                    </TableCell>
                    <TableCell className={classes.tableText}>
                      {course.Users[0]?.given_name}
                    </TableCell>
                    <TableCell className={classes.tableText}>
                      {course.Users[0]?.family_name}
                    </TableCell>
                    <TableCell className={classes.tableText}>
                      {course.name}
                    </TableCell>
                    <TableCell className={classes.tableText}>
                      {/* holder for curator's exhibition number*/}
                    </TableCell>
                    <TableCell className={classes.tableText}>
                      {calculateDeactivationInDays(course.date_end)}
                    </TableCell>

                    <TableCell className={classes.options}>
                      <Stack direction="row">
                        <IconButton
                          color="primary"
                          variant="contained"
                          size="small"
                          sx={{ color: "red" }}
                          onClick={() =>
                            handleDeleteClick(course.Users[0]?.id, course.id)
                          }
                        >
                          <DeleteIcon className={classes.icon} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Root>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        className={classes.dialog}
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

export default CuratorList;
