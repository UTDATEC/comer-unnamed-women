import React from 'react';
import { Navigate,Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import CuratorNav from './CuratorNav';
import Exhibition from './Exhibition';
import Image from './Image';
import Profile from './Profile';
import { Box } from '@mui/material';

function Curator() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '250px auto',
        gridTemplateRows: '1fr',
        gridTemplateAreas: `
          "sidebar main"
        `,
      }}
    >
      <CuratorNav sx={{ gridArea: 'sidebar' }} />

      <Box sx={{ gridArea: 'main', position: 'relative' }}>
        <Routes>
          <Route index element={<Navigate to='Profile' replace />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="ExhibitionList" element={<Exhibition />} />
          <Route path="ImageList" element={<Image />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Curator;
