import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../IconImports.js";
import { useAppUser } from "../App/AppUser.js";
import { useAccountNav } from "./Account.js";

const navLinks = [
    {
        title: "Profile",
        Icon: AccountCircleIcon,
        link: "/Account/Profile",
        requirePermanentPassword: true
    },
    {
        title: "My Exhibitions",
        Icon: PhotoCameraBackIcon,
        link: "/Account/MyExhibitions",
        requirePermanentPassword: true
    },
    {
        title: "Change Password",
        Icon: LockIcon,
        link: "/Account/ChangePassword"
    },
];
  
const adminNavLinks = [
    {
        title: "Image Management",
        Icon: ImageIcon,
        link: "/Account/ImageManagement",
        requirePermanentPassword: true
    },
    {
        title: "User Management",
        Icon: GroupsIcon,
        link: "/Account/UserManagement",
        requirePermanentPassword: true
    },
    {
        title: "Exhibition Management",
        Icon: PhotoCameraBackIcon,
        link: "/Account/ExhibitionManagement",
        requirePermanentPassword: true
    },
    {
        title: "Course Management",
        Icon: SchoolIcon,
        link: "/Account/CourseManagement",
        requirePermanentPassword: true
    }

];



const AccountNav = () => {

    const [selectedNavItem, setSelectedNavItem] = useAccountNav();

    const navigate = useNavigate();
    const location = useLocation();
    const [appUser] = useAppUser();
    const theme = useTheme();

    return (
        <Stack direction="column" sx={{ backgroundColor: "#222", height: "100%", color: "white" }}>
            <Typography variant="h5" alignSelf="center" paddingTop="10px">Account</Typography>
            <List>
                {navLinks.map((item) => (
                    <ListItemButton disabled={Boolean(item.requirePermanentPassword && appUser.pw_change_required)}
                        key={item.title}
                        onClick={() => {
                            setSelectedNavItem(item.title);
                            navigate(item.link);
                        }}
                        sx={{
                            backgroundColor:
                  selectedNavItem == item.title
                      ? theme.palette.secondary.main
                      : "unset",
                            "&:hover": {
                                backgroundColor:
                      selectedNavItem == item.title
                          ? theme.palette.secondary.main
                          : "#444",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: "white" }}>
                            <item.Icon fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                            sx={{
                                textDecoration:
                    location.pathname === item.link ? "underline" : "none",
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
            {appUser.is_admin && (
                <>
                    <Divider />
                    <Typography variant="h5" alignSelf="center" paddingTop="10px">Admin</Typography>
                    <List>
                        {adminNavLinks.map((item) => (
                            <ListItemButton disabled={Boolean(item.requirePermanentPassword && appUser.pw_change_required)}
                                key={item.title}
                                onClick={() => {
                                    setSelectedNavItem(item.title);
                                    navigate(item.link);
                                }}
                                sx={{
                                    backgroundColor:
                    selectedNavItem == item.title
                        ? theme.palette.secondary.main
                        : "unset",
                                    "&:hover": {
                                        backgroundColor:
                      selectedNavItem == item.title
                          ? theme.palette.secondary.main
                          : "#444",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "white" }}>
                                    <item.Icon fontSize="large"/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    sx={{
                                        textDecoration:
                      location.pathname === item.link ? "underline" : "none",
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </>
            )}
        </Stack>
    );
};

export default AccountNav;
