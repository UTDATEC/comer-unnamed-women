import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../ExhibitionEditPane/ExhibitionEditPane";
import { useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "./exhibitionEditReducer";
import ExhibitionViewer from "../ExhibitionViewer/ExhibitionViewer";
import primary_json from "../ExhibitionViewer/example2.json"
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";

export const ExhibitionPage = (props) => {

    const { exhibitionId } = useParams();

    const [globalImageCatalog, setGlobalImageCatalog] = useState([]);    

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);
    const [exhibitionIsLoaded, setExhibitionIsLoaded] = useState(false);

    const loadCatalog = async() => {
        const catalogData = await sendAuthenticatedRequest("GET", "/api/collection/images");
        setGlobalImageCatalog(catalogData.data);
    }

    const loadExhibition = async() => {
        const exhibitionData = await sendAuthenticatedRequest("GET", `/api/account/exhibitions/${exhibitionId}/load`);
        console.log(exhibitionData.data.data);
        // console.log("exhibitionData", exhibitionData)
        if(exhibitionData.data?.data) {
            exhibitionEditDispatch({
                scope: "exhibition",
                type: "set_everything",
                newExhibition: JSON.parse(exhibitionData.data.data)
            });
        }
        setExhibitionIsLoaded(true);
        // return exhibitionData;
    }

    useEffect(() => {
        loadExhibition();
        loadCatalog();
    }, [])


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

            <ExhibitionViewer {...{exhibitionState, exhibitionIsLoaded, globalImageCatalog}}
                sx={{gridArea: "viewer", width: "100%", height: "100%"}}
            />

            <ExhibitionEditPane {...{exhibitionId, exhibitionState, exhibitionEditDispatch, globalImageCatalog}} 
                sx={{gridArea: "editpane"}} 
            />

        </Box>
    )
}