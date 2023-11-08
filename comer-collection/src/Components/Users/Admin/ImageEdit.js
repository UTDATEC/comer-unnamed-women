import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Image.css';
import '../Table.css';

function EditImage() {
  const { id } = useParams();
  const [image, setImage] = useState({
    data: {
      id: '',
      accessionNumber: '',
      title: '',
      year: '',
      additionalPrintYear: '',
      medium: '',
      width: '',
      height: '',
      matWidth: '',
      matHeight: '',
      edition: '',
      condition: '',
      valuationNotes: '',
      otherNotes: '',
      copyright: '',
      subject: '',
      url: '',
      location: '',
      Artists: [],
      Tags: []
    }
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/images/${id}`);
        setImage(response.data);
      } catch (error) {
        console.error('API request error:', error);
      }
    };

    if (id) {
      fetchImage();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImage({
      data: {
        ...image.data,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:9000/api/images/${id}`, image.data);
      console.log('Image updated:', response.data);
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (

    <div className='ImageContainer'>
        
      <p className='Image'>Image Information</p>

      <form onSubmit={handleSubmit} className='InputBox'>
        <div>
          <label htmlFor="id">ID</label>
          <input
            type="text"
            id="id"
            name="id"
            value={image.data.id}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="accessionNumber">Accession Number</label>
          <input
            type="text"
            id="accessionNumber"
            name="accessionNumber"
            value={image.data.accessionNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={image.data.title}
            onChange={handleInputChange}
          />
        </div>

        <div>
            <label htmlFor="year">Year</label>
            <input
                type="text"
                id="year"
                name="year"
                value={image.data.year}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="additionalPrintYear">Additional Print Year</label>
            <input
                type="text"
                id="additionalPrintYear"
                name="additionalPrintYear"
                value={image.data.additionalPrintYear}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="medium">Medium</label>
            <input
                type="text"
                id="medium"
                name="medium"
                value={image.data.medium}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="width">Width</label>
            <input
                type="text"
                id="width"
                name="width"
                value={image.data.width}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="height">Height</label>
            <input
                type="text"
                id="height"
                name="height"
                value={image.data.height}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="matWidth">Mat Width</label>
            <input
                type="text"
                id="matWidth"
                name="matWidth"
                value={image.data.matWidth}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="matHeight">Mat Height</label>
            <input
                type="text"
                id="matHeight"
                name="matHeight"
                value={image.data.matHeight}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="edition">Edition</label>
            <input
                type="text"
                id="edition"
                name="edition"
                value={image.data.edition}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="condition">Condition</label>
            <input
                type="text"
                id="condition"
                name="condition"
                value={image.data.condition}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="valuationNotes">Valuation Notes</label>
            <input
                type="text"
                id="valuationNotes"
                name="valuationNotes"
                value={image.data.valuationNotes}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="otherNotes">Other Notes</label>
            <input
                type="text"
                id="otherNotes"
                name="otherNotes"
                value={image.data.otherNotes}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="copyright">Copyright</label>
            <input
                type="text"
                id="copyright"
                name="copyright"
                value={image.data.copyright}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="subject">Subject</label>
            <input
                type="text"
                id="subject"
                name="subject"
                value={image.data.subject}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="url">URL</label>
            <input
                type="text"
                id="url"
                name="url"
                value={image.data.url}
                onChange={handleInputChange}
            />
        </div>

        <div>
            <label htmlFor="location">Location</label>
            <input
                type="text"
                id="location"
                name="location"
                value={image.data.location}
                onChange={handleInputChange}
            />
        </div>

        <div>
        <label htmlFor="Artists">Artists</label>
        <input
            type="text"
            id="Artists"
            name="Artists"
            value={image.data.Artists.map(artist => `${artist.givenName} ${artist.familyName}`).join(', ')}
            onChange={handleInputChange}
        />
        </div>

        <div>
            <label htmlFor="Tags">Tags</label>
            <input
                type="text"
                id="Tags"
                name="Tags"
                value={image.data.Tags.map(tag => tag.tagName).join(', ')}
                onChange={handleInputChange}
            />
        </div>

        <div className="ButtonContainer">
          <button type="submit" className='GreenButton'>Save Changes</button>
        </div>    

    </form>

    </div>
  );
}

export default EditImage;
