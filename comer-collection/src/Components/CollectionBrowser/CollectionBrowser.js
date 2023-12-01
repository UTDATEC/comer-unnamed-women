import { Box, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import imageComingSoon from './utd.jpg';
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";


export const CollectionBrowser = ({isDialogMode, selectedItem, setSelectedItem, disabledImages}) => {

    const [images, setImages] = useState([]);

    const fetchImageData = async() => {
        try {
            const imageData = await sendAuthenticatedRequest("GET", '/api/collection/images');
            setImages(imageData.data);
      
          } catch (error) {
            console.error("Error fetching image metadata:", error);
          }
    }

    useEffect(() => {
        fetchImageData();
    }, [])

    const theme = useTheme();
    console.log(theme);

    return (
        <Box component={Paper} square justifyItems="center" sx={{
            display: "grid",
            gridTemplateColumns: '1fr',
            gridTemplateRows: '80px calc(100vh - 144px)',
            gridTemplateAreas: `
            "toolbar"
            "gallery"
            `
            }} >
            <ImageList sx={{gridArea: "gallery", maxWidth: "100%", overflowY: "scroll", justifyItems: "center"}} 
                variant="standard"
                rowHeight={200} cols={6} gap={8}>
                {images.map((image) => (
                    <ImageListItem sx={{
                            width: "60%",
                            backgroundColor: image.id == selectedItem?.id ? "blue" : "",
                            opacity: (disabledImages ?? []).map((di) => di.image_id).includes(image.id) ? 0.2 : 1
                        }} key={image.id} 
                        onClick={() => {
                        if(setSelectedItem)
                            setSelectedItem(image)
                    }}>
                        {image.thumbnail_url && (
                            <img src={image.thumbnail_url}
                                alt={image.safe_display_name}
                                loading="lazy"
                            />
                        ) || !image.thumbnail_url && image.url && (
                            <img src={image.url}
                                alt={image.safe_display_name}
                                loading="lazy"
                            />
                        ) || !image.thumbnail_url && !image.url && (
                            <img src={imageComingSoon} />
                        )}
                        <ImageListItemBar 
                            title={<Typography variant="body1">{image.title}</Typography>}
                            subtitle={<Typography variant="body1">{(image.Artists.map((a) => a.fullName)).join("; ")}</Typography>}
                            position="below"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    )
}
