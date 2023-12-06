import { Box, Chip, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import imageComingSoon from './utd.jpg';
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { ArtistFilterMenu } from "../Users/Tools/ArtistFilterMenu";
import SellIcon from "@mui/icons-material/Sell"
import PersonIcon from "@mui/icons-material/Person"
import GridOnIcon from "@mui/icons-material/GridOn"
import ViewListIcon from "@mui/icons-material/ViewList"




export const CollectionBrowser = ({isDialogMode, selectedItem, setSelectedItem, disabledImages}) => {
    
    const [images, setImages] = useState([]);
    const [artists, setArtists] = useState([]);
    
    const [viewMode, setViewMode] = useState("grid");
    
    const handleViewModeChange = (event, next) => {
        setViewMode(next);
    }
    
    const [artistFilter, setArtistFilter] = useState(null);

    const fetchImageData = async() => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", '/api/collection/images');
            setImages(imageData.data);
      
          } catch (error) {
            console.error("Error fetching image metadata:", error);
          }
    }

    const fetchArtistData = async() => {
        try {
            const artistData = await sendAuthenticatedRequest("GET", '/api/artists');
            setArtists(artistData.data);
      
          } catch (error) {
            console.error("Error fetching artists:", error);
          }
    }

    useEffect(() => {
        fetchImageData();
        fetchArtistData();
    }, [])

    const theme = useTheme();

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            display: "grid",
            gridTemplateColumns: '1fr',
            gridTemplateRows: isDialogMode ? '80px 400px' : '80px calc(100vh - 144px)',
            gridTemplateAreas: `
            "toolbar"
            "gallery"
            `
            }} >
            <Stack direction="row" sx={{gridArea: "toolbar"}} padding={2} spacing={2}>
                <ArtistFilterMenu artists={artists} filterValue={artistFilter} setFilterValue={setArtistFilter} />
                <ToggleButtonGroup exclusive={true} value={viewMode} onChange={handleViewModeChange}>
                    <ToggleButton value="grid" key="grid">
                        <GridOnIcon />
                    </ToggleButton>
                    <ToggleButton value="list" key="list">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" sx={{gridArea: "gallery", overflowY: "scroll", justifyItems: "center", width: "100%"}} variant="standard">
                {images.filter((image) => !artistFilter || image.Artists.map((a) => a.id).includes(parseInt(artistFilter.id)))
                .map((image) => (
                    <Stack direction={viewMode == "list" ? "row" : "column"} spacing={2} padding={4}
                        sx={{
                            width: viewMode == "list" ? "500px" : "250px",
                            backgroundColor: image.id == selectedItem?.id ? theme.palette.grey.translucent : "",
                            opacity: (disabledImages ?? []).map((di) => di.image_id).includes(image.id) ? 0.2 : 1
                        }} key={image.id} 
                        onClick={() => {
                        if(setSelectedItem)
                            setSelectedItem(image)
                    }}>
                        <Box width="200px" height="150px"
                            sx={{
                                backgroundImage: `url(${image.thumbnailUrl ?? imageComingSoon})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                backgroundPositionX: "center",
                                backgroundPositionY: "top"
                            }}
                        />
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">{image.title}</Typography>
                            {image.Artists.map((a) => (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PersonIcon />
                                    <Typography variant="body1">{a.fullName}</Typography>
                                </Stack>
                            ))}
                            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                                {viewMode == "list" && image.Tags.map((t) => (
                                    <Chip sx={{maxWidth: "150px"}} icon={<SellIcon />} label={<Typography>{t.data}</Typography>} variant="filled" />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Box>
    )
}
