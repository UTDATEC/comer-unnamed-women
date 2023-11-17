import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import AdminNav from './AdminNav';
import CuratorList from './CuratorList';
import ExhibitionList from './ExhibitionList';
import ImageList from './ImageList';
import ImageEdit from './ImageEdit';
import Course from './Course'
import InviteForm from './InviteForm';
import Profile from './Profile';
import { Box } from '@mui/material';


const Admin = (props) => {

  const { user, setUser } = props; 

  return (
    <>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '250px auto',
        gridTemplateRows: '1fr',
        gridTemplateAreas: `
          "sidebar main"
        `
      }}>


        <AdminNav sx={{gridArea: 'sidebar'}}/>
        
        <Box sx={{gridArea: 'main', position: 'relative'}}>
          
          <Routes>
            <Route index element={<Navigate to='Profile' replace />} />
            <Route path="Profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="CuratorList" element={<CuratorList />} />
            <Route path="ExhibitionList" element={<ExhibitionList />} />
            <Route path="ImageList" element={<ImageList />} />
            <Route path="Course" element={<Course />} />
            <Route path="Invite" element={<InviteForm />} />
            <Route path="ImageEdit/:id" element={<ImageEdit />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  );
}

export default Admin;
