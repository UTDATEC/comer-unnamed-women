import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../ExhibitionEditPane/ExhibitionEditPane";
import { useReducer } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "./exhibitionEditReducer";
import ExhibitionViewer from "../ExhibitionViewer/ExhibitionViewer";
import primary_json from "../ExhibitionViewer/example2.json"


export const ExhibitionPage = (props) => {

    const { exhibitionId } = useParams();

    

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, primary_json);

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

            <ExhibitionViewer {...{exhibitionState}}
                sx={{gridArea: "viewer", width: "100%", height: "100%"}}
            />

            <ExhibitionEditPane {...{exhibitionId, exhibitionState, exhibitionEditDispatch}} 
                sx={{gridArea: "editpane"}} 
            />

        </Box>
    )
}