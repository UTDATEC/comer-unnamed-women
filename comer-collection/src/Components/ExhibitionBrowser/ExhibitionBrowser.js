import { Box, Button, Paper, Stack, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { DataTable } from "../Users/Tools/DataTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack"

  
export const ExhibitionBrowser = ({showSnackbar}) => {

    const [exhibitions, setExhibitions] = useState([]);

    const fetchPublicExhibitionData = async() => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", '/api/exhibitions/public');
            setExhibitions(imageData.data);
      
          } catch (error) {
            console.error("Error fetching image metadata:", error);
          }
    }

    useEffect(() => {
        fetchPublicExhibitionData();
    }, [])

    const theme = useTheme();
    console.log(theme);
  
    const exhibitionTableFields = [
        {
          columnDescription: "Title",
          generateTableHeaderCell: () => (
            <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
              <Typography variant="h6">Title</Typography>
            </TableCell>
          ),
          generateTableCell: (exhibition) => (
            <TableCell sx={{wordWrap: "break-word", maxWidth: "200px"}}>
              <Typography variant="body1">{exhibition.title}</Typography>
            </TableCell>
          )
        },
        {
          columnDescription: "Curator",
          generateTableHeaderCell: () => (
            <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
              <Typography variant="h6">Curator</Typography>
            </TableCell>
          ),
          generateTableCell: (exhibition) => (
            <TableCell>
              <Typography variant="body1">{exhibition.curator}</Typography>
            </TableCell>
          )
        },
        {
          columnDescription: "Last Updated",
          generateTableHeaderCell: () => (
            <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
              <Typography variant="h6">Last Updated</Typography>
            </TableCell>
          ),
          generateTableCell: (exhibition) => (
            <TableCell>
              <Typography variant="body1">{new Date (exhibition.date_modified).toDateString()}</Typography>
            </TableCell>
          )
        },
        {
          columnDescription: "Open",
          generateTableHeaderCell: () => (
            <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
              <Typography variant="h6"></Typography>
            </TableCell>
          ),
          generateTableCell: (exhibition) => (
            <TableCell>
              <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={`/Exhibitions/${exhibition.id}`} target="_blank">
                <Typography variant="body1">Open</Typography>
              </Button>
            </TableCell>
          )
        },
      ]
    
      

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            padding: "50px 300px"
            
            }} >
            <Stack spacing={4} padding={5}>
            <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
              <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                <PhotoCameraBackIcon fontSize="large" />
                <Typography variant="h4">Public Exhibitions</Typography>
              </Stack>
              </Stack>
                <DataTable visibleItems={exhibitions} tableFields={exhibitionTableFields} 
                    nonEmptyHeight="500px" emptyMinHeight="500px"
                />
            </Stack>
                
        </Box>

    )
}
