import React, { useState } from "react";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Divider, Menu, MenuItem, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useAppUser } from "../App/AppUser.js";
import {
    ArrowDropDownIcon,
    AccountCircleIcon,
    PhotoCameraBackIcon,
    LogoutIcon
} from "../IconImports.js";
import PropTypes from "prop-types";


const NavBarUserMenu = () => {
  
    const [anchorElement, setAnchorElement] = useState(null);
    const [appUser, setAppUser] = useAppUser();
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorElement(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorElement(null);
    };

    return (
        <>
            <Button variant="text" endIcon={<ArrowDropDownIcon sx={{height: "100%", color: "white"}}/>} onClick={handleMenuOpen} sx={{textTransform: "unset", paddingLeft: "20px", paddingRight: "10px"}}
                aria-haspopup={Boolean(anchorElement)}
                aria-expanded={Boolean(anchorElement)}
            >
                <Stack direction="row" alignContent="center" alignItems="center">
                    <Typography variant="h6" sx={{color: "white"}}>
                        {appUser.safe_display_name}
                    </Typography>
                </Stack>
            </Button>
            <Menu sx={{zIndex: 5000}} MenuListProps={{
            }} anchorEl={anchorElement} anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }} transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }} open={Boolean(anchorElement)} onClose={handleMenuClose}>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate("/Account/Profile");
                }}>
                    <Stack direction="row" spacing={1}>
                        <AccountCircleIcon />
                        <Typography variant="body">
              My Profile
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate("/Account/MyExhibitions");
                }}>
                    <Stack direction="row" spacing={1}>
                        <PhotoCameraBackIcon />
                        <Typography variant="body">
              My Exhibitions
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleMenuClose();
                    setAppUser(null);
                    localStorage.removeItem("token");
                    navigate("/");
                }}>
                    <Stack direction="row" spacing={1}>
                        <LogoutIcon />
                        <Typography variant="body">
              Log Out
                        </Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </>
    );
};


const NavBarButton = ({ href, text }) => {
  
    const navigate = useNavigate();
    const theme = useTheme();

    const isPageActive = document.location.pathname == href;

    return (
        <Button spacing={1} color="secondary" sx={{
            height: "64px",
            minWidth: "120px",
            borderBottom: isPageActive ? `5px solid ${theme.palette.secondary.main}` : "5px solid rgba(0, 0, 0, 0)",
            textTransform: "unset"
        }} onClick={() => navigate(href)}>
            <Typography variant="h6" color="white">{text}</Typography>
        </Button> 
    );
};

NavBarButton.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};


const NavBar = () => {
  
    const [appUser] = useAppUser();
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" color="primary" sx={{zIndex: 5000}}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" paddingLeft={2}>
                    {/* Placeholder for logo */}
                    {/* <img src={utd_logo} height="48px" /> */}
                    <Typography variant="h5" sx={{paddingLeft: "25px"}}>
              UTD Comer Collection
                    </Typography>
                </Stack>
                <Toolbar>
                    <Stack spacing={2} direction={"row"}>
                        <Stack spacing={1} paddingRight={2} direction="row">
                            <NavBarButton href="/BrowseCollection" text="Collection" />
                            <NavBarButton href="/Exhibitions" text="Exhibitions" />
                        </Stack>
                        {appUser && <>
                            <Divider sx={{
                                borderWidth: "1px"
                            }} />
                            <NavBarUserMenu />
                        </> ||
            !appUser && (
                <Stack direction="column" sx={{
                    justifyContent: "center"
                }}>
                    <Button variant="contained" sx={{
                        height: "60%"
                    }} onClick={() => {navigate("/login");}}>
                        <Typography>Log In</Typography>
                    </Button>
                </Stack>
              
            )}
                    </Stack>
                </Toolbar>
            </Stack>
        </AppBar>
    );
};

export default NavBar;