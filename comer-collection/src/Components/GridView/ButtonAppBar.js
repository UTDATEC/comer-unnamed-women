import React from 'react';
import { styled } from '@mui/material/styles';
import '../App/App.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useHistory } from 'react-router-dom';

const PREFIX = 'ButtonAppBar';

const classes = {
  abRoot: `${PREFIX}-abRoot`,
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.abRoot}`]: {
  backgroundColor: '#e87500',
  },

  [`&.${classes.root}`]: {
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  }
}));

//creates function to make a Material-UI AppBar component with a button
export default function ButtonAppBar() {

  const history = useHistory(); //allows component to navigate between different pages

  /*
  div creates a division or section in HTML document and is stylized with classes.root to allow css stylization
  AppBar specifies that an appbar is being created, is static, and uses the abRoot class to change the color
  Toolbar specifies that its content should be group in an application bar
  Typography is for text, h6 is a font style, uses title class to specify text attributes
  Button uses myButton class to stylize button, onClick specifies where to go (classname="myButton")
  */
 //creates the navigation bar with a search button
  return (
    <Root className={classes.root}> 
      <AppBar position="static" classes={{ root: classes.abRoot}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Search Results Page
          </Typography>
          <Button className="myButton" onClick={() => history.push('/searchBy')}>Search</Button>
          <Button className="myButton" onClick={() => history.push('/exhibitmain')}>Exhibit</Button>
        </Toolbar>
      </AppBar>
    </Root>
  );
}