import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import '../App/App.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Stack } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const PREFIX = 'NavBar';

const classes = {
  abRoot: `${PREFIX}-abRoot`,
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  buttonText: `${PREFIX}-buttonText`,
  title: `${PREFIX}-title`,
  titleButton: `${PREFIX}-titleButton`
};

const Root = styled('div')((
  {
    theme
  }
) => ({


  [`& .${classes.menuButton}`]: {
    textAlign: 'right',
  },
  
  [`& .${classes.buttonText}`]: {
    color: 'white'
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
    textAlign: 'left',
    color: 'white',
  },

  [`& .${classes.titleButton}`]: {
    textAlign: 'left',
    width: '20%',
  }
}));



export default function NavBar(props) {
  
  const navigate = useNavigate();
  const { user, setUser } = props;
  
  const signOutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
  }
  
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
        { text: "Exhibit Viewer", link: "/exhibition_viewer" },
        { text: "Search", link: "/searchBy" }
      ]
      if(!user) {
        output.push({ text: "Log in", link: "/login" })
      }
      return output
    }
    setButtons(getButtons(user));
  }, [user])

  return (
    <Root className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            UTD Comer Collection
          </Typography>
          <Stack spacing={1} direction={'row'}>
            {buttons.map((button) => (
              <Button key={button.text} color="primary" variant="contained" onClick={() => navigate(button.link)}>
                <Typography variant="body1" className={classes.buttonText}>
                  {button.text}
                </Typography>
                {/* <div className={classes.buttonText}></div> */}
              </Button>
            ))}
            {user && (
              <>
                <Button variant="text" onClick={handleMenuOpen} sx={{textTransform: "unset"}}
                  aria-haspopup={Boolean(anchorElement)}
                  aria-expanded={Boolean(anchorElement)}
                >
                  <Stack direction="row" alignContent="center" alignItems="center">
                    <Typography variant="h6" sx={{color: "white", marginLeft: '20px'}}>
                      {Boolean(user.given_name && user.family_name) ? `${user.given_name} ${user.family_name}` : `${user.email}`}
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
                    signOutUser();
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
      </AppBar>
    </Root>
  );
}
