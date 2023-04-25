import logo from '../GridView/utd.jpg';
import { useState } from 'react';

let tempArray;
const exhibitData = [];

const getData = () => {
    fetch("http://localhost:9000/exhibitMain")
    .then(response => {
        return response.json();
    })
    .then(data => {
        tempArray = []
        for (var i = 0; i < data.length; i++) {
            exhibitData.push({
                name: data[i].exhibit_name,
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
