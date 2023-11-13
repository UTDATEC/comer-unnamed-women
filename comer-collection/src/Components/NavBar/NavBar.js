import React from 'react';
import { styled } from '@mui/material/styles';
import '../App/App.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

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

  [`&.${classes.root}`]: {
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    flexGrow: 1,
    textAlign: 'right',
  },

  [`& .${classes.buttonText}`]: {
    color: 'white',
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',
  },

  [`& .${classes.titleButton}`]: {
    flexGrow: 1,
    textAlign: 'left',
    width: '20%',
  }
}));

export default function NavBar() {

  const navigate = useNavigate();

  const buttons = [
    {
      text: "Home",
      link: "/"
    },
    {
      text: "Exhibit Viewer",
      link: "/exhibition_viewer"
    },
    {
      text: "Search",
      link: "/searchBy"
    },
    {
      text: "Login",
      link: "/login"
    }
  ]

  return (
    <Root className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            UTD Comer Collection
          </Typography>
          <Stack spacing={1} direction={'row'}>
            {buttons.map((button) => (
              <Button key={button.text} color="primary" variant="contained" onClick={() => navigate(button.link)}>
                <Typography variant="h6" className={classes.buttonText}>
                  {button.text}
                </Typography>
                {/* <div className={classes.buttonText}></div> */}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
    </Root>
  );
}
