import React from 'react';
import '../App/App.css';

import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  abRoot: {
    backgroundColor: 'darkgreen'
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    flexGrow: 1,
    textAlign: 'right',
  },
  buttonText: {
    color: 'white',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',
  },
  titleButton: {
    flexGrow: 1,
    textAlign: 'left',
    width: '20%',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{backgroundColor: "darkgreen"}} className={classes.abRoot}>
        <Toolbar>
          <Button
            styles={classes.titleButton}
            onClick={() => history.push('/')}>
            <Typography variant="h6" className={classes.title}>
              UTD Comer Collection
            </Typography>
          </Button>
          <div className={classes.menuButton}>
            <Button className="myButton" onClick={() => history.push('/')}>
              <div className={classes.buttonText}>Images</div>
            </Button>
            {/*<Button className="myButton" onClick={() => history.push('/expandedView')}>
                            <div className={classes.buttonText}>Expanded</div></Button>*/}
            &nbsp;&nbsp;
            <Button
              className="myButton"
              onClick={() => history.push('/exhibitMain')}>
              <div className={classes.buttonText}>Exhibitions</div>
            </Button>
            &nbsp;&nbsp;
            <Button
              className="myButton"
              onClick={() => history.push('/searchBy')}>
              <div className={classes.buttonText}>Search</div>
            </Button>
            &nbsp;&nbsp;
            <Button className="myButton" onClick={() => history.push('/login')}>
              <div className={classes.buttonText}>Login</div>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
