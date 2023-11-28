import React, { useMemo } from "react";
import { Box, Button, Checkbox, Paper, Stack, TableCell, TableContainer, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "./ColumnSortButton";


const DataTableCell = ({tf, item, extraProperties}) => {
  return useMemo(() => tf.generateTableCell(item, extraProperties), [item, extraProperties]);
}


export const DataTable = ({ nonEmptyHeight, tableFields, items, visibleItems, extraProperties, rowSelectionEnabled, selectedItems, setSelectedItems, sortColumn, setSortColumn, sortAscending, setSortAscending,
  emptyMinHeight, NoContentIcon, noContentMessage, noContentButtonAction, noContentButtonText }) => {

  const theme = useTheme();

  const visibleSelectedItems = (selectedItems ?? []).filter((si) => (
    visibleItems.map((i) => i.id).includes(parseInt(si.id))
  ));

  return (
    <TableContainer component={Paper} sx={{ width: "100%" || 'calc(100% - 0px)', height: visibleItems.length ? nonEmptyHeight : "unset" , minHeight: visibleItems.length == 0 ? emptyMinHeight : "unset" }}>
      <Table stickyHeader size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {Boolean(rowSelectionEnabled) && (
              <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
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
              </TableCell>
            )}
            {tableFields.map((tf) => {
              return (
                <React.Fragment key={tf.columnDescription}>
                  <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">{tf.columnHeaderLabel ?? tf.columnDescription}</Typography>
                      {tf.generateSortableValue && (
                        <ColumnSortButton columnName={tf.columnDescription} {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                      )}
                    </Stack>
                  </TableCell>
                </React.Fragment>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {(visibleItems ?? []).map((item) => {

            const isSelected = Boolean(selectedItems?.map((si) => si.id).includes(item.id));
            const themeColor = Boolean(item.is_admin) ? "secondary" : "primary"

            const sortableValue = tableFields.find((tf) => tf.columnDescription == sortColumn)?.generateSortableValue(item);
            
            const renderedTableRow = (
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
                    <DataTableCell key={tf.columnDescription} {...{tf, item, extraProperties, visibleItems}} />
                  )
                })}
              </TableRow>
            )

            return [sortableValue, renderedTableRow];

          }).sort((a, b) => {
            const [aSortableValue,] = a;
            const [bSortableValue,] = b;
            return ((aSortableValue ?? "") < (bSortableValue ?? "")) ^ sortAscending ? 1 : -1;
          }).map((r) => r[1])}
        </TableBody>
      </Table>
      {visibleItems.length == 0 && emptyMinHeight && (
        <Box square sx={{width: '100%'}}>
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
          {NoContentIcon && (
            <NoContentIcon sx={{fontSize: '150pt', opacity: 0.5}} />
          )}
          <Typography variant="h4">{noContentMessage ?? "This list is empty"}</Typography>
          {noContentButtonText && noContentButtonAction && (
            <Button variant="contained" onClick={noContentButtonAction}>
                <Typography variant="body1">{noContentButtonText}</Typography>
            </Button>
          )}

        </Stack>
    </Box>
      )}
    </TableContainer>
  );
};
