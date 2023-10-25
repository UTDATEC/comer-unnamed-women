import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Table.css';
import { Link } from 'react-router-dom';

function UsingFetch() {
  const [images, setImages] = useState([]);

  // fetch data from database
  const fetchData = () => {
    axios.get('http://localhost:9000/testAPI/searchBy')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('API request error:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='ListContainer'>
      <div className='TableContainer'>
        <div className='AdminTable'>
          <h2 className="table-name">List of Images</h2>

          <table className='Table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {images.map((imageGroup, groupIndex) => (
                imageGroup.map((image, imageIndex) => (
                  <tr key={imageIndex}>
                    <td>{image.title}</td>
                    <td>{image.artist}</td>
                    <td>{image.date}</td>
                    <td>
                      <Link to="/ViewImages" className='GreenButton'>
                        View
                      </Link>
                    </td>
                    <td>
                      <Link to="/EditImages" className='GreenButton'>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsingFetch;
