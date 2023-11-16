import React from 'react';

// Import image files
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import ImageIcon from '@mui/icons-material/Image';


export const CuratorNavData = [
    {
        title: "Profile",
        icon: <AccountCircleIcon fontSize="large"/>,
        link: "/Curator/Profile"
    },
    {
        title: "Exhibition",
        icon: <PhotoCameraBackIcon fontSize="large"/>,
        link: "/Curator/ExhibitionList"
    },
    {
        title: "Image",
        icon: <ImageIcon fontSize="large"/>,
        link: "/Curator/ImageList"
    },
]