import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import AdminNav from './AccountNav';
import UserManagement from './Admin/UserManagement';
import ExhibitionList from './Admin/ExhibitionList';
import ImageManagement from './Admin/ImageManagement';
import ImageEdit from './Admin/ImageEdit';
import Course from './Admin/CourseManagement'
import InviteForm from './Admin/InviteForm';
import Profile from './Profile';
import { Box } from '@mui/material';
import Unauthorized from '../ErrorPages/Unauthorized';
import ChangePassword from './ChangePassword';


const Account = (props) => {

  const { user, setUser } = props; 

  const [selectedNavItem, setSelectedNavItem] = useState("");

  return user && (
    <>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '250px auto',
        gridTemplateAreas: `
          "sidebar main"
        `,
        height: "100%"
      }}>


        <AdminNav sx={{gridArea: 'sidebar'}} {...{user, selectedNavItem, setSelectedNavItem}} />
        
        <Box sx={{gridArea: 'main', position: 'relative', overflowY: "hidden", height: '100%'}}>
          
          <Routes>
            <Route index element={<Navigate to='Profile' replace />} />
            <Route path="Profile" element={<Profile {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ChangePassword" element={<ChangePassword {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="UserManagement" element={<UserManagement {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ExhibitionList" element={<ExhibitionList {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ImageManagement" element={<ImageManagement {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="Course" user={user} element={<Course {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="Invite" user={user} element={<InviteForm {...{user, setUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ImageEdit/:id" user={user} element={<ImageEdit />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  ) || !user && (
    <Unauthorized />
  );
}

export default Account;
