import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Table.css';
import { Link } from 'react-router-dom';

function ImageList() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);

  // fetch data from the database
  const fetchData = () => {
    axios.get('http://localhost:9000/testAPI/searchBy')
      .then(response => {
        setImages(response.data);
        setFilteredImages(response.data); // Initialize filteredImages with all images
      })
      .catch(error => {
        console.error('API request error:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleSearch = (event) => {
  const query = event.target.value.toLowerCase();
  setSearchQuery(query);

  // Filter images based on the search query
  const filtered = images.map(imageGroup =>
    imageGroup.filter(image => {
      // Combine all properties and convert to lowercase for searching
      const imageData = Object.values(image).join(' ').toLowerCase(); 
      return imageData.includes(query);
    })
  );

  setFilteredImages(filtered);
};

  return (
    <div className='ListContainer'>
      <div className='TableContainer'>
        <div className='AdminTable'>
          <h2 className="table-name">List of Images</h2>

          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />

          <table className='Table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Curator</th>
                <th>Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredImages.map((imageGroup, groupIndex) => (
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

export default ImageList;
