import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, TextField, Button } from "@mui/material";

// Separate component for input fields
const InputField = ({ label, name, value = "", onChange }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <TextField
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
      />
    </div>
  );
};

// Separate component for Artists input
const ArtistsInput = ({ artists, onChange }) => {
  return (
    <div>
      <label htmlFor="Artists">Artists</label>
      <TextField
        type="text"
        id="Artists"
        name="Artists"
        value={artists
          .map(
            (artist) => `${artist.givenName || ""} ${artist.familyName || ""}`
          )
          .join(", ")}
        onChange={onChange}
        style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
      />
    </div>
  );
};

// Separate component for Tags input
const TagsInput = ({ tags, onChange }) => {
  return (
    <div>
      <label htmlFor="Tags">Tags</label>
      <TextField
        type="text"
        id="Tags"
        name="Tags"
        value={tags.map((tag) => tag.tagName || "").join(", ")}
        onChange={onChange}
        style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
      />
    </div>
  );
};

function EditImage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [image, setImage] = useState({
    data: {
      id: "",
      accessionNumber: "",
      title: "",
      year: "",
      additionalPrintYear: "",
      medium: "",
      width: "",
      height: "",
      matWidth: "",
      matHeight: "",
      edition: "",
      condition: "",
      valuationNotes: "",
      otherNotes: "",
      copyright: "",
      subject: "",
      url: "",
      location: "",
      Artists: [],
      Tags: [],
    },
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/images/${id}`
        );
        setImage(response.data);
      } catch (error) {
        console.error("API request error:", error);
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
        [name]: value || "",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...imageData } = image.data; // Extract data
      const response = await axios.put(
        `http://localhost:9000/api/images/${id}`,
        imageData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Image updated:", response.data);
      navigate("/Admin/ImageManagement");
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  return (
    <Container style={{ paddingTop: "30px" }} maxWidth="sm">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ fontWeight: "bold" }}
      >
        Image Information
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Use the InputField component for each input */}
        <TextField
          label="ID"
          name="id"
          value={image.data.id}
          disabled
          onChange={handleInputChange}
          style={{
            width: "100%",
            backgroundColor: "#EFF1ED",
            marginTop: "15px",
            marginBottom: "5px",
          }}
        />
        <InputField
          label="Accession Number"
          name="accessionNumber"
          value={image.data.accessionNumber}
          onChange={handleInputChange}
        />
        <InputField
          label="Title"
          name="title"
          value={image.data.title}
          onChange={handleInputChange}
        />
        <InputField
          label="Year"
          name="year"
          value={image.data.year}
          onChange={handleInputChange}
        />
        <InputField
          label="Additional Print Year"
          name="additionalPrintYear"
          value={image.data.additionalPrintYear}
          onChange={handleInputChange}
        />
        <InputField
          label="Medium"
          name="medium"
          value={image.data.medium}
          onChange={handleInputChange}
        />
        <InputField
          label="Width"
          name="width"
          value={image.data.width}
          onChange={handleInputChange}
        />
        <InputField
          label="Height"
          name="height"
          value={image.data.height}
          onChange={handleInputChange}
        />
        <InputField
          label="Mat Width"
          name="matWidth"
          value={image.data.matWidth}
          onChange={handleInputChange}
        />
        <InputField
          label="Mat Height"
          name="matHeight"
          value={image.data.matHeight}
          onChange={handleInputChange}
        />
        <InputField
          label="Edition"
          name="edition"
          value={image.data.edition}
          onChange={handleInputChange}
        />
        <InputField
          label="Condition"
          name="condition"
          value={image.data.condition}
          onChange={handleInputChange}
        />
        <InputField
          label="Valuation Notes"
          name="valuationNotes"
          value={image.data.valuationNotes}
          onChange={handleInputChange}
        />
        <InputField
          label="Other Notes"
          name="otherNotes"
          value={image.data.otherNotes}
          onChange={handleInputChange}
        />
        <InputField
          label="Copyright"
          name="copyright"
          value={image.data.copyright}
          onChange={handleInputChange}
        />
        <InputField
          label="Subject"
          name="subject"
          value={image.data.subject}
          onChange={handleInputChange}
        />
        <InputField
          label="URL"
          name="url"
          value={image.data.url}
          onChange={handleInputChange}
        />
        <InputField
          label="Location"
          name="location"
          value={image.data.location}
          onChange={handleInputChange}
        />

        {/* Use the ArtistsInput component for Artists input */}
        <ArtistsInput
          artists={image.data.Artists}
          onChange={handleInputChange}
        />

        {/* Use the TagsInput component for Tags input */}
        <TagsInput tags={image.data.Tags} onChange={handleInputChange} />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ fontWeight: "normal" }}
            onMouseOver={(e) => (e.currentTarget.style.fontWeight = "bold")}
            onMouseOut={(e) => (e.currentTarget.style.fontWeight = "normal")}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default EditImage;
