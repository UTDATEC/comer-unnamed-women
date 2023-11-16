import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const InviteForm = () => {
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setSelectedCourse("");
        } else {
          console.error("Response Data Error:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddEmail = () => {
    if (email.trim() && !emailList.includes(email)) {
      setEmailList([...emailList, email + "@utdallas.edu"]);
      setEmail("");
    }
  };

  const handleClearInput = () => {
    setEmailList([]);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddEmail();
    }
  };

  const handleSubmit = async () => {
    try {
      const curatorToCourse = {
        courseId: selectedCourse.id,
        name: selectedCourse.name,
        date_start: selectedCourse.date_start,
        date_end: selectedCourse.date_end,
        invitation: emailList.map((email) => ({ email })),
      };

      console.log("Data:", curatorToCourse);

      await axios.post("http://localhost:9000/api/courses", curatorToCourse, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Data:", curatorToCourse);
      // Reset the state after successful submission
      setEmailList([]);
      setEmail("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.error("Response Data Error:", error.response.data);
        console.error("Status Code Error:", error.response.status);
      }
    }
  };

  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value, 10);
    const selectedCourse = courses.find((course) => course.id === courseId);
    console.log("Selected Course:", selectedCourse);

    if (selectedCourse) {
      setSelectedCourse(selectedCourse);
    } else {
      console.error("Error selecting course: Course not found");
    }
  };

  return (
    <Container maxWidth="sm">
      <div style={{ paddingTop: "30px" }}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Invite Form
        </Typography>

        <div style={{ paddingTop: "5px" }}>
          <Card style={{ border: "1px solid lightgrey" }}>
            <CardContent>
              <Typography variant="body1">
                Instruction: <br />
                1. Input Net ID and press 'Enter' or 'Add Email' to add.
                <br />
                2. Click Invite after finishing adding.
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div style={{ paddingTop: "5px" }}>
          <TextField
            type="text"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            onKeyPress={handleEnterKeyPress}
            variant="outlined"
            required
            style={{ width: "100%" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 8, fontWeight: "normal" }}
            onMouseOver={(e) => (e.currentTarget.style.fontWeight = "bold")}
            onMouseOut={(e) => (e.currentTarget.style.fontWeight = "normal")}
            onClick={handleAddEmail}
          >
            Add Email
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "red",
              color: "white",
              fontWeight: "normal",
            }}
            onMouseOver={(e) => (e.currentTarget.style.fontWeight = "bold")}
            onMouseOut={(e) => (e.currentTarget.style.fontWeight = "normal")}
            onClick={handleClearInput}
          >
            Clear
          </Button>
        </div>

        <div style={{ width: "100%", paddingTop: "10px" }}>
          <TextField
            label="Email Addresses"
            multiline
            rows={5}
            value={emailList.join("\n")}
            disabled
            variant="outlined"
            style={{ width: "100%", backgroundColor: "lightgrey" }}
          />
        </div>

        <div>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel>Select Course</InputLabel>
            <div
              style={{
                width: "100%",
                paddingTop: "5px",
                paddingBottom: "10px",
              }}
            >
              <Select
                value={selectedCourse.id}
                onChange={handleCourseChange}
                label="Select Course"
                style={{ width: "100%" }}
              >
                <MenuItem value="" style={{ backgroundColor: "transparent" }}>
                  <em>&nbsp;</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </FormControl>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ fontWeight: "normal" }}
            onMouseOver={(e) => (e.currentTarget.style.fontWeight = "bold")}
            onMouseOut={(e) => (e.currentTarget.style.fontWeight = "normal")}
            onClick={handleSubmit}
          >
            Invite
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default InviteForm;
