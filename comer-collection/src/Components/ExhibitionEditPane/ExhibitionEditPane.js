import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Icon, IconButton, Input, ListItemButton, MenuItem, Paper, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete"
import { useTheme } from "@emotion/react";
import { getImageStateById } from "../ExhibitionPage/exhibitionEditReducer";
import { CollectionBrowser } from "../CollectionBrowser/CollectionBrowser";
import CollectionsIcon from "@mui/icons-material/Collections"
import BrokenImageIcon from "@mui/icons-material/BrokenImage"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

const ColorInput = ({value, onChange, disabled}) => {
    return (
        <input type="color" sx={{width: "100%"}} 
            value={value ?? ""}
            {...{onChange, disabled}} 
        />
    )
}

const AccordionSubHeading = ({text}) => {
    const theme = useTheme();
    return (
        <>
            <Divider />
            <Typography variant="h6" align="center" color={theme.palette.grey.main}>{text}</Typography>
        </>
    )
}

const moodinessOptions = [
    {
        value: "dark",
        displayText: "Dark"
    },
    {
        value: "moody dark",
        displayText: "Moody dark"
    },
    {
        value: "moody bright",
        displayText: "Moody bright"
    },
    {
        value: "bright",
        displayText: "Bright"
    }
]


const directionOptions = [
    {
        value: 1,
        displayText: "Front"
    },
    {
        value: 2,
        displayText: "Right"
    },
    {
        value: 3,
        displayText: "Back"
    },
    {
        value: 4,
        displayText: "Left"
    }
]


const textureOptions = [
    {
        value: "black_carpet.png",
        displayText: "Black Carpet"
    },
    {
        value: "black_marble.png",
        displayText: "Black Marble"
    },
    {
        value: "blue_carpet.png",
        displayText: "Blue Carpet"
    },
    {
        value: "dark_gray_carpet.png",
        displayText: "Dark Gray Carpet"
    },
    {
        value: "gray_marble.png",
        displayText: "Gray Marble"
    },
    {
        value: "orange_carpet.png",
        displayText: "Orange Carpet"
    },
    {
        value: "parquet_wood.jpg",
        displayText: "Parquet Wood"
    }
]


const ExhibitionOption = ({description, children, vertical}) => {
    const theme = useTheme();
    return (
        <Stack direction={vertical ? "column" : "row"} alignItems={vertical ? "" : "center"} spacing={1} 
            justifyContent="space-between"
        >
            <Typography variant="body1">{description}</Typography>
            {children}
        </Stack>
    )
}


const ExhibitionOptionGroup = ({id, description, expandedSection, setExpandedSection, children}) => {

    const theme = useTheme();
    
    return (
        <Accordion disableGutters expanded={expandedSection == id}>
            <Box square sx={{
                width: "100%",
                position: "sticky",
                top: "0px",
                background: theme.palette.grey.translucent,
                zIndex: 100
            }}
                component={Paper}
            >
                <ListItemButton
                    onClick={() => {
                        setExpandedSection((expandedSection) => (
                            expandedSection == id ? null : id
                        ))
                    }}
                > 
                    <AccordionSummary sx={{width: "100%"}}
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography variant="h6">{description}</Typography>
                    </AccordionSummary>
                </ListItemButton>
            </Box>

            <AccordionDetails >
                <Stack direction="column" spacing={1}>
                    {children}
                </Stack>
            </AccordionDetails>
            
        </Accordion>

    )
}


const getSwappedImageArray = (images, imageIdA, imageIdB) => {
    const imageA = images.find((image) => image.image_id == imageIdA);
    const imageB = images.find((image) => image.image_id == imageIdB);
    if(!imageA || !imageB)
        return images;

    return images.map((image) => {
        switch (image.image_id) {
            case imageIdA:
                return imageB;
            case imageIdB:
                return imageA;
            default:
                return image;
        }
    })
}



