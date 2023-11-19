import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Stack, Divider, styled } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";


// Import image files
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import ImageIcon from '@mui/icons-material/Image';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LockIcon from '@mui/icons-material/Lock';


const navLinks = [
  {
      title: "Profile",
      icon: <AccountCircleIcon fontSize="large"/>,
      link: "/Account/Profile"
  },
  {
      title: "Change Password",
      icon: <LockIcon fontSize="large"/>,
      link: "/Account/ChangePassword"
  },
]
  
const adminNavLinks = [
  {
      title: "User Management",
      icon: <GroupsIcon fontSize="large"/>,
      link: "/Account/UserManagement"
  },
  {
      title: "Exhibition Management",
      icon: <PhotoCameraBackIcon fontSize="large"/>,
      link: "/Account/ExhibitionList"
  },
  {
      title: "Image Management",
      icon: <ImageIcon fontSize="large"/>,
      link: "/Account/ImageManagement"
  },
  {
      title: "Course Management",
      icon: <SchoolIcon fontSize="large"/>,
      link: "/Account/Course"
  },
  {
      title: "Invite",
      icon: <GroupAddIcon fontSize="large"/>,
      link: "/Account/Invite"
  }

]



const AccountNav = (props) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { user, selectedNavItem, setSelectedNavItem } = props;

  const theme = useTheme();

  return (
    <Stack direction="column" sx={{ backgroundColor: "#222", height: "100%", color: "white" }}>
      <Typography variant="h5" alignSelf="center" paddingTop="10px">Account</Typography>
        <List>
          {navLinks.map((item) => (
            <ListItem
              key={item.title}
              onClick={() => {
                setSelectedNavItem(item.title);
                navigate(item.link)
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
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  textDecoration:
                    location.pathname === item.link ? "underline" : "none",
                }}
              />
            </ListItem>
          ))}
        </List>
        {user.is_admin && (
          <>
          <Divider />
          <Typography variant="h5" alignSelf="center" paddingTop="10px">Admin</Typography>
          <List>
            {adminNavLinks.map((item) => (
              <ListItem
                key={item.title}
                onClick={() => {
                  setSelectedNavItem(item.title);
                  navigate(item.link)
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
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    textDecoration:
                      location.pathname === item.link ? "underline" : "none",
                  }}
                />
              </ListItem>
            ))}
          </List>
          </>
        )}
      </Stack>
  );
}

export default AccountNav;
