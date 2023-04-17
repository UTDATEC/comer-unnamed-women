import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, Container} from '@material-ui/core'
import ImageList from '@material-ui/core/ImageList';
//import GridList from '@material-ui/core/GridList';
import ImageListItem from '@material-ui/core/ImageListItem';
//import GridlistTile from '@material-ui/core/GridListTile'; (gridlist is now imagelist)
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
//import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubHeader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Link, useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
    root: {
        //styles for div
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    },
    gridList: {
        //styles for ImageList
        width: 1000,
        height: 725,
    },
    shadow: {
        //Styles for ImageList shadows
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #ccc',
    },
    titleBar: {
        //styles for?
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0000) 100%',
    },
    icon: {
        //styles for ImageListItemBar
        color: 'rgba(255, 255, 0.54)'
    }
}));

export default function TitlebarGridList(props) {
    
    //classes to use styles created above and navigate pages
    const classes = useStyles();
    const history = useHistory();

    const routeChange = (data) => {
        let path = '/expandedView'
        history.push(path, {data: data})
        console.log(data)
    }
            
    return (
        <div className={classes.root}>
            <ImageList cols={4} gap={15} className={classes.gridList}>
                {/*this ILItem adds space between the images and the navigation bar*/}
                <ImageListItem key="Subheader" cols={4} style={{ height: 80 }}>
                    <ListSubHeader component="div"></ListSubHeader>
                </ImageListItem>
                {tileData.map((item) => (
                    /*this ILItem specifies attributes for the images that will be displayed*/
                    <ImageListItem key={item.img} className={classes.shadow}> 
                         <img
                            src={item.img}
                            alt={item.title}
                            //loading="lazy"
                            //onClick={() => routeChange(item.title)}
                            onClick={() => routeChange(item)}
                        />
                        
                        <ImageListItemBar
                            title={item.title}
                            //position="top"
                            actionIcon={
                                <IconButton 
                                    sx={{ color: 'white' }} 
                                    aria-label={`star ${item.title}`} 
                                    onClick={() => handleClick(item)}
                                >
                                    <StarBorderIcon />
                                </IconButton>
                            }
                            //style={{ opacity: 0}}
                            //actionPosition="Left" //doesnt work?
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}