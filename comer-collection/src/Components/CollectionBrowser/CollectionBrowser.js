import { Box, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import imageComingSoon from './utd.jpg';


export const CollectionBrowser = ({showSnackbar, isDialogMode, setSelectedItem}) => {

    const [images, setImages] = useState([]);

    const fetchImageData = async() => {
        try {
            const response = await axios.get("http://localhost:9000/api/images", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const imageData = response.data;
            setImages(imageData.data);
      
            // setTimeout(() => {
            //   setRefreshInProgress(false);
            // }, 1000);
          } catch (error) {
            console.error("Error fetching image metadata:", error);
          }
    }

    useEffect(() => {
        fetchImageData();
    }, [])

    return (
        <Box justifyItems="center" sx={{
            display: "grid",
            gridTemplateColumns: '1fr',
            gridTemplateRows: '80px calc(100vh - 144px)',
            gridTemplateAreas: `
              "toolbar"
              "gallery"
            `
            }} >
            <ImageList sx={{gridArea: "gallery", maxWidth: "50%"}} rowHeight={200} cols={4}>
                {images.map((image) => (
                    <ImageListItem sx={{maxWidth: "50%"}} key={image.id}>
                        {image.url && (
                            <img src={image.url}
                                alt={image.safe_display_name}
                                loading="lazy"
                            />
                        ) || !image.url && (
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
