import React from 'react';
import { Route } from 'react-router-dom'; // Import Route from react-router-dom
import NavBar from '../NavBar/NavBar';
import AdminNav from './Nav/AdminNav';
import StudentList from './StudentList/StudentList';
import ExhibitionList from './ExhibitionList/ExhibitionList';
import ImageList from './ImageList/ImageList';
import InviteForm from './Invite/InviteForm';
import Profile from './Profile/Profile';


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

          <Route path="/Admin/Profile">
            <Profile />
          </Route>

          <Route path="/Admin/StudentList">
            <StudentList />
          </Route>
          
          <Route path="/Admin/ExhibitionList">
            <ExhibitionList />
          </Route>

          <Route path="/Admin/ImageList">
            <ImageList />
          </Route>

          <Route path="/Admin/Invite">
            <InviteForm />
          </Route>

        </div>
      </div>
    </div>
  );
}

export default Admin;
