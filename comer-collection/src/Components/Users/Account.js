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


const Account = (props) => {

  const { appUser, setAppUser, showSnackbar,
    snackbarOpen, snackbarText, snackbarSeverity,
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity
  } = props; 

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


        <AdminNav sx={{gridArea: 'sidebar'}} {...{appUser, selectedNavItem, setSelectedNavItem}} />
        
        <Box sx={{gridArea: 'main', position: 'relative', overflowY: "hidden", height: '100%'}}>
          
          <Routes>
            <Route index element={
              !appUser.password_change_required && (<Navigate to='Profile' replace />) ||
              appUser.password_change_required && (<Navigate to='ChangePassword' replace />)
            } />
            <Route path="Profile" element={<Profile {
              ...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar,
                snackbarOpen, snackbarText, snackbarSeverity,
                setSnackbarOpen, setSnackbarText, setSnackbarSeverity
                }
              } />} />
            <Route path="ChangePassword" element={<ChangePassword {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="MyExhibitions" element={<MyExhibitions {
              ...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar,
                snackbarOpen, snackbarText, snackbarSeverity,
                setSnackbarOpen, setSnackbarText, setSnackbarSeverity
                }
              } />} />
            <Route path="UserManagement" element={<UserManagement {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar}} />} />
            <Route path="ExhibitionManagement" element={<ExhibitionManagement {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar}} />} />
            <Route path="ImageManagement" element={<ImageManagement {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar }} />} />
            <Route path="CourseManagement" element={<CourseManagement {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, showSnackbar}} />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  ) || !appUser && (
    <Unauthorized />
  );
}

export default Account;
