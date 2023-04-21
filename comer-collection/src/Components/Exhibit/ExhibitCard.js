import React from 'react';
import './Exhibit.css'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import exhibitData from './exhibitData.js';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ListSubHeader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
    root: {
        //styles for div
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        //boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
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

export default function ExhibitCard(){
    const classes = useStyles();
    const history = useHistory();

    function handleClick(image) {
        //props.appProps.setSelectedImage(image) //no props
        history.push("/searchpage2")
    }

    return (
        <div className={classes.root}>
            <ImageList cols={4} gap={15} className={classes.gridList}>
                {/*this ILItem adds space between the images and the navigation bar*/}
                <ImageListItem key="Subheader" cols={4} style={{ height: 80 }}>
                    <ListSubHeader component="div"></ListSubHeader>
                </ImageListItem>
                {exhibitData.map((item) => (
                    /*this ILItem specifies attributes for the images that will be displayed*/
                    <ImageListItem key={item.img} className={classes.shadow}>
                         <img
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.title}
                            actionIcon={
                                <IconButton 
                                    sx={{ color: 'white' }} 
                                    aria-label={`star ${item.title}`} 
                                    onClick={() => handleClick(item)}
                                >
                                    <StarBorderIcon />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );


}