import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Checkbox, Paper, Stack, TableCell, TableContainer, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@emotion/react";
import { ColumnSortButton } from "./ColumnSortButton";



const DataTableCell = ({tf, itemAsString}) => {
    return useMemo(() => {
        return (
            <TableCell sx={{maxWidth: tf.maxWidth ?? "unset", wordWrap: tf.maxWidth ? "break-word" : "unset"}}>
                {tf.generateTableCell(JSON.parse(itemAsString))}
            </TableCell>
        );
    }, [itemAsString]);
};


const DataTableFieldCells = ({tableFields, item: itemAsString}) => {
    return useMemo(() => {
        return tableFields.map((tf) => {
            return (
                <DataTableCell key={tf.columnDescription} {...{tf, itemAsString}} />
            );
        }
        );}, [itemAsString]);
};


export const DataTable = ({ nonEmptyHeight, tableFields, items, 
    rowSelectionEnabled, selectedItems, setSelectedItems, visibleItems,
    defaultSortColumn, defaultSortAscending,
    emptyMinHeight, NoContentIcon, noContentMessage, noContentButtonAction, noContentButtonText }) => {

    const theme = useTheme();

    const [sortColumn, setSortColumn] = useState(defaultSortColumn ?? "ID");
    const [sortAscending, setSortAscending] = useState(defaultSortAscending ?? true);


    const sortRoutine = useCallback((a, b) => {
        const [,aSortableValues,] = a;
        const [,bSortableValues,] = b;
        return ((aSortableValues[sortColumn] ?? "") > (bSortableValues[sortColumn] ?? "")) ? 1 : -1;
    }, [sortColumn]);


    useEffect(() => {
        if(selectedItems)
            setSelectedItems(selectedItems.filter((si) => items.map((i) => i.id).includes(si.id)));
    }, [items]);


    const sortableValuesByRow = useMemo(() => {
        const output = { };
        (items ?? []).map((item) => {
            const sortableValues = {};
            for(const tf of tableFields) {
                if(tf.generateSortableValue)
                    sortableValues[tf.columnDescription] = tf.generateSortableValue(item);
            }
            output[item.id] = sortableValues;
        });
        return output;
    }, [items]);
  

  

    const itemInformation = useMemo(() => {
        const itemInformationToReturn = (
            (items ?? []).map((item) => {

                const isSelected = Boolean(selectedItems?.map((si) => si.id).includes(item.id));
                const themeColor = item.is_admin ? "secondary" : "primary";
  
                const sortableValues = sortableValuesByRow[item.id];
        
                const renderedTableRow = (
                    <TableRow key={item.id} sx={{
                        ["&:hover"]: {
                            backgroundColor: isSelected ? theme.palette[themeColor].translucent : theme.palette.grey.veryTranslucent,
              
                        },
                        ["&:not(:hover)"]: {
                            backgroundColor: isSelected ? theme.palette[themeColor].veryTranslucent : ""
                        },
                    }}>
                        {Boolean(rowSelectionEnabled) && (<TableCell width="10px">
                            <Checkbox checked={isSelected}
                                color={themeColor}
                                onChange={(e) => {
                                    if(e.target.checked) {
                                        setSelectedItems([...selectedItems, item]);
                                    } else {
                                        setSelectedItems(selectedItems.filter((si) => si.id != item.id));
                                    }
                                }}
                                size="large" />
                        </TableCell>)}
                        <DataTableFieldCells item={JSON.stringify(item)} {...{tableFields}} />
                    </TableRow>
                );
  
                return [item, sortableValues, renderedTableRow];
  
            })
        );
        return itemInformationToReturn;
    }, [items, selectedItems]);


    const visibleItemInformation = useMemo(() => itemInformation.filter((r) => visibleItems.map((vi) => vi.id).includes(r[0].id)), [itemInformation, visibleItems]);

    const sortedItemInformation = useMemo(() => visibleItemInformation.toSorted(sortRoutine), [visibleItemInformation, sortColumn]);
  
    const renderedItems = useMemo(() => sortedItemInformation.map((r) => r[2]), [sortedItemInformation]);

    const itemsInFinalDisplayOrder = useMemo(() => {
        if(sortAscending)
            return renderedItems;
        else
            return renderedItems.toReversed();
    }, [renderedItems, sortAscending]);

    const visibleSelectedItems = selectedItems ? visibleItems.filter((i) => selectedItems.map((si) => si.id).includes(parseInt(i.id))) : visibleItems;


    return (
        <TableContainer component={Paper} sx={{ width: "100%" || "calc(100% - 0px)", height: items.length ? nonEmptyHeight : "unset" , minHeight: items.length == 0 ? emptyMinHeight : "unset" }}>
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
                                            ))]);
                                        } else {
                                            setSelectedItems(selectedItems.filter((si) => (
                                                !visibleSelectedItems.map((vsi) => vsi.id).includes(parseInt(si.id))
                                            )));
                                        }
                                    }}
                                    size="large" />
                                </Typography>
                            </TableCell>
                        )}
                        {tableFields.map((tf) => {
                            return (
                                <React.Fragment key={tf.columnDescription}>
                                    <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="h6">{tf.columnDescription}</Typography>
                                            {tf.generateSortableValue && (
                                                <ColumnSortButton columnName={tf.columnDescription} {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                                            )}
                                        </Stack>
                                    </TableCell>
                                </React.Fragment>
                            );
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {itemsInFinalDisplayOrder}
                </TableBody>
            </Table>
            {visibleItems.length == 0 && emptyMinHeight && (
                <Box sx={{width: "100%"}}>
                    <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: "100%"}}>
                        {NoContentIcon && (
                            <NoContentIcon sx={{fontSize: "150pt", opacity: 0.5}} />
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
