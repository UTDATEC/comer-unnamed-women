import React from 'react';
import "../AccountNav.css";

// Import image files
import profileIcon from '../image/profileIcon.png';
import ExhibitionIcon from '../image/exhibitionIcon.png';
import ImageIcon from '../image/imageIcon.png';
import LogoutIcon from '../image/logoutIcon.png';

export const CuratorNavData = [
    {
        title: "Profile",
        icon: <img src={profileIcon} alt="Profile" className="icon-small" />,
        link: "/Curator/Profile"
    },
    {
        title: "Exhibition",
        icon: <img src={ExhibitionIcon} alt="ExhibitionIcon" className="icon-small" />,
        link: "/Curator/ExhibitionList"
    },
    {
        title: "Image",
        icon: <img src={ImageIcon} alt="ImageIcon" className="icon-small" />,
        link: "/Curator/ImageList"
    },
    {
        title: "Logout",
        icon: <img src={LogoutIcon} alt="LogoutIcon" className="icon-small" />,
        link: "/"
    }
]