import React from 'react';
import '../App/App.css';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    abRoot: {
        backgroundColor: 'darkgreen',
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        flexGrow: 1,
        textAlign: "right",
    },
    buttonText: {
        color: "white",
    },
    title: {
        flexGrow: 1,
        textAlign: "center",
        color: 'white',
        textTransform: "capitalize",
    },
    titleButton: {
        flexGrow: 1,
        textAlign: "left",
        width: "20%",
    }
}));

export default function NavBar() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" classes={{ root: classes.abRoot}}>
                <Toolbar>
                    <Button styles={classes.titleButton} onClick={() => history.push('/searchPage')}>
                    <Typography variant="h6" className={classes.title}>
                        UTD Comer Collection
                    </Typography></Button>
                    <div className={classes.menuButton}>
                    <Button className="myButton" onClick={() => history.push('/expandedView')}>
                        <div className={classes.buttonText}>Expanded</div></Button>
                    &nbsp;&nbsp;
                    <Button className="myButton" onClick={() => history.push('/exhibihtion')}>
                    <div className={classes.buttonText}>Exhibitions</div></Button>
                    &nbsp;&nbsp;
                    <Button className="myButton" onClick={() => history.push('/searchBy')}>
                    <div className={classes.buttonText}>Search</div></Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
