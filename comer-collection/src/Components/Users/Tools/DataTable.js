import React from "react";
import { Checkbox, Paper, TableCell, TableContainer, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export const DataTable = ({ tableFields, items, extraProperties, rowSelectionEnabled }) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 0px)' }}>
      <Table stickyHeader size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {Boolean(rowSelectionEnabled) && (<TableCell sx={{backgroundColor: "#CCC"}}>
              <Typography variant="body1">&nbsp;</Typography>
            </TableCell>)}
            {tableFields.map((tf) => {
              return (
                <React.Fragment key={tf.columnDescription}>
                  {tf.generateTableHeaderCell()}
                </React.Fragment>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} sx={{
              [`&:hover`]: {
                backgroundColor: "#EEE"
              }
            }}>
            {Boolean(rowSelectionEnabled) && (<TableCell width="10px">
              <Checkbox size="large" />
            </TableCell>)}
              {tableFields.map((tf) => {
                return (
                  <React.Fragment key={tf.columnDescription}>
                    {tf.generateTableCell(item, extraProperties)}
                  </React.Fragment>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
