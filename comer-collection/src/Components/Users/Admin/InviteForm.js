import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../InviteForm.css"; 

const InviteForm = () => {
  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setSelectedCourse('');
        } else {
          console.error('Response Data Error:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddEmail = () => {
    if (email.trim() && !emailList.includes(email)) {
      setEmailList([...emailList, email + '@utdallas.edu']);
      setEmail('');
    }
  };

  const handleClearInput = () => {
    setEmailList([]);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
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
        invitation: emailList.map(email => ({ email })),
      };
  
      console.log('Data:', curatorToCourse);
  
      await axios.post('http://localhost:9000/api/courses', curatorToCourse, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Data:', curatorToCourse);
      // Reset the state after successful submission
      setEmailList([]);
      setEmail('');
      setSelectedCourse('');
    } catch (error) {
      console.error('Error:', error);
  
      if (error.response) {
        console.error('Response Data Error:', error.response.data);
        console.error('Status Code Error:', error.response.status);
      }
    }
  };
  
  
  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value, 10); 
    const selectedCourse = courses.find(course => course.id === courseId);
    console.log('Selected Course:', selectedCourse);
  
    if (selectedCourse) {
      setSelectedCourse(selectedCourse);
    } else {
      console.error('Error selecting course: Course not found');
    }
  };

  return (
    <div className="container-invite">
      <div className="invite-form">
        <h1>Invite Form</h1>

        <div className="form-group">
          <label>
            Instructions: <br></br>
            1. Input Net ID and press <strong>Enter</strong> or <strong>Add Email</strong> to add <br></br>
            <i>@utdallas.edu</i> will be automatically added. <br></br>
            2. Click <strong>Invite</strong> after finishing adding.
          </label>
          <div>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleEnterKeyPress}
              required
            />
          </div>
        </div>

        <div className="form-group center-button">
          <button className="green-button rounded-button" onClick={handleAddEmail}>Add Email</button>
          <button className="red-button rounded-button" onClick={handleClearInput}>Clear</button>
        </div>

        <div className="form-group">
          <label>Email Addresses:</label>
          <textarea
            value={emailList.join('\n')}
            rows="5"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Select Course:</label>
          <select value={selectedCourse.id} onChange={handleCourseChange}>
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>


        <div className="form-group center-button">
          <button className="green-button rounded-button" onClick={handleSubmit}>Invite</button>
        </div>
      </div>
    </div>
  );
};

export default InviteForm;
