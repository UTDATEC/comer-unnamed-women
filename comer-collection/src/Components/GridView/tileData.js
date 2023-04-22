import logo from '../GridView/utd.jpg';
import vertical from './testvertical.jpg';
import horizontal from './testhorizontal.jpg';
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
      const prefix = "https://atecquilt01.utdallas.edu/comer/public/images/";
      for (var i = 0; i < data[0].length; i++) {
          let img_fname = data[0][i].image_file_name
          let url = "";
          //console.log(img_fname)
          if (!img_fname) {
            url = logo
          } else {
            img_fname = img_fname.replace(/ /g,"%20");
            url = prefix + img_fname
          }
          console.log(url)
          tileData.push({
            img: url,
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
