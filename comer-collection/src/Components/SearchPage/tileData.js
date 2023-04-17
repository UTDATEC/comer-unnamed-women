import logo from './utd.jpg';
import vertical from './testvertical.jpeg';
import horizontal from './testhorizontal.jpeg';
import { useState } from 'react';

let tmpArray;
const tileData = [];


const fetchData = () => {
  fetch("http://localhost:9000/testAPI/searchBy")
  .then(response => {
      return response.json();
  })
  .then(data => {
    //console.log(data)
      // Here you need to use an temporary array to store NeededInfo only 
      tmpArray = []
      for (var i = 0; i < data[0].length; i++) {
          //console.log(data[0][i].title)
          //console.log(data[0][i].artist)
          //tmpArray.push(data[0][i].title)
          //console.log(tmpArray[i])
          tileData.push({
            img: logo,
            title: data[0][i].title,
            artist: data[0][i].artist,
            year: data[0][i].date,
            medium: data[0][i].medium,
            dimensions: data[0][i].dimensions,
          })
      }
  });
};

fetchData()
export default tileData;


/*tileData = [
    {
    img: logo,
    title: 'UTD Image',
    },
    {
      img: vertical,
      title: 'Test Vertical',
      featured: true,
    },
    {
      img: logo,
      title: 'Sarah in the Jungle',
    },
    {
      img: horizontal,
      title: 'Test Horizontal',
    },
    {
      img: vertical,
      title: 'Test Vertical',
      featured: true,
    },
    {
    img: logo,
    title: 'UTD Image',
    },
    {
      img: vertical,
      title: 'Test Vertical',
      featured: true,
    },
    {
      img: logo,
      title: 'Sarah in the Jungle',
    },
    {
      img: logo,
      title: 'UTD Image',
    },
    {
      img: horizontal,
      title: 'Test Horizontal',
    },
    {
      img: logo,
      title: 'Sarah in the Jungle',
    },
    {
      img: vertical,
      title: 'Test Vertical',
    }
  ];*/
