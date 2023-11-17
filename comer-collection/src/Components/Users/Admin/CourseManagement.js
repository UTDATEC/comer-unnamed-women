import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import Unauthorized from '../../ErrorPages/Unauthorized';

const dateOptions = {month: "long", day: "numeric", year: "numeric"};

const Course = (props) => {
  const [courses, setCourses] = useState([]);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseStartDate, setNewCourseStartDate] = useState('');
  const [newCourseEndDate, setNewCourseEndDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('null');
  const [newCurators, setNewCurators] = useState([]);

  const { user, setSelectedNavItem } = props;
  setSelectedNavItem("Course Management")

  if(user.is_admin) {
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

  }

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
  
      const updatedCourses = response.data.data;
      setCourses(updatedCourses);
  
      // Clear input fields
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
      await axios.post(`/api/courses/${selectedCourse}/users/${newCurators}`, {
        userNames: newCurators,

        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      await axios.post(`/api/courses/${selectedCourse}/users/${newCurators}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNewCurators([]);
    } catch (error) {
      console.error('Error adding users to course:', error);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return !user.is_admin && (
      <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Admin/Profile" />
    ) ||
    user.is_admin && (
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
              <Typography>Create Course</Typography>
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

      <h3>Enroll Curators in Course</h3>

      <Box component="form">
        <Stack spacing={2}>
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id} sx={{textOverflow: "ellipsis"}}>
                <Typography width="30%" sx={{textOverflow: "ellipsis"}}>{course.name}</Typography>
                <Typography width="20%" sx={{opacity: 0.5}}>{
                  new Date(course.date_start).toLocaleDateString("en-US", dateOptions)
                } - {
                  new Date(course.date_end).toLocaleDateString("en-US", dateOptions)
                }</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Email"
          variant="outlined"
          value={newCurators.join(",")}
          onChange={(e) => setNewCurators(e.target.value.split(","))}
        />
        <Stack spacing={2} direction="row" style={{ display: "block", textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAddUserToCourse}
          disabled={!Boolean(selectedCourse && newCurators.length > 0)}
        >
          <Typography>Enroll</Typography>
        </Button>
        </Stack>
        </Stack>
      </Box>
    </div>
  );
};

export default Course;
