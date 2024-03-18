import { Dialog, Stack, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";
import { PersonIcon } from "../../IconImports";

export const ImageFullScreenViewer = ({ image, setImage, previewerOpen, setPreviewerOpen }) => {
    const fields = [
        {
            fieldName: "accessionNumber",
            displayName: "Accession Number"
        },
        {
            fieldName: "year",
            displayName: "Year"
        },
        {
            fieldName: "additionalPrintYear",
            displayName: "Additional Print Year"
        },
        {
            fieldName: "medium",
            displayName: "Medium"
        },
        {
            fieldName: "edition",
            displayName: "Edition"
        },
        {
            fieldName: "condition",
            displayName: "Condition"
        },
        {
            fieldName: "valuationNotes",
            displayName: "Valuation Notes"
        },
        {
            fieldName: "other notes",
            displayName: "Other Notes"
        },
        {
            fieldName: "copyright",
            displayName: "Copyright"
        },
        {
            fieldName: "subject",
            displayName: "Subject"
        },
        {
            fieldName: "location",
            displayName: "Location"
        }];


    const artists = image?.Artists.sort((a, b) => {
        return a.fullNameReverse < b.fullNameReverse ? 1 : -1;
    });
    
    
    return image && (
        <Dialog open={previewerOpen}  maxWidth="lg"  sx={{zIndex: 5000}}>
            
            <DialogTitle textAlign="center" variant="h4">{image.title}</DialogTitle>

            <DialogContent sx={{height: "100%",
                display: "grid",
                gridTemplateColumns: "20px 60% 30px 30% 20px",
                gridTemplateRows: "1fr",
                gridTemplateAreas: `
                        'paddingLeft image paddingMiddle fields paddingRight'
                    `,
                overflow: "hidden"
            }}>
                <Stack gridArea="image" maxHeight="500px" alignContent="center">
                    <img src={`${process.env.REACT_APP_API_HOST}/api/collection/images/${image.id}/download`} 
                        style={{objectFit: "contain"}} width="auto" height="100%"
                    />
                </Stack>
                <Stack gridArea="fields" overflow="auto" spacing={2}>
                    {/* Artists */}
                    <Stack direction="column">
                        <Typography variant="h6">{
                            artists.length <= 1 && "Artist" || 
                            artists.length > 1 && "Artists"
                        }</Typography>
                        {artists.length >= 1 && artists.map((a) => (
                            <Stack direction="row" alignItems="center" key={a.id}>
                                <PersonIcon />
                                <Typography variant="body1">{a.safe_display_name}</Typography>
                            </Stack>
                        )) || artists.length == 0 && (
                            <Stack direction="row" alignItems="center">
                                <PersonIcon opacity="0.5" />
                                <Typography sx={{opacity: 0.5}} variant="body1">No artist listed</Typography>
                            </Stack>
                        )}
                    </Stack>
                    <Stack direction="column" alignItems="left" spacing={2} height="100%">
                        {fields.map((field) => image[field.fieldName] && (
                            <Stack direction="column" key={field.fieldName}>
                                <Typography variant="h6">{field.displayName}</Typography>
                                <Typography sx={{opacity: 0.5}} variant="body1">{
                                    image[field.fieldName]
                                }</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => {
                    setPreviewerOpen(false);
                    setImage(null);
                }}>
                    <Typography variant="body1">Close</Typography>
                </Button>
            </DialogActions>

        </Dialog>
    );
};