export const ImageRearrangeDialog = ({imageRearrangerIsOpen, setImageRearrangerIsOpen, exhibitionState, exhibitionEditDispatch, globalImageCatalog}) => {

    const [currentWall, setCurrentWall] = useState(1);

    const imagesOnWall = exhibitionState.images.filter((i) => i.metadata?.direction == currentWall);

    const handleImageSwap = (aId, bId) => {
        const newArray = getSwappedImageArray(exhibitionState.images, aId, bId);
        exhibitionEditDispatch({
            scope: "exhibition",
            type: "set_images",
            newImages: newArray
        })
    }

    return (
        <Dialog open={imageRearrangerIsOpen}
            sx={{zIndex: 10000}} fullWidth maxWidth="md"
        >
            <DialogTitle>Rearrange images</DialogTitle>
            <DialogContent>

                <ToggleButtonGroup value={currentWall} exclusive sx={{
                    width: "100%"
                }}>
                    {directionOptions.map((option) => (
                        <ToggleButton key={option.value} selected={option.value == currentWall} value={option.value} sx={{
                            textTransform: "unset",
                            width: "100%"
                        }}
                        onClick={(e) => {
                            setCurrentWall(e.target.value)
                        }}
                        >
                            <Typography>{option.displayText}</Typography>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </DialogContent>
            <DialogContent>
                <Stack direction="row" width="100%" spacing={2}>
                    {imagesOnWall.length > 0 && imagesOnWall.map((i, index) => {
                        const catalogImage = globalImageCatalog.find((gi) => gi.id == i.image_id)
                        return (
                            <Stack key={i.image_id} direction="column" justifyItems="center" alignItems="center" spacing={2}>
                                <Box width="150px" height="150px" sx={{
                                    backgroundImage: `url(${catalogImage.thumbnailUrl})`,
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat"
                                }}>
                                    {!catalogImage.thumbnailUrl && (
                                        <BrokenImageIcon sx={{
                                            opacity: 0.2,
                                            width: "100%",
                                            height: "100%"
                                        }} />
                                    )}
                                </Box>
                                <Typography>{catalogImage.title}</Typography>
                                <Stack direction="row">
                                    <IconButton disabled={index == 0} onClick={() => {
                                        handleImageSwap(imagesOnWall[index - 1].image_id, i.image_id)
                                    }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <IconButton disabled={index == imagesOnWall.length - 1} onClick={() => {
                                        handleImageSwap(imagesOnWall[index + 1].image_id, i.image_id)
                                    }}>
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Stack>
                            </Stack> 
                            )
                        })
                    || imagesOnWall.length == 0 && (
                        <Stack spacing={1}>
                            <Typography>The selected wall contains no images.</Typography>
                            
                        </Stack>

                    )
                    }
                </Stack>
            </DialogContent>
            <DialogContent>
                <Typography sx={{
                    opacity: 0.5
                }}>To move images between walls, close this dialog, select the image you want to move, and use the dropdown menu to select the destination wall.</Typography>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1} width="100%" justifyContent="right">
                    <Button variant="contained" sx={{
                        width: "30%"
                    }} onClick={() => {
                        setImageRearrangerIsOpen(false);
                    }}>
                        <Typography variant="h6">Close</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


export const ImageChooserDialog = ({imageChooserIsOpen, setImageChooserIsOpen, exhibitionState, setSelectedImageId, exhibitionEditDispatch}) => {
    
    const [imageChooserSelectedImage, setImageChooserSelectedImage] = useState(null);

    return (
        <Dialog component="form" open={imageChooserIsOpen} 
            sx={{zIndex: 10000}} fullWidth maxWidth="xl" onSubmit={(e) => {
            e.preventDefault();
            exhibitionEditDispatch({
                scope: "exhibition",
                type: "add_image",
                image_id: imageChooserSelectedImage.id
            })
            setImageChooserIsOpen(false);
            setImageChooserSelectedImage(null);
            setSelectedImageId(imageChooserSelectedImage.id)
        }}>
            <DialogTitle>Choose an image</DialogTitle>
            <DialogContent>
                <CollectionBrowser selectedItem={imageChooserSelectedImage} isDialogMode={true}
                    setSelectedItem={setImageChooserSelectedImage} disabledImages={exhibitionState.images} />
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1} width="100%" justifyContent="right">
                    <Button variant="outlined" sx={{
                        width: "30%"
                    }} onClick={() => {
                        setImageChooserIsOpen(false);
                    }}>
                        <Typography variant="h6">Cancel</Typography>
                    </Button>
                    <Button variant="contained" sx={{
                        width: "30%"
                    }} type="submit" disabled={!imageChooserSelectedImage} startIcon={<AddPhotoAlternateIcon />}>
                        <Typography variant="h6">Add to exhibition</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


export const ExhibitionEditPane = ({exhibitionId, exhibitionMetadata, exhibitionState, exhibitionEditDispatch, globalImageCatalog, editModeActive, exhibitionIsLoaded, saveExhibition}) => {
    
    const [expandedSection, setExpandedSection] = useState(null);

    const [selectedImageId, setSelectedImageId] = useState(null);

    const [imageChooserIsOpen, setImageChooserIsOpen] = useState(false);
    const [imageRearrangerIsOpen, setImageRearrangerIsOpen] = useState(false);

    const [deleteImageDialogIsOpen, setDeleteImageDialogIsOpen] = useState(false);

    const theme = useTheme();


    useEffect(() => {
        const saveInterval = setInterval(saveExhibition, 30000);
        return () => {
            clearInterval(saveInterval);
        }
    })


    return (
        
        <Box component={Paper} square
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: `60px calc(100vh - 184px) 60px`,
                gridTemplateAreas: `
                    "header"
                    "accordions"
                    "footer"
                `,
                zIndex: 50
            }}
        >

            <Box padding={2} sx={{
                gridArea: "header",
                backgroundColor: theme.palette.grey.veryTranslucent
            }}>
                <Typography variant="h5" align="center">{exhibitionMetadata.title}</Typography>
            </Box>

            <Box sx={{gridArea: "accordions", overflowY: "scroll"}} >

                <ExhibitionOptionGroup 
                    id="exhibition_settings"
                    description="Exhibition Settings"
                    {...{expandedSection, setExpandedSection}}
                >
                    <AccordionSubHeading text="Room Appearance" />
                    <ExhibitionOption description="Main Wall Color">
                        <ColorInput value={exhibitionState.appearance.main_wall_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_main_wall_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>
                    <ExhibitionOption description="Side Wall Color">
                        <ColorInput value={exhibitionState.appearance.side_wall_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_side_wall_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>
                    <ExhibitionOption description="Floor Color">
                        <ColorInput value={exhibitionState.appearance.floor_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_floor_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>
                    <ExhibitionOption description="Ceiling Color">
                        <ColorInput value={exhibitionState.appearance.ceiling_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_ceiling_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>
                    <ExhibitionOption description="Floor Texture">
                    <Select value={exhibitionState.appearance.floor_texture ?? ''} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_floor_texture",
                                    newTexture: e.target.value
                                })
                            }}
                        >
                            {textureOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.displayText}</MenuItem>
                            ))}
                        </Select>
                    </ExhibitionOption>
                    
                    <AccordionSubHeading text="Ambient Lighting" />

                    <ExhibitionOption description="Moodiness">
                        <Select value={exhibitionState.appearance.moodiness ?? ''} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_moodiness",
                                    newMoodiness: e.target.value
                                })
                            }}
                        >
                            {moodinessOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.displayText}</MenuItem>
                            ))}
                        </Select>
                    </ExhibitionOption>
                    <ExhibitionOption description="Ambient Light Color">
                        <ColorInput value={exhibitionState.appearance.ambient_light_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_ambient_light_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>

                    <AccordionSubHeading text="Exhibition Dimensions" />

                    <ExhibitionOption description="Length">
                        <Input type="number" value={exhibitionState.size.length_ft ?? 0}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_length",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>
                    <ExhibitionOption description="Width">
                        <Input type="number" value={exhibitionState.size.width_ft ?? 0}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_width",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>
                    <ExhibitionOption description="Height">
                        <Input type="number" value={exhibitionState.size.height_ft ?? 0}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_height",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>

                </ExhibitionOptionGroup>

                <ExhibitionOptionGroup
                    id="image_settings"
                    description="Image Settings"
                    {...{expandedSection, setExpandedSection, selectedImageId, setSelectedImageId}}
                >


<ExhibitionOption>
                        
                        <Button variant="contained" sx={{
                            width: "100%"
                        }}
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => {
                                setImageChooserIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Add Image</Typography>
                        </Button>
                    </ExhibitionOption>

                    <ExhibitionOption>
                        
                        <Button variant="outlined"  sx={{
                            width: "100%"
                        }}
                            startIcon={<CollectionsIcon />}
                            onClick={() => {
                                setImageRearrangerIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Rearrange Images</Typography>
                        </Button>

                    </ExhibitionOption>


                    <ExhibitionOption>

                        <Select sx={{width: "100%", minHeight: "70px"}} 
                            disabled={!Boolean(exhibitionState.images?.length)}
                            value={selectedImageId ?? ""} 
                            onChange={(e) => {
                                setSelectedImageId(e.target.value)
                            }}
                        >
                            {(exhibitionState.images ?? []).map((image) => {
                                const catalogImage = globalImageCatalog?.find((i) => i.id == image.image_id);
                                const image_title = catalogImage?.title;
                                return (
                                    <MenuItem key={image.image_id} value={image.image_id ?? ''}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box width="40px" height="40px" sx={{
                                                backgroundImage: `url(${catalogImage?.thumbnailUrl})`,
                                                backgroundSize: "contain",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center"
                                            }} />
                                            <Typography>{image_title}</Typography>
                                        </Stack>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                        
                        <IconButton variant="contained" disabled={!selectedImageId}
                            onClick={() => {
                                setDeleteImageDialogIsOpen(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>

                    </ExhibitionOption>

                    
                    { selectedImageId && ( <>
                    <AccordionSubHeading text="Position" />

                    <ExhibitionOption description="Wall">
                        <Select value={getImageStateById(exhibitionState, selectedImageId)?.metadata.direction ?? ''} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_direction",
                                    newValue: e.target.value
                                })
                            }}
                        >
                            {directionOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.displayText}</MenuItem>
                            ))}
                        </Select>

                    </ExhibitionOption>

                    <ExhibitionOption description="Custom Position">
                        

                        <Checkbox 
                            checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.position.custom_position)} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_position_custom_enabled",
                                    isEnabled: e.target.checked
                                })
                            }}
                        />
                        
                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_x ?? ""}
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.position.custom_position)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_position_custom_x",
                                    newValue: e.target.value
                                })
                            }}
                        />

                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_y ?? ""}
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.position.custom_position)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_position_custom_y",
                                    newValue: e.target.value
                                })
                            }}
                        />

                    </ExhibitionOption>

                    <AccordionSubHeading text="Matte" />
                    <ExhibitionOption description="Color">
                        <ColorInput value={getImageStateById(exhibitionState, selectedImageId)?.matte.color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_matte_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />

                    </ExhibitionOption>

                    <ExhibitionOption description="Custom Weight">
                        
                        <Checkbox 
                            checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.matte.weighted)} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_matte_weight_enabled",
                                    isEnabled: e.target.checked
                                })
                            }}
                        />
                        
                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.matte.weighted_value ?? ""}
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.matte.weighted)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_matte_weight_value",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>

                    <AccordionSubHeading text="Frame" />
                    <ExhibitionOption description="Custom Frame">
                        <Checkbox 
                            checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.frame.custom)} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_frame_custom_enabled",
                                    isEnabled: e.target.checked
                                })
                            }}
                        />

                    </ExhibitionOption>

                    <ExhibitionOption description="Color">
                        <ColorInput value={getImageStateById(exhibitionState, selectedImageId)?.frame.color} 
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.frame.custom)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_frame_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />

                    </ExhibitionOption>

                    <ExhibitionOption description="Width">
                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.frame.width ?? ""}
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.frame.custom)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_frame_width",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Height">
                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.frame.height ?? ""}
                            disabled={!Boolean(getImageStateById(exhibitionState, selectedImageId)?.frame.custom)}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_frame_height",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>

                    <AccordionSubHeading text="Spotlight" />
                    <ExhibitionOption description="Color">
                        <ColorInput value={getImageStateById(exhibitionState, selectedImageId)?.light.color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_light_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </ExhibitionOption>

                    <ExhibitionOption description="Intensity">
                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.light.intensity ?? ""}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_light_intensity",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>
                    
                    <AccordionSubHeading text="Curator's Notes" />
                    <ExhibitionOption vertical description="Description">
                        <TextField type="textarea" multiline rows={4}
                        variant="outlined" placeholder="Enter text"
                            value={getImageStateById(exhibitionState, selectedImageId)?.metadata.description ?? ""}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_description",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption vertical description="Additional Information">
                        <TextField type="textarea" multiline rows={2}
                            variant="outlined" placeholder="Enter text"
                            value={getImageStateById(exhibitionState, selectedImageId)?.metadata.additional_information ?? ""}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_additional_information",
                                    newValue: e.target.value
                                })
                            }}
                        />
                    </ExhibitionOption>
                    </>
                    )}
                    
                </ExhibitionOptionGroup>

            </Box>

            <Stack direction="row" 
                alignItems="center" 
                justifyContent="center" 
                sx={{
                    width: "100%", 
                    height: "100%", 
                    gridArea: "footer",
                    backgroundColor: theme.palette.grey.veryTranslucent
                }} 
            >
                
                <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={saveExhibition} >
                    <Typography variant="body1">Save</Typography>
                </Button>
                
            </Stack>


            <ImageChooserDialog {...{imageChooserIsOpen, setImageChooserIsOpen, setSelectedImageId,
                exhibitionState, exhibitionEditDispatch}} />

            <ImageRearrangeDialog {...{imageRearrangerIsOpen, setImageRearrangerIsOpen, exhibitionState, exhibitionEditDispatch, globalImageCatalog}} />

            <Dialog component="form" open={deleteImageDialogIsOpen} 
                sx={{zIndex: 10000}}onSubmit={(e) => {
                e.preventDefault();
                exhibitionEditDispatch({
                    scope: "exhibition",
                    type: "remove_image",
                    image_id: selectedImageId
                })
                setDeleteImageDialogIsOpen(false);
                setSelectedImageId(null);
            }}>
                <DialogTitle>Remove image</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove this image?</Typography>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={1} width="100%" justifyContent="space-between">
                        <Button variant="outlined" onClick={() => {
                            setDeleteImageDialogIsOpen(false);
                        }}>
                            <Typography>Cancel</Typography>
                        </Button>
                        <Button variant="contained" type="submit" >
                            <Stack direction="row" spacing={1}>
                                <DeleteIcon />
                                <Typography>Remove</Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>


        </Box>
    )
}