import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
    height: 1000,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

export default function TitlebarGridList(props) {
  const classes = useStyles();
  const history = useHistory();

  const [images, setImages] = useState([])

  function handleClick(image) {
    props.appProps.setSelectedImage(image)
    history.push("/searchpage2")
  }

    useEffect(() => {
        const getImagesData = async () => {
          console.log(props)
            const { data } = await axios.get("http://localhost:9000/testAPI", {params: { 
              title: props.appProps.searchParams.title,
              artist: props.appProps.searchParams.artist,
              medium: props.appProps.searchParams.medium,
              inscriptions: props.appProps.searchParams.inscriptions,
              dateCreated: props.appProps.searchParams.dateCreated,
              subject: props.appProps.searchParams.subject,
              collectionLocation: props.appProps.searchParams.collectionLocation,
              dimensions: props.appProps.searchParams.dimensions,
              accessionNumber: props.appProps.searchParams.accessionNumber,
              copyright: props.appProps.searchParams.copyright,
              tags: props.appProps.searchParams.tags
           }})
            console.log(data)
            setImages(data)
            console.log(images)
        }
        getImagesData()
        console.log(images)
    }, [])


  return (
    <div className={classes.root}>
      <GridList cellHeight={300}  spacing={30} className={classes.gridList}>
        <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
          <ListSubheader component="div"></ListSubheader>
        </GridListTile>.getImagesData
        {images.map((image) => (
          <GridListTile key={image.img}>
          {/* We use localhost:9000's images directory bc that is where the static images are served in our server */}
             <img src={`http://localhost:9000/images/${image.fileName}`} alt={image.title} />
            <GridListTileBar
              title={image.title}
              actionIcon={
                <IconButton aria-label={`info about ${image.title}`} className={classes.icon} onClick={() => handleClick(image)}>
                   <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
