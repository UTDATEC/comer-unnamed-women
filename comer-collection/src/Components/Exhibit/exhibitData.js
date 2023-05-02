import logo from '../GridView/utd.jpg';
import { useState } from 'react';

let tempArray;
const exhibitData = [];

// Get data from MySQL database, then push to exhibitData object for display
const getData = () => {
    fetch("http://localhost:9000/exhibitUpload/Exhibit")
    .then(response => {
        return response.json();
    })
    .then(data => {
        tempArray = []
        for (var i = 0; i <= data.length; i++) {
            console.log(data[0][i].exhibit_name)
            exhibitData.push({
                name: data[0][i].exhibit_name
            })
        }
    });
};

getData()
export default exhibitData;
