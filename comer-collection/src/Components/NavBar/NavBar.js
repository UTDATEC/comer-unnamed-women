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

  return (
    <Root className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Button
            styles={classes.titleButton}
            onClick={() => navigate('/')}>
            <Typography variant="h6" className={classes.title}>
              UTD Comer Collection
            </Typography>
          </Button>
          <div className={classes.menuButton}>
            <Button className="myButton" onClick={() => navigate('/')}>
              <div className={classes.buttonText}>Images</div>
            </Button>
            {/*<Button className="myButton" onClick={() => navigate('/expandedView')}>
                            <div className={classes.buttonText}>Expanded</div></Button>*/}
            &nbsp;&nbsp;
            <Button
              className="myButton"
              onClick={() => navigate('/exhibition_viewer')}>
              <div className={classes.buttonText}>Exhibit Viewer</div>
            </Button>
            &nbsp;&nbsp;
            <Button
              className="myButton"
              onClick={() => navigate('/searchBy')}>
              <div className={classes.buttonText}>Search</div>
            </Button>
            &nbsp;&nbsp;
            <Button className="myButton" onClick={() => navigate('/login')}>
              <div className={classes.buttonText}>Login</div>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Root>
  );
}
