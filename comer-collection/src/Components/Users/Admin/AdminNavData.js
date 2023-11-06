import React from 'react';
import "../AccountNav.css";

// Import image files
import profileIcon from '../image/profileIcon.png';
import StudentIcon from '../image/studentIcon.png';
import ExhibitionIcon from '../image/exhibitionIcon.png';
import ImageIcon from '../image/imageIcon.png';
import InviteIcon from '../image/inviteIcon.png';
import LogoutIcon from '../image/logoutIcon.png';

export const AdminNavData = [
    {
        title: "Profile",
        icon: <img src={profileIcon} alt="Profile" className="icon-small" />,
        link: "/Admin/Profile"
    },
    {
        title: "Curator",
        icon: <img src={StudentIcon} alt="CuratorIcon" className="icon-small" />,
        link: "/Admin/CuratorList"
    },
    {
        title: "Exhibition",
        icon: <img src={ExhibitionIcon} alt="ExhibitionIcon" className="icon-small" />,
        link: "/Admin/ExhibitionList"
    },
    {
        title: "Image",
        icon: <img src={ImageIcon} alt="ImageIcon" className="icon-small" />,
        link: "/Admin/ImageList"
    },
    {
        title: "Invite",
        icon: <img src={InviteIcon} alt="InviteIcon" className="icon-small" />,
        link: "/Admin/Invite"
    },
    {
        title: "Logout",
        icon: <img src={LogoutIcon} alt="LogoutIcon" className="icon-small" />,
        link: "/"
    }
]