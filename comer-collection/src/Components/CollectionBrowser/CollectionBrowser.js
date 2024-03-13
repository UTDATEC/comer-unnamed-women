import { Box, Chip, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography, ListItemButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { ArtistFilterMenu } from "../Users/Tools/ArtistFilterMenu";
import { SellIcon, PersonIcon, GridOnIcon, ViewListIcon } from '../IconImports';
import { TagFilterMenu } from "../Users/Tools/TagFilterMenu";
import SearchBox from "../Users/Tools/SearchBox";
import { doesItemMatchSearchQuery } from "../Users/Tools/SearchUtilities";
import { useTitle } from "../App/AppTitle";



const CollectionBrowserImageContainer = ({image, viewMode, isSelected, setSelectedItem, isDisabled}) => {

    const thumbnailBox = useMemo(() => (
        <Box width="200px" height="150px"
            sx={{
                backgroundImage: `url(${`http://localhost:9000/api/collection/images/${image.id}/download`})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPositionX: "center",
                backgroundPositionY: "top"
            }}
        />
    ), [image]);

    const infoStack = useMemo(() =>(
        <Stack direction={viewMode == "list" ? "row" : "column"} spacing={2} padding={4}
            sx={{
                width: viewMode == "list" ? "500px" : "200px"
            }}
            >
            {thumbnailBox}
            <Stack direction="column" spacing={1} alignItems={viewMode == "list" ? "left" : "center"}>
                <Typography variant="h6">{image.title}</Typography>
                {viewMode == "list" && (
                    <Typography variant="body1">{image.year}</Typography>
                )}
                <Stack direction={viewMode == "list" ? "column" : "row"} spacing={viewMode == "list" ? 0 : 2}>
                    {image.Artists.map((a) => (
                        <Stack key={a.id} direction="row" spacing={1} alignItems="center">
                            <PersonIcon />
                            <Typography variant="body1">{a.fullName}</Typography>
                        </Stack>
                    ))}
                </Stack>
                <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                    {viewMode == "list" && image.Tags.map((t) => (
                        <Chip key={t.id} sx={{maxWidth: "150px"}} icon={<SellIcon />} label={<Typography>{t.data}</Typography>} variant="filled" />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    ), [image, viewMode]);

    const listItemButton = useMemo(() => (
        <ListItemButton disableGutters selected={isSelected} disabled={isDisabled} sx={{
            borderRadius: "10px",
            justifyContent: "center"
        }}
            onClick={() => {
                setSelectedItem(image)
            }}>
            {infoStack}
        </ListItemButton>
    ), [image, viewMode, isSelected, isDisabled])

    
    return setSelectedItem ? listItemButton : infoStack;

}



export const CollectionBrowser = ({isDialogMode, selectedItem, setSelectedItem, disabledImages}) => {
    
    const [images, setImages] = useState([]);
    const [artists, setArtists] = useState([]);
    const [tags, setTags] = useState([]);
    
    const [viewMode, setViewMode] = useState("grid");
    
    const handleViewModeChange = (event, next) => {
        setViewMode(next);
    }
    
    const [artistFilter, setArtistFilter] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const setTitleText = useTitle();

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

    const fetchTagData = async() => {
        try {
            const tagData = await sendAuthenticatedRequest("GET", '/api/tags');
            setTags(tagData.data);
      
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }

    useEffect(() => {
        if(!isDialogMode) {
            setTitleText("Browse Collection")
        }
        fetchImageData();
        fetchArtistData();
        fetchTagData();
    }, [])

    const renderedImageContainerData = useMemo(() => images.map((image) => (
        [
            image,
            <CollectionBrowserImageContainer key={image.id} isSelected={image.id == selectedItem?.id} 
                isDisabled={(disabledImages ?? []).map((di) => di.image_id).includes(image.id)}
                {...{image, viewMode, setSelectedItem}} />
        ]
    )), [images, selectedItem, disabledImages, viewMode]);

    const renderedImageContainerDataFiltered = useMemo(() => renderedImageContainerData.filter((imageContainerData) => {
        return (
            !searchQuery || doesItemMatchSearchQuery(searchQuery, imageContainerData[0], ['title'])
        ) && (
            !artistFilter || imageContainerData[0].Artists.map((a) => a.id).includes(parseInt(artistFilter.id))
        ) && (
            !tagFilter || imageContainerData[0].Tags.map((t) => t.id).includes(parseInt(tagFilter.id))
        )
    }), [renderedImageContainerData, artistFilter, tagFilter, searchQuery]);

    const finalRenderedImageContainers = useMemo(() => renderedImageContainerDataFiltered.map((i) => i[1]), [renderedImageContainerDataFiltered]);

    return (
        <Box component={Paper} square justifyItems="center" paddingLeft={1} sx={{
            display: "grid",
            gridTemplateColumns: '1fr',
            gridTemplateRows: isDialogMode ? '80px 400px' : '80px calc(100vh - 144px)',
            gridTemplateAreas: `
            "toolbar"
            "gallery"
            `,
            }} >
            <Stack direction="row" width="100%" justifyContent="space-around" paddingTop={2} paddingBottom={2} spacing={2}>
                <Stack direction="row" sx={{gridArea: "toolbar"}} spacing={2}>
                    <SearchBox {...{searchQuery, setSearchQuery}} width="300px" placeholder="Search by image title" />
                    <ArtistFilterMenu artists={artists} filterValue={artistFilter} setFilterValue={setArtistFilter} />
                    <TagFilterMenu tags={tags} filterValue={tagFilter} setFilterValue={setTagFilter} />
                </Stack>
                <ToggleButtonGroup exclusive={true} value={viewMode} onChange={handleViewModeChange}>
                    <ToggleButton value="grid" key="grid">
                        <GridOnIcon />
                    </ToggleButton>
                    <ToggleButton value="list" key="list">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" sx={{gridArea: "gallery", overflowY: "scroll", justifyItems: "center", width: "100%"}} spacing={1} variant="standard">
                {finalRenderedImageContainers}
            </Stack>
        </Box>
    )
}
