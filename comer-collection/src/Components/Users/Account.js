import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Admin from './Admin/Admin';
import Curator from './Curator/Curator';
import axios from 'axios';

function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const userData = response.data.data[0];
        setUser(userData);
        console.log('User:', userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Redirect to the appropriate route based on the user's role
    if (user) {
      const isAdmin = user.is_admin;
      if (isAdmin) {
        navigate('/Admin', { replace: true });
      } else {
        navigate('/Curator', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="Admin/*" element={<Admin />} />
      <Route path="Curator/*" element={<Curator />} />
    </Routes>
  );
}

export default Account;
