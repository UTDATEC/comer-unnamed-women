import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import AdminNav from './AdminNav';
import CuratorList from './CuratorList';
import ExhibitionList from './ExhibitionList';
import ImageList from './ImageList';
import ImageEdit from './ImageEdit';
import InviteForm from './InviteForm';
import Profile from './Profile';
import { Box } from '@mui/material';


function Admin() {
  
  const containerStyle = {
    display: 'flex',
  };

  const adminNavStyle = {
    flex: 1,
  };

  const AdminContent = {
    flex: 3, 
  };

  return (
    <>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '200px auto',
        gridTemplateRows: '1fr',
        gridTemplateAreas: `
          "sidebar main"
        `
      }}>


        <AdminNav sx={{gridArea: 'sidebar'}}/>
        
        <Box sx={{gridArea: 'main'}}>
          
          <Routes>
            <Route path="Profile" element={<Profile />} />
            <Route path="CuratorList" element={<CuratorList />} />
            <Route path="ExhibitionList" element={<ExhibitionList />} />
            <Route path="ImageList" element={<ImageList />} />
            <Route path="Invite" element={<InviteForm />} />
            <Route path="ImageEdit/:id" element={<ImageEdit />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  );
}

export default Admin;
