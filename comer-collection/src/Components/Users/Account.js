import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import AdminNav from './AccountNav';
import UserManagement from './Admin/UserManagement';
import ImageManagement from './Admin/ImageManagement';
import Profile from './Profile';
import { Box } from '@mui/material';
import Unauthorized from '../ErrorPages/Unauthorized';
import ChangePassword from './ChangePassword';
import CourseManagement from './Admin/CourseManagement';
import MyExhibitions from './MyExhibitions';
import ExhibitionManagement from './Admin/ExhibitionManagement';
import { useAppUser } from '../App/AppUser';


const Account = (props) => {

  const [appUser, setAppUser] = useAppUser();

  const [selectedNavItem, setSelectedNavItem] = useState("");

  return appUser && (
    <>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '250px auto',
        gridTemplateAreas: `
          "sidebar main"
        `,
        height: "100%"
      }}>


        <AdminNav sx={{gridArea: 'sidebar'}} {...{selectedNavItem, setSelectedNavItem}} />
        
        <Box sx={{gridArea: 'main', position: 'relative', overflowY: "hidden", height: '100%'}}>
          
          <Routes>
            <Route index element={
              !appUser.password_change_required && (<Navigate to='Profile' replace />) ||
              appUser.password_change_required && (<Navigate to='ChangePassword' replace />)
            } />
            <Route path="Profile" element={<Profile {...{selectedNavItem, setSelectedNavItem }} />} />
            <Route path="ChangePassword" element={<ChangePassword {...{selectedNavItem, setSelectedNavItem}} />} />
            <Route path="MyExhibitions" element={<MyExhibitions {
              ...{selectedNavItem, setSelectedNavItem }
              } />} />
            <Route path="UserManagement" element={<UserManagement {...{selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ExhibitionManagement" element={<ExhibitionManagement {...{selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ImageManagement" element={<ImageManagement {...{selectedNavItem, setSelectedNavItem }} />} />
            <Route path="CourseManagement" element={<CourseManagement {...{selectedNavItem, setSelectedNavItem}} />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  ) || !appUser && (
    <Unauthorized />
  );
}

export default Account;
