import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Course.css';

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
      console.log('Before sending:', courseData);
  
      await axios.post(
        'http://localhost:9000/api/courses',
        courseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Updated data:', courseData);
  
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
      // Log the error details
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
      await axios.post(`/api/courses/${selectedCourse.id}/addUsers`, {
        userNames: newCurators,
      });

      const response = await axios.get('/api/courses');
      setCourses(response.data);

      setNewCurators([]);
    } catch (error) {
      console.error('Error adding users to course:', error);
    }
  };

  return (
    <div className="course-container">
      <h1>Courses List</h1>



      <h2>Create Course</h2>

      <Box component="form">
        <Stack direction="column" spacing={2}>
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
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large" 
              onClick={handleCreateCourse}
              disabled={!Boolean(newCourseTitle && newCourseStartDate && newCourseEndDate)}
            >
              <Typography>Add Course</Typography>
            </Button>
            <Button variant="outlined" size="large" onClick={() => {
              setNewCourseTitle('');
              setNewCourseStartDate('');
              setNewCourseEndDate('');
            }}>
              <Typography>Clear</Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>


      <h2>Add Curators to the Course</h2>
      <div className="input-container">
        <label>Enter Course Title:</label>
        <input
          type="text"
          value={selectedCourse ? selectedCourse.title : ''}
          onChange={(e) => setSelectedCourse({ id: null, title: e.target.value })}
        />
      </div>

      <div className="input-container">
        <label>Net IDs (can add multiple curators):</label>
        <input
          type="text"
          value={newCurators.join(',')}
          onChange={(e) => setNewCurators(e.target.value.split(','))}
        />
      </div>

      <button className="GreenButton" onClick={handleAddUserToCourse}>
        Add Curators
      </button>
    </div>
  );
};

export default Course;
