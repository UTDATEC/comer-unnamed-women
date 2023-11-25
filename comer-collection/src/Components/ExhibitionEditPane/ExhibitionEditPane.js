import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Input, ListItemButton, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import { useTheme } from "@emotion/react";
import { getImageStateById } from "../ExhibitionPage/exhibitionEditReducer";


const ColorInput = ({value, onChange}) => {
    return (
        <input type="color" sx={{width: "100%"}} 
            value={value ?? ""}
            {...{onChange}} 
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


const ExhibitionOption = ({description, children}) => {
    const theme = useTheme();
    return (
        <Stack direction="row" alignItems="center" spacing={1} 
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
        <Accordion disableGutters expanded={expandedSection == id}
            onChange={(e, isExpanded) => {
                setExpandedSection(isExpanded ? id : null);
            }}>
            <Box square sx={{
                width: "100%",
                position: "sticky",
                top: "0px",
                background: theme.palette.grey.translucent,
            }}
                component={Paper}
            >
                <ListItemButton
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


export const ExhibitionEditPane = ({exhibitionId, exhibitionState, exhibitionEditDispatch}) => {
    
    const [expandedSection, setExpandedSection] = useState(null);

    const [selectedImageId, setSelectedImageId] = useState(null);

    const theme = useTheme();

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
                `
            }}
        >

            <Box padding={2} sx={{
                gridArea: "header",
                backgroundColor: theme.palette.grey.veryTranslucent
            }}>
                <Typography variant="h5" align="center">Exhibition ID: {exhibitionId}</Typography>
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
                        <Button disabled>
                            <Typography variant="body1">Select</Typography>
                        </Button>
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

                    <Stack direction="row" alignItems="center" justifyContent="center">

                        <Select value={selectedImageId ?? ""} 
                            onChange={(e) => {
                                setSelectedImageId(e.target.value)
                            }}
                        >
                            {(exhibitionState.images ?? []).map((image) => (
                                <MenuItem key={image.image_id} value={image.image_id ?? ''}>{image.image_id}</MenuItem>
                            ))}
                        </Select>
                        
                        <Button variant="contained" 
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "add_image",
                                    image_id: exhibitionState.images.length + 1
                                })
                            }}
                        >
                            <Typography variant="body1">Add Image</Typography>
                        </Button>
                    </Stack>

                    <AccordionSubHeading text="Position" />
                    <ExhibitionOption description="X">

                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_x ?? ""}
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "image",
                                    image_id: selectedImageId,
                                    type: "set_position_custom_x",
                                    newValue: e.target.value
                                })
                            }}
                        />

                    </ExhibitionOption>
                    <ExhibitionOption description="Y">

                        <Input type="number"
                            value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_y ?? ""}
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
                
                <Button disabled variant="contained" startIcon={<CloudUploadIcon />}>
                    <Typography variant="body1">Save</Typography>
                </Button>
                
            </Stack>


        </Box>
    )
}