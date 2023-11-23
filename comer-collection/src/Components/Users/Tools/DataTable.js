import React from "react";
import { Checkbox, Paper, TableCell, TableContainer, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@emotion/react";

export const DataTable = ({ tableFields, items, extraProperties, rowSelectionEnabled, selectedItems, setSelectedItems }) => {

  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 0px)' }}>
      <Table stickyHeader size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {Boolean(rowSelectionEnabled) && (<TableCell sx={{backgroundColor: "#CCC"}}>
              <Typography variant="body1">
                <Checkbox checked={
                  items.length && selectedItems.length == items.length
                } 
                disabled={items.length == 0}
                indeterminate={
                  selectedItems.length > 0 && selectedItems.length < items.length
                }
                onChange={(e) => {
                  if(e.target.checked) {
                    setSelectedItems([...items])
                  } else {
                    setSelectedItems([])
                  }
                }}
                size="medium" />
              </Typography>
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
          {items.map((item) => {

            const isSelected = selectedItems.map((si) => si.id).includes(item.id);
            const themeColor = Boolean(item.is_admin) ? "secondary" : "primary"

            return (
            <TableRow key={item.id} sx={{
              [`&:hover`]: {
                backgroundColor: isSelected ? theme.palette[themeColor]['200'] : "#EEE"
              },
              [`&:not(:hover)`]: {
                backgroundColor: isSelected ? theme.palette[themeColor]['100'] : ""
              }
            }}>
            {Boolean(rowSelectionEnabled) && (<TableCell width="10px">
              <Checkbox checked={isSelected} 
              color={themeColor}
              onChange={(e) => {
                if(e.target.checked) {
                  setSelectedItems([...selectedItems, item])
                } else {
                  setSelectedItems(selectedItems.filter((si) => si.id != item.id))
                }
              }}
              size="medium" />
            </TableCell>)}
              {tableFields.map((tf) => {
                return (
                  <React.Fragment key={tf.columnDescription}>
                    {tf.generateTableCell(item, extraProperties)}
                  </React.Fragment>
                )
              })}
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
