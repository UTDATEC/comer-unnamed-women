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
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: "left",
    },

}));

export default function NavBar() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" classes={{ root: classes.abRoot}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        UTD Comer Collection
                    </Typography>
                    <Button className="myButton" onClick={() => history.push('/searchPage')}>Home</Button>
                    <Button className="myButton" onClick={() => history.push('/expandedView')}>Expanded</Button>
                    <Button className="myButton" onClick={() => history.push('/ExhibitMain')}>Exhibitions</Button>
                    <Button className="myButton" onClick={() => history.push('/searchBy')}>Search</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
