import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Image.css';

// Separate component for input fields
const InputField = ({ label, id, name, value = '', onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

// Separate component for Artists input
const ArtistsInput = ({ artists, onChange }) => {
  return (
    <div>
      <label htmlFor="Artists">Artists</label>
      <input
        type="text"
        id="Artists"
        name="Artists"
        value={artists.map((artist) => `${artist.givenName || ''} ${artist.familyName || ''}`).join(', ')}
        onChange={onChange}
      />
    </div>
  );
};

// Separate component for Tags input
const TagsInput = ({ tags, onChange }) => {
  return (
    <div>
      <label htmlFor="Tags">Tags</label>
      <input
        type="text"
        id="Tags"
        name="Tags"
        value={tags.map((tag) => tag.tagName || '').join(', ')}
        onChange={onChange}
      />
    </div>
  );
};

function EditImage() {
  const navigate = useNavigate();   
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
      Tags: [],
    },
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
        [name]: value || '', 
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...imageData } = image.data; // Extract data
      const response = await axios.put(`http://localhost:9000/api/images/${id}`, imageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Image updated:', response.data);
      navigate('/Admin/ImageList');
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (
    <div className="ImageContainer">
      <p className="Image">Image Information</p>

      <form onSubmit={handleSubmit} className="InputBox">
        {/* Use the InputField component for each input */}
        <InputField label="ID" id="id" name="id" value={image.data.id} onChange={handleInputChange} />
        <InputField label="Accession Number" id="accessionNumber" name="accessionNumber" value={image.data.accessionNumber} onChange={handleInputChange} />
        <InputField label="Title" id="title" name="title" value={image.data.title} onChange={handleInputChange} />
        <InputField label="Year" id="year" name="year" value={image.data.year} onChange={handleInputChange} />
        <InputField label="Additional Print Year" id="additionalPrintYear" name="additionalPrintYear" value={image.data.additionalPrintYear} onChange={handleInputChange} />
        <InputField label="Medium" id="medium" name="medium" value={image.data.medium} onChange={handleInputChange} />
        <InputField label="Width" id="width" name="width" value={image.data.width} onChange={handleInputChange} />
        <InputField label="Height" id="height" name="height" value={image.data.height} onChange={handleInputChange} />
        <InputField label="Mat Width" id="matWidth" name="matWidth" value={image.data.matWidth} onChange={handleInputChange} />
        <InputField label="Mat Height" id="matHeight" name="matHeight" value={image.data.matHeight} onChange={handleInputChange} />
        <InputField label="Edition" id="edition" name="edition" value={image.data.edition} onChange={handleInputChange} />
        <InputField label="Condition" id="condition" name="condition" value={image.data.condition} onChange={handleInputChange} />
        <InputField label="Valuation Notes" id="valuationNotes" name="valuationNotes" value={image.data.valuationNotes} onChange={handleInputChange} />
        <InputField label="Other Notes" id="otherNotes" name="otherNotes" value={image.data.otherNotes} onChange={handleInputChange} />
        <InputField label="Copyright" id="copyright" name="copyright" value={image.data.copyright} onChange={handleInputChange} />
        <InputField label="Subject" id="subject" name="subject" value={image.data.subject} onChange={handleInputChange} />
        <InputField label="URL" id="url" name="url" value={image.data.url} onChange={handleInputChange} />
        <InputField label="Location" id="location" name="location" value={image.data.location} onChange={handleInputChange} />

        {/* Use the ArtistsInput component for Artists input */}
        <ArtistsInput artists={image.data.Artists} onChange={handleInputChange} />

        {/* Use the TagsInput component for Tags input */}
        <TagsInput tags={image.data.Tags} onChange={handleInputChange} />

        <div className="ButtonContainer">
          <button type="submit" className="GreenButton">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditImage;
