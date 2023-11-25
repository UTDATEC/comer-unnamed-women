import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../ExhibitionEditPane/ExhibitionEditPane";
import { useReducer } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "./exhibitionEditReducer";


export const ExhibitionPage = (props) => {

    const { exhibitionId } = useParams();

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);

    return (
        <Box 
            sx={{
                width: "100%", 
                height: "100%",
                display: "grid",
                gridTemplateRows: '1fr',
                gridTemplateColumns: 'calc(100vw - 300px) 300px',
                gridTemplateAreas: `
                    "viewer editpane"
                `
            }}

        >

            <Box sx={{gridArea: "viewer"}}>
                Viewer placeholder
            </Box>

            <ExhibitionEditPane {...{exhibitionId, exhibitionState, exhibitionEditDispatch}} 
                sx={{gridArea: "editpane"}} 
            />

        </Box>
    )
}