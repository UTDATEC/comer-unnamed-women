import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListTileBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'center',
    justifyContent: 'center',
  }
}));

const UsingFetch = () => {
  const [images, setImages] = useState([])

  const fetchData = () => {
    fetch("http://localhost:9000/testAPI/searchBy")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setImages(data)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {images.length > 0 && (
        <ul>
          {images[0].map(image => (
            //console.log(image)
            
            //<h1>[{image[0].title}]</h1>
            
            <li key="{image[0].title}">{image.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UsingFetch


    /*useEffect(() => {
        const getImagesData = async () => {
          console.log(props)
            const data = await axios.get("http://localhost:9000/testAPI/searchBy")
            console.log(data)
            setImages(data)
            console.log(images)
        }
        getImagesData()
        console.log(images)
    }, [])*/


  //return (
    //<div className={classes.root}>
      //<ImageList rowHeight={300}  gap={30} className={classes.gridList}>
        //<ImageListItem key="Subheader" cols={4} style={{ height: 'auto' }}>
          //<ListSubheader component="div"></ListSubheader>
        //</ImageListItem>.getImagesData
        //{images.map((image) => (
          //<ImageListItem key={image.img}>
          //{/* We use localhost:9000's images directory bc that is where the static images are served in our server */
             //<img src={`http://localhost:9000/images/${image.fileName}`} alt={image.title} />
            //<ImageListItemBar
              //title={image.title}
              //actionIcon={
                //<IconButton aria-label={`info about ${image.title}`} className={classes.icon} onClick={() => handleClick(image)}>
                   //<InfoIcon />
               // </IconButton>
             // }
            ///>
          //</ImageListItem>
        //))}
      //</ImageList>
    //</div>
  //);
