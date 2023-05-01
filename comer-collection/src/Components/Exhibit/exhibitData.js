import logo from '../GridView/utd.jpg';
import { useState } from 'react';

const exhibitData = [];

// This file returns the data as a json object and pushes to exhibitData

const getData = () => {
    fetch("http://localhost:9000/exhibitUpload/Exhibit")
    .then(response => {
        return response.json();
    })
    .then(data => {
        for (var i = 0; i < data.length; i++) {
            console.log(data[0][i].exhibit_name)
            exhibitData.push({
                name: data[0][i].exhibit_name
            })
        }
    });
};

getData()
export default exhibitData;