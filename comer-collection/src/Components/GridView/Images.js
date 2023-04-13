import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import ListSubHeader from '@material-ui/core/ListSubheader';
import { useHistory } from 'react-router-dom';
import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
    root: {
        //styles for div
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        backgroundColor: 'theme.palette.background.paper',
    },
    imageList: {
        //styles for ImageList
        width: '1000px',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    shadow: {
        //Styles for ImageList shadows
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #ccc',
    },
    icon: {
        //styles for ImageListItemBar
        color: 'rgba(255, 255, 0.54)'
    }
}));

export default function TitlebarGridList() {
    
    //classes to use styles created above and navigate pages
    const classes = useStyles();
    const history = useHistory();

    //function for redirecting to ExpandedView
    function handleClick(image) {
        history.push("/ExpandedView")
    }

    return (
        <div>
            {/*stylized div adds spacing so the navigation bar does not overlap*/}
            <div style={{ height: '70px' }}/>
            <div className={classes.root}>
                <ImageList cols={4} gap={15} className={classes.imageList}>
                    {/*this ILItem adds space between the images and the navigation bar*/}
                    <ImageListItem key="Subheader" cols={4} style={{ height: 10 }}>
                        <ListSubHeader component="div"></ListSubHeader>
                    </ImageListItem>
                    {tileData.slice(0, 20).map((item) => (
                        /*this ILItem specifies attributes for the images that will be displayed*/
                        <ImageListItem key={item.img} className={classes.shadow} style={{ marginBottom: 10 }}>
                            <img
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                            />
                            <button
                                onClick={() => handleClick(item)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <ImageListItemBar title={item.title}/>
                            </button>
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            {/*adds space after images*/}
            <div style={{ width: '100%', height: '80px' }} />
            {/*adds white bottom bar*/}
            <div style={{ position: 'fixed', bottom: '0px', width: '100%', height: '70px', boxShadow: '0px -4px 5px -2px rgba(0,0,0,0.2)', backgroundColor: 'white' }} />
        </div>
    );
}