import React from "react";
import { Paper, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export const DataTable = ({ tableFields, items }) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 100px)' }}>
      <Table stickyHeader size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {tableFields.map((tf) => {
              return tf.generateTableHeaderCell();
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
              {tableFields.map((tf) => {
                return tf.generateTableCell(item);
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
