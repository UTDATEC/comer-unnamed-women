import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, Container} from '@material-ui/core'
import ImageList from '@material-ui/core/ImageList';
//import GridList from '@material-ui/core/GridList';
import ImageListItem from '@material-ui/core/ImageListItem';
//import GridlistTile from '@material-ui/core/GridListTile'; (gridlist is now imagelist)
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
//import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubHeader from '@material-ui/core/ListSubHeader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useHistory } from 'react-router-dom';

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
        height: 650,
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

export default function TitlebarGridList() {
    //classes to use styles created above and navigate pages
    const classes = useStyles();
    const history = useHistory();

    //const [images, setImages] = useState([]) //needs something to work?

    //function for redirecting to searchpage2
    function handleClick(image) {
        //props.appProps.setSelectedImage(image) //no props
        history.push("/searchpage2")
    }

/*
//<ImageList rowHeight={300}  gap={30} className={classes.gridList}></ImageList>
//rowHeight={300} sx={{ width: 500, height: 500 }}
div className={classes.root}>

                <ImageListItem key="Subheader" cols={3} style={{ height: "auto" }}>
                    <ListSubHeader component="div"></ListSubHeader>
                </ImageListItem>
*/

//alphabetical images
//pages
//switch to masonry/woven display for materialui
//staying on the same page when you leave and come back


//think about loading a specific amount of images per page?

    return (
        <div className={classes.root}>
            <ImageList cols={4} gap={15} className={classes.gridList}>
                {/*this ILItem adds space between the images and the navigation bar*/}
                <ImageListItem key="Subheader" cols={4} style={{ height: "auto" }}>
                    <ListSubHeader component="div"></ListSubHeader>
                </ImageListItem>
                {tileData.map((item) => (
                    /*this ILItems specifies attributes for the images that will be displayed*/
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

/*
    return (
        <Container>
            <ImageList gap={12} sx={{mb: 8, gridTemplateColumns: 'repeat{auto-fill, minmax(280px, 1fr,))!important',}}>
                {tileData.map((item) => (
                    <Card key={item.img}>
                        <ImageListItem>
                            <img
                                src={item.img}
                                alt={item.title}
                                loading='lazy'
                            />
                            <ImageListItemBar
                                title={item.title}
                                actionIcon={
                                    <IconButton aria-label={`info about ${item.title}`} className={classes.icon} onClick={() => handleClick(item)}>
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    </Card>
                ))}
            </ImageList>
        </Container>
    );
*/

}