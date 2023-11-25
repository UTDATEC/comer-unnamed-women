import { Accordion, AccordionDetails, AccordionSummary, Box, Input, ListItemButton, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"


const ColorInput = ({value, onChange}) => {
    return (
        <input type="color" sx={{width: "100%"}} {...{value, onChange}} />
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
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="body1">Main Wall Color</Typography>
                        <ColorInput value={exhibitionState.appearance.main_wall_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    type: "set_main_wall_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="body1">Side Wall Color</Typography>
                        <ColorInput value={exhibitionState.appearance.side_wall_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    type: "set_side_wall_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="body1">Floor Color</Typography>
                        <ColorInput value={exhibitionState.appearance.floor_color} 
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    type: "set_floor_color",
                                    newColor: e.target.value
                                }
                            )
                        }} />
                    </Stack>
                        
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}