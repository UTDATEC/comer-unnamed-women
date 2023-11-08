import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Table.css';
import { Link } from 'react-router-dom';

function ImageList() {
  const [images, setImages] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:9000/api/images')
      .then(response => {
        setImages(response.data);
        console.log('Images:', response.data);
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
                <th>Photographer</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(images.data) && images.data.map((image, index) => (
                <tr key={index}>
                  <td>{image.title}</td>
                  <td>
                    <span>
                      {image.Artists.length > 0 ? `${image.Artists[0].givenName} ${image.Artists[0].familyName}` : 'Unknown'}
                    </span>
                  </td>
                  <td>{image.year}</td>
                  {/* <td>
                    <Link to={`/Admin/ImageView/${image.id}`} className='GreenButton'> View</Link>                  
                  </td> */}

                  <td>
                    <Link to={`/Admin/ImageEdit/${image.id}`} className='GreenButton'> Edit</Link>                  
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ImageList;
