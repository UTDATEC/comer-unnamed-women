import logo from '../GridView/utd.jpg';
import { useState } from 'react';

let tempArray;
const exhibitData = [];

const getData = () => {
    fetch("http://localhost:9000/exhibitUpload/Exhibit")
    .then(response => {
        return response.json();
    })
    .then(data => {
        tempArray = []
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

// const exhibitData = [
//     {
//         img: logo,
//         title: 'Exhibit A',
//     },
//     {
//         img: logo,
//         title: 'Exhibit B',
//     }

// ];

// export default exhibitData;
