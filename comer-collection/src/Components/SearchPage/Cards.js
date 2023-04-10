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