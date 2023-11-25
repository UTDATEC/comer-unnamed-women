import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Input, ListItemButton, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"


const ColorInput = ({value, onChange}) => {
    return (
        <input type="color" sx={{width: "100%"}} {...{value, onChange}} />
    )
}

const AccordionSubHeading = ({text}) => {
    return (
        <Typography variant="h6" align="center" sx={{opacity: 0.5}}>{text}</Typography>
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
    return (
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
            <Typography variant="body1">{description}</Typography>
            {children}
        </Stack>
    )
}


export const ExhibitionEditPane = ({exhibitionId, exhibitionState, exhibitionEditDispatch}) => {
    
    const [expandedSection, setExpandedSection] = useState(null);

    return (
        
        <Box component={Paper} square>
            <Accordion disableGutters expanded={expandedSection == "exhibition_settings"}
                onChange={(e, isExpanded) => {
                    setExpandedSection(isExpanded ? "exhibition_settings" : null);
                }}
            >
                <ListItemButton sx={{width: "100%"}}>
                    <AccordionSummary sx={{width: "100%"}}
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography variant="h6">Exhibition Settings</Typography>
                    </AccordionSummary>
                </ListItemButton>
                <AccordionDetails>
                    <Stack direction="column" spacing={1}>
                        <AccordionSubHeading text="Room Appearance" />
                        <ExhibitionOption description="Main Wall Color">
                            <ColorInput value={exhibitionState.appearance.main_wall_color} 
                                onChange={(e) => {
                                    exhibitionEditDispatch({
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

                        <Divider />
                        
                        <AccordionSubHeading text="Ambient Lighting" />

                        <ExhibitionOption description="Moodiness">
                            <Select value={exhibitionState.appearance.moodiness} 
                                onChange={(e) => {
                                    exhibitionEditDispatch({
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
                        
                    </Stack>
                        
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}