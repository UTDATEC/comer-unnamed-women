import React from 'react';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubHeader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useHistory } from 'react-router-dom';


import tileData from './tileData';

const PREFIX = 'Images';

const classes = {
    root: `${PREFIX}-root`,
    gridList: `${PREFIX}-gridList`,
    shadow: `${PREFIX}-shadow`,
    titleBar: `${PREFIX}-titleBar`,
    icon: `${PREFIX}-icon`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        //styles for div
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    },

    [`& .${classes.gridList}`]: {
        //styles for ImageList
        width: 1000,
        height: 725,
    },

    [`& .${classes.shadow}`]: {
        //Styles for ImageList shadows
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #ccc',
    },

    [`& .${classes.titleBar}`]: {
        //styles for?
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0000) 100%',
    },

    [`& .${classes.icon}`]: {
        //styles for ImageListItemBar
        color: 'rgba(255, 255, 0.54)'
    }
}));

export default function TitlebarGridList(props) {
    
    //classes to use styles created above and navigate pages

    const history = useHistory();

    const routeChange = (data) => {
        let path = '/expandedView'
        history.push(path, {data: data})
        console.log(data)
    }
            
    return (
        <Root className={classes.root}>
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
                                    size="large">
                                    <StarBorderIcon />
                                </IconButton>
                            }
                            //style={{ opacity: 0}}
                            //actionPosition="Left" //doesnt work?
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Root>
    );

/*
    return (
        <div className={classes.root}>
            <ImageList cols={4} gap={15} className={classes.gridList}>
                {/*this ILItem adds space between the images and the navigation bar/}
                <ImageListItem key="Subheader" cols={4} style={{ height: "auto" }}>
                    <ListSubHeader component="div"></ListSubHeader>
                </ImageListItem>
                {tileData.map((item) => (
                    /*this ILItem specifies attributes for the images that will be displayed/
                    <ImageListItem key={item.img} className={classes.shadow}>
                         <img
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
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
*/

}

const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
      title: 'Bed',
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },
    {
      img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
      title: 'Blinds',
    },
    {
      img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
      title: 'Chairs',
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
      title: 'Doors',
    },
    {
      img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      title: 'Coffee table',
    },
  ];