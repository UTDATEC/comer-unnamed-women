import React from 'react';

// Import image files
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import ImageIcon from '@mui/icons-material/Image';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';


export const AdminNavData = [
    {
        title: "Profile",
        icon: <AccountCircleIcon fontSize="large"/>,
        link: "/Admin/Profile"
    },
    {
        title: "Curator",
        icon: <GroupsIcon fontSize="large"/>,
        link: "/Admin/CuratorList"
    },
    {
        title: "Exhibition",
        icon: <PhotoCameraBackIcon fontSize="large"/>,
        link: "/Admin/ExhibitionList"
    },
    {
        title: "Image Management",
        icon: <ImageIcon fontSize="large"/>,
        link: "/Admin/ImageList"
    },
    {
        title: "Course",
        icon: <SchoolIcon fontSize="large"/>,
        link: "/Admin/Course"
    },
    {
        title: "Invite",
        icon: <GroupAddIcon fontSize="large"/>,
        link: "/Admin/Invite"
    }
]