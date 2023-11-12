import React from 'react';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubHeader from '@mui/material/ListSubheader';
import { useNavigate } from 'react-router-dom';


import tileData from './tileData';

const PREFIX = 'Images';

const classes = {
    root: `${PREFIX}-root`,
    imageList: `${PREFIX}-imageList`,
    shadow: `${PREFIX}-shadow`,
    icon: `${PREFIX}-icon`,
    button: `${PREFIX}-button`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
        //styles for div
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        backgroundColor: 'theme.palette.background.paper',
    },

    [`& .${classes.imageList}`]: {
        //styles for ImageList
        width: '1000px',
        height: '100%',
        backgroundColor: 'theme.palette.background.paper',
    },

    [`& .${classes.shadow}`]: {
        //Styles for ImageList shadows
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #ccc',
    },

    [`& .${classes.icon}`]: {
        //styles for ImageListItemBar
        color: 'rgba(255, 255, 0.54)'
    },

    [`& .${classes.button}`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        '&:hover': {
        backgroundColor: 'lightgray',
        opacity: 0
        },
    }
}));


export default function TitlebarGridList(props) {
    
    //classes to use styles created above and navigate pages

    const navigate = useNavigate();

    const routeChange = (data) => {
        let path = '/expandedView'
        navigate(path, {data: data})
        console.log(data)
    }
           
    return (
        <Root>
            {/*stylized div adds spacing so the navigation bar does not overlap*/}
            <div style={{ height: '70px' }}/>
            <div className={classes.root}>
                <ImageList cols={4} gap={15} className={classes.imageList}>
                    {/*this ILItem adds space between the images and the navigation bar*/}
                    <ImageListItem key="Subheader" cols={4} style={{ height: 10 }}>
                        <ListSubHeader component="div"></ListSubHeader>
                    </ImageListItem>
                    {tileData.map((item) => (
                        /*this ILItem specifies attributes for the images that will be displayed*/
                        <ImageListItem key={item.img} className={classes.shadow} style={{ marginBottom: 10 }}> 
                            <img
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                                //onClick={() => routeChange(item)}
                            />
                            <button onClick={() => routeChange(item)} className={classes.button}>
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
        </Root>
    );

    //return (
        //<div className={classes.root}>
            //<ImageList cols={4} gap={15} className={classes.gridList}>
                //{/*this ILItem adds space between the images and the navigation bar*/}
                //<ImageListItem key="Subheader" cols={4} style={{ height: 80 }}>
                    //<ListSubHeader component="div"></ListSubHeader>
                //</ImageListItem>
                //{tileData.map((item) => (
                    /*this ILItem specifies attributes for the images that will be displayed*/
                    //<ImageListItem key={item.img} className={classes.shadow}> 
                         //<img
                            //src={item.img}
                            //alt={item.title}
                            //loading="lazy"
                            //onClick={() => routeChange(item.title)}
                            //onClick={() => routeChange(item)}
                        ///>
                        
                        //<ImageListItemBar
                            //title={item.title}
                            //position="top"
                            //actionIcon={
                                //<IconButton 
                                    //sx={{ color: 'white' }} 
                                    //aria-label={`star ${item.title}`} 
                                    //onClick={() => handleClick(item)}
                                //>
                                    //<StarBorderIcon />
                                //</IconButton>
                            //}
                            //style={{ opacity: 0}}
                            //actionPosition="Left" //doesnt work?
                        ///>
                    //</ImageListItem>
                //))}
            //</ImageList>
        //</div>
    //);
}