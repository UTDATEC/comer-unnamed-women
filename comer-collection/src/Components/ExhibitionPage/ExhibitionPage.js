import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../ExhibitionEditPane/ExhibitionEditPane";
import { useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "./exhibitionEditReducer";
import ExhibitionViewer from "../ExhibitionViewer/ExhibitionViewer";
import { sendAuthenticatedRequest } from "../Users/Tools/HelperMethods/APICalls";
import { useAppUser } from "../App/AppUser";
import Unauthorized from "../ErrorPages/Unauthorized";
import { useSnackbar } from "../App/AppSnackbar";
import { useTitle } from "../App/AppTitle";


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
        const catalogData = await sendAuthenticatedRequest("GET", "/api/public/images");
        setGlobalImageCatalog(catalogData.data);
    }

    const [appUser, setAppUser] = useAppUser();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle();

    
    const getSaveUrl = () => {
        if(appUser?.Exhibitions.filter((ex) => ex.id == exhibitionId).length) {
            return `/api/user/exhibitions/${exhibitionId}/save`;
        } else if(appUser?.is_admin) {
            return `/api/admin/exhibitions/${exhibitionId}/save`;
        } else {
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
        if(appUser?.Exhibitions.filter((ex) => ex.id == exhibitionId).length) {
            return `/api/user/exhibitions/${exhibitionId}/load`;
        } else if(appUser?.is_admin) {
            return `/api/admin/exhibitions/${exhibitionId}/load`;
        } else {
            return `/api/public/exhibitions/${exhibitionId}/load`;
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
                setTitleText(exhibitionData.data?.title)
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


    const handleControlS = (e) => {
        if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == 's') {
            e.preventDefault();
            saveExhibition();
        }
    }
        
    useEffect(() => {
        if(editModeActive) {
            document.addEventListener('keydown', handleControlS);
            return () => {
                document.removeEventListener('keydown', handleControlS);
            }
        }
    }, [editModeActive])



    return !isPermissionGranted && (
        <Unauthorized message="This exhibition is not available" buttonText="View Public Exhibitions" 
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