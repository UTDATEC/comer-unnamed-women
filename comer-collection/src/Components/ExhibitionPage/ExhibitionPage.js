import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../ExhibitionEditPane/ExhibitionEditPane";
import { useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "./exhibitionEditReducer";
import ExhibitionViewer from "../ExhibitionViewer/ExhibitionViewer";
import primary_json from "../ExhibitionViewer/example2.json"
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { useAppUser } from "../App/AppUser";
import Unauthorized from "../ErrorPages/Unauthorized";
import { useSnackbar } from "../App/AppSnackbar";


export const ExhibitionPage = (props) => {
    
    const onUnload = async() => {
        await saveExhibition();
        return false;
    }
    

    const { exhibitionId } = useParams();

    const [globalImageCatalog, setGlobalImageCatalog] = useState([]);   
    
    const [exhibitionMetadata, setExhibitionMetadata] = useState(null);

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);
    const [exhibitionIsLoaded, setExhibitionIsLoaded] = useState(false);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [exhibitionIsEditable, setExhibitionIsEditable] = useState(false);
    const [editModeActive, setEditModeActive] = useState(false);

    const loadCatalog = async() => {
        const catalogData = await sendAuthenticatedRequest("GET", "/api/collection/images");
        setGlobalImageCatalog(catalogData.data);
    }

    const [appUser, setAppUser] = useAppUser();
    const showSnackbar = useSnackbar();

    
    const getSaveUrl = () => {
        switch (true) {
            case appUser && appUser.is_admin:
                return `/api/exhibitions/${exhibitionId}/save`
            case appUser && !appUser.is_admin:
                return `/api/account/exhibitions/${exhibitionId}/save`
            default:
                throw Error("Save operation is not permitted");
        }
    }

    const saveExhibition = async() => {
        try {
            const saveUrl = getSaveUrl();
            try {
                await sendAuthenticatedRequest("PUT", saveUrl, {
                    data: JSON.stringify(exhibitionState)
                });
                window.onbeforeunload = null;
                showSnackbar("Exhibition saved", "success")
            } catch(e) {
                console.log("Error saving exhibition", e.message);
                showSnackbar("Could not save exhibition", "error");
            }
        } catch(e) {
            console.log("No save URL available", e.message)
        }
    }


    const getLoadUrl = () => {
        switch (true) {
            case appUser && appUser.is_admin:
                return `/api/exhibitions/${exhibitionId}/load`;
            case appUser && !appUser.is_admin:
                return `/api/account/exhibitions/${exhibitionId}/load`;
            default:
                return `/api/exhibitions/public/${exhibitionId}/load`;
        }
    }
    
    const loadExhibition = async() => {
        try {
            const exhibitionData = await sendAuthenticatedRequest("GET", getLoadUrl());

            setIsPermissionGranted(true);

            if(exhibitionData.data) {
                setExhibitionMetadata(exhibitionData.data);

                if(exhibitionData.data?.data) {
                    exhibitionEditDispatch({
                        scope: "exhibition",
                        type: "set_everything",
                        newExhibition: JSON.parse(exhibitionData.data.data)
                    });
                }
                if(exhibitionData.data?.isEditable) {
                    setExhibitionIsEditable(true);
                }
                setExhibitionIsLoaded(true);
            }
            
        } catch(e) {
            console.log("Error getting permission to open exhibition")
            setIsPermissionGranted(false);
        }
    }

    useEffect(() => {
        loadExhibition();
        loadCatalog();
    }, [appUser])

    

    useEffect(() => {
        if(exhibitionIsLoaded) {
            window.onbeforeunload = onUnload;
            return () => {
                window.onbeforeunload = null;
            }
        }
    }, [exhibitionState])

    
    useEffect(() => {
        if(exhibitionIsLoaded && !editModeActive)
            saveExhibition();
    }, [editModeActive])



    return !isPermissionGranted && (
        <Unauthorized message="This exhibition is private" buttonText="View Public Exhibitions" 
                buttonDestination="/Exhibitions" />
    ) || isPermissionGranted && (
        <Box 
            sx={{
                width: "100%", 
                height: "100%",
                display: "grid",
                gridTemplateRows: '1fr',
                gridTemplateColumns: editModeActive ? 'calc(100vw - 300px) 300px' : '100vw 0px',
                gridTemplateAreas: `
                    "viewer editpane"
                `
            }}>

            <ExhibitionViewer {...{exhibitionState, exhibitionMetadata, exhibitionIsLoaded, globalImageCatalog, exhibitionIsEditable, editModeActive, setEditModeActive}}
                sx={{gridArea: "viewer", width: "100%", height: "calc(100vh - 64px)"}}
            />

            {editModeActive && (
                <ExhibitionEditPane {...{exhibitionId, exhibitionMetadata, exhibitionIsLoaded, exhibitionState, exhibitionEditDispatch, globalImageCatalog, editModeActive, setEditModeActive, saveExhibition}} 
                    sx={{
                        gridArea: "editpane",
                        display: editModeActive ? "" : "none"
                    }} 
                />
            )}
            

        </Box>
    )
}