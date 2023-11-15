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
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = async () => {
    try {
      await axios.post('/api/courses', {
        title: newCourseTitle,
        startDate: newCourseStartDate,
        endDate: newCourseEndDate,
      });

      const response = await axios.get('/api/courses');
      setCourses(response.data);

      setNewCourseTitle('');
      setNewCourseStartDate('');
      setNewCourseEndDate('');
    } catch (error) {
      console.error('Error adding course:', error);
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
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id}>
            {course.title} - {course.startDate} to {course.endDate}
            <button onClick={() => setSelectedCourse(course)}>Add User</button>
          </li>
        ))}
      </ul>

      <h2>Add New Course</h2>
      <div className="input-container">
        <label>Title:</label>
        <input
          type="text"
          value={newCourseTitle}
          onChange={(e) => setNewCourseTitle(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label>Start Date:</label>
        <input
          type="text"
          value={newCourseStartDate}
          onChange={(e) => setNewCourseStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="text"
          value={newCourseEndDate}
          onChange={(e) => setNewCourseEndDate(e.target.value)}
        />
      </div>

      <button className="GreenButton" onClick={handleAddCourse}>
        Add Course
      </button>

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
