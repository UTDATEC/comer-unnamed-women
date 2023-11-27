import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Stack } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTheme } from '@emotion/react';


export default function NavBar(props) {
  
  const navigate = useNavigate();
  const theme = useTheme();
  const { appUser, setAppUser, appDarkTheme, setAppDarkTheme } = props;
  
  const [buttons, setButtons] = useState([]);

  const [anchorElement, setAnchorElement] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorElement(event.currentTarget);
  }

  const handleMenuClose = (event) => {
    setAnchorElement(null);
  }

  useEffect(() => {
    const getButtons = (user) => {
      const output = [
        { text: "Home", link: "/" },
        { text: "Browse Collection", link: "/BrowseCollection" },
        { text: "Public Exhibitions", link: "/Exhibitions" },
        // { text: "Search", link: "/searchBy" }
      ]
      if(!user) {
        output.push({ text: "Log in", link: "/login" })
      }
      return output
    }
    setButtons(getButtons(appUser));
  }, [appUser])

  return (
      <AppBar position="fixed" color="primary">
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" paddingLeft={2}>
            {/* Placeholder for logo */}
            {/* <img src={utd_logo} height="48px" /> */}
            <Typography variant="h5" sx={{paddingLeft: "25px"}}>
              UTD Comer Collection
            </Typography>
          </Stack>
          <Toolbar>
          <Stack spacing={1} direction={'row'}>
            {buttons.map((button) => (
              <Button key={button.text} color="primary" variant="contained" sx={{border: `1px solid ${theme.palette.primary.light}`}} onClick={() => navigate(button.link)}>
                <Typography variant="body1">{button.text}</Typography>
              </Button>
            ))}
            <Button color="primary" variant="contained" sx={{border: `1px solid ${theme.palette.primary.light}`}} onClick={() => {
              setAppDarkTheme((current) => !current)
            }}>
              <Typography variant="body1">Change theme</Typography>
            </Button>
            {appUser && (
              <>
                <Button variant="text" endIcon={<ArrowDropDownIcon sx={{height: '100%', color: "white"}}/>} onClick={handleMenuOpen} sx={{textTransform: "unset", paddingLeft: '20px', paddingRight: '10px'}}
                  aria-haspopup={Boolean(anchorElement)}
                  aria-expanded={Boolean(anchorElement)}
                >
                  <Stack direction="row" alignContent="center" alignItems="center">
                    <Typography variant="h6" sx={{color: "white"}}>
                      {appUser.safe_display_name}
                    </Typography>
                  </Stack>
                </Button>
                <Menu MenuListProps={{
                }} anchorEl={anchorElement} anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }} transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }} open={Boolean(anchorElement)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate('/Account')
                  }}>
                    <Typography variant="body">
                      Account
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleMenuClose();
                    setAppUser(null);
                    localStorage.removeItem('token');
                    navigate('/')
                  }}>
                    <Typography variant="body">
                      Log Out
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
          </Toolbar>
        </Stack>
      </AppBar>
  );
}
