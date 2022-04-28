import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';

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

export default function TitlebarGridList() {
  const classes = useStyles();

  // let [users, setUsers] = useState([])
  //
  // useEffect(() => {
  //   fetch("/api/reminders")
  //     .then((response) => response.json())
  //     .then((json) => setUsers(json))
  // }, [])

  const [images, setImages] = useState([])

  // const { images } = await axios.get("http://localhost:9000/testAPI")
  // console.log(images)

    useEffect(() => {
        const getImagesData = async () => {
            const { data } = await axios.get("http://localhost:9000/testAPI")
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
        </GridListTile>
        {images.map((image) => (
          <GridListTile key={image.img}>
          {/* We use localhost:9000's images directory bc that is where the static images are served in our server */}
             <img src={`http://localhost:9000/images/${image.path}`} alt={image.title} />
            <GridListTileBar
              title={image.title}
              actionIcon={
                <IconButton aria-label={`info about ${image.title}`} className={classes.icon}>
                  <a href="http://localhost:3000/searchpage2"> <InfoIcon /></a>
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
