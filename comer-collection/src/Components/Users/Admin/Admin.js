import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import NavBar from '../../NavBar/NavBar';
import AdminNav from './AdminNav';
import CuratorList from './CuratorList';
import ExhibitionList from './ExhibitionList';
import ImageList from './ImageList';
import ImageEdit from './ImageEdit';
import InviteForm from './InviteForm';
import Profile from './Profile';


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
    <div>

      <NavBar />


      <div style={containerStyle}>

        <div style={adminNavStyle}>
          <AdminNav />
        </div>
        
        <div style={AdminContent}>
          
          <Routes>
            <Route path="Profile" element={<Profile />} />
            <Route path="CuratorList" element={<CuratorList />} />
            <Route path="ExhibitionList" element={<ExhibitionList />} />
            <Route path="ImageList" element={<ImageList />} />
            <Route path="Invite" element={<InviteForm />} />
            <Route path="ImageEdit/:id" element={<ImageEdit />} />

          </Routes>


          {/* <Route path="/Admin/ImageEdit/:id" component={ImageEdit} /> */}


        </div>
      </div>
    </div>
  );
}

export default Admin;
