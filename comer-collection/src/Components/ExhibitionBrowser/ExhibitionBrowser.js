import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { DataTable } from "../Users/Tools/DataTable";
import { OpenInNewIcon, PhotoCameraBackIcon } from "../IconImports";
import { useNavigate } from "react-router";
import { useTitle } from "../App/AppTitle";

  
export const ExhibitionBrowser = () => {

    const [exhibitions, setExhibitions] = useState([]);


    const setTitleText = useTitle();
  
  

    const fetchPublicExhibitionData = async() => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", "/api/public/exhibitions");
            setExhibitions(imageData.data);
      
        } catch (error) {
            console.error("Error fetching image metadata:", error);
        }
    };

    useEffect(() => {
        setTitleText("Public Exhibitions");
        fetchPublicExhibitionData();
    }, []);

    const navigate = useNavigate();
  
    const exhibitionTableFields = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.title}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.title?.toLowerCase()
        },
        {
            columnDescription: "Curator",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{exhibition.curator}</Typography>
            ),
            generateSortableValue: (exhibition) => exhibition.curator?.toLowerCase()
        },
        {
            columnDescription: "Last Updated",
            generateTableCell: (exhibition) => (
                <Typography variant="body1">{new Date (exhibition.date_modified).toLocaleString()}</Typography>
            ),
            generateSortableValue: (exhibition) => new Date (exhibition.date_modified)
        },
        {
            columnDescription: "Open",
            columnHeaderLabel: "",
            generateTableCell: (exhibition) => (
                <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={`/Exhibitions/${exhibition.id}`} target="_blank">
                    <Typography variant="body1">Open</Typography>
                </Button>
            )
        },
    ];
    
      

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            padding: "50px 300px" }} >
            <Stack spacing={4}>
                <Stack direction="row" paddingLeft={1} spacing={2} justifyContent="space-between">
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                        <PhotoCameraBackIcon fontSize="large" />
                        <Typography variant="h4">Public Exhibitions</Typography>
                    </Stack>
                </Stack>
                <DataTable items={exhibitions} visibleItems={exhibitions} tableFields={exhibitionTableFields} 
                    defaultSortAscending={false} defaultSortColumn="Last Updated"
                    nonEmptyHeight="500px" emptyMinHeight="500px" NoContentIcon={PhotoCameraBackIcon}
                    noContentButtonAction={() => {
                        navigate("/BrowseCollection");
                    }}
                    noContentButtonText="Browse Collection"
                />
            </Stack>
        </Box>

    );
};
