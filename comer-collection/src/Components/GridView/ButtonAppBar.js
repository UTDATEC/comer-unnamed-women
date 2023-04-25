import React from 'react';
import '../App/App.css';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';

//
const useStyles = makeStyles((theme) => ({
  abRoot: {
  backgroundColor: '#e87500',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

//creates function to make a Material-UI AppBar component with a button
export default function ButtonAppBar() {
  const classes = useStyles(); //defines a css class for the component
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
    <div className={classes.root}> 
      <AppBar position="static" classes={{ root: classes.abRoot}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Search Results Page
          </Typography>
          <Button className="myButton" onClick={() => history.push('/searchBy')}>Search</Button>
          <Button className="myButton" onClick={() => history.push('/exhibitmain')}>Exhibit</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}