import React from "react";
import { Checkbox, Paper, TableCell, TableContainer, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@emotion/react";

export const DataTable = ({ tableFields, items, visibleItems, extraProperties, rowSelectionEnabled, selectedItems, setSelectedItems }) => {

  const theme = useTheme();

  const visibleSelectedItems = (selectedItems ?? []).filter((si) => (
    visibleItems.map((i) => i.id).includes(parseInt(si.id))
  ));

  return (
    <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 0px)' }}>
      <Table stickyHeader size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {Boolean(rowSelectionEnabled) && (<TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
              <Typography variant="body1">
                <Checkbox checked={
                  visibleSelectedItems.length == visibleItems.length
                } 
                disabled={visibleItems.length == 0}
                indeterminate={
                  visibleSelectedItems.length > 0 && visibleSelectedItems.length < visibleItems.length
                }
                onChange={(e) => {
                  if(e.target.checked) {
                    setSelectedItems([...selectedItems, ...visibleItems.filter((i) => (
                      !selectedItems.map((si) => si.id).includes(parseInt(i.id))
                    ))])
                  } else {
                    setSelectedItems(selectedItems.filter((si) => (
                      !visibleSelectedItems.map((vsi) => vsi.id).includes(parseInt(si.id))
                    )))
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
          {(visibleItems ?? []).map((item) => {

            const isSelected = Boolean(selectedItems?.map((si) => si.id).includes(item.id));
            const themeColor = Boolean(item.is_admin) ? "secondary" : "primary"

            return (
            <TableRow key={item.id} sx={{
              [`&:hover`]: {
                backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent,
                
              },
              [`&:not(:hover)`]: {
                backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
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
