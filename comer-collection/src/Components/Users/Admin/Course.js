import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseStartDate, setNewCourseStartDate] = useState('');
  const [newCourseEndDate, setNewCourseEndDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCurators, setNewCurators] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        console.log('Fetched data:', response.data); 
        setCourses(response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setSelectedCourse("");
        } else {
          console.error("Response Data Error:", response.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateCourse = async () => {
    try {
      // Log before making the request
      const courseData = {
        name: newCourseTitle,
        date_start: newCourseStartDate,
        date_end: newCourseEndDate,
      };

      await axios.post('http://localhost:9000/api/courses', courseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await axios.get('http://localhost:9000/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCourses(response.data);

      setNewCourseTitle('');
      setNewCourseStartDate('');
      setNewCourseEndDate('');
    } catch (error) {
      console.error('Error adding course:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Status Code:', error.response.status);
      }
    }
  };

  const handleAddUserToCourse = async () => {
    if (!selectedCourse || newCurators.length === 0) {
      alert('Please input the course and enter at least one Net ID.');
      return;
    }

    try {
      await axios.post(`/api/courses/${selectedCourse}/addUsers`, {
        userNames: newCurators,
      });

      const response = await axios.get('/api/courses');
      setCourses(response.data);

      setNewCurators([]);
    } catch (error) {
      console.error('Error adding users to course:', error);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div style={{ maxWidth: "70%", margin: "auto", overflowY: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Courses List</h1>
      <h3>Create Course</h3>
      <Box component="form">
        <Stack spacing={2}>
          <TextField 
            label="Course Title"
            variant='outlined' 
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Start:</Typography>
            <TextField 
              variant='outlined' 
              size="small"
              value={newCourseStartDate}
              onChange={(e) => setNewCourseStartDate(e.target.value)}
              inputProps={{type: 'datetime-local'}}
            />
            <Typography>End: </Typography>
            <TextField 
              variant='outlined' 
              size="small"
              value={newCourseEndDate}
              onChange={(e) => setNewCourseEndDate(e.target.value)}
              inputProps={{type: 'datetime-local'}}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            style={{ display: "block", textAlign: "center" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateCourse}
              disabled={
                !Boolean(
                  newCourseTitle && newCourseStartDate && newCourseEndDate
                )
              }
            >
              <Typography>Add Course</Typography>
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setNewCourseTitle('');
                setNewCourseStartDate('');
                setNewCourseEndDate('');
              }}
            >
              <Typography>Clear</Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>

      <h3>Add Curators to the Course</h3>

      <Box component="form">
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Select Course"
            style={{ paddingTop: "5px", paddingBottom: "10px" }}
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
        </FormControl>

        <TextField
          label="Email"
          variant="outlined"
          value={newCurators.join(",")}
          style={{ width: "100%", paddingTop: "5px", paddingBottom: "10px" }}
          onChange={(e) => setNewCurators(e.target.value.split(","))}
        />
        <Button
          variant="contained"
          size="large"
          style={{ display: "block", margin: "auto", textAlign: "center" }}
          onClick={handleAddUserToCourse}
          disabled={!Boolean(selectedCourse && newCurators.length > 0)}
        >
          <Typography>Add Curators</Typography>
        </Button>
      </Box>
    </div>
  );
};

export default Course;
