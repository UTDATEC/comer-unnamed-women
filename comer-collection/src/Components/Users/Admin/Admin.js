import React from 'react';
import { Route } from 'react-router-dom'; // Import Route from react-router-dom
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

          <Route path="/Admin/Profile">
            <Profile />
          </Route>

          <Route path="/Admin/CuratorList">
            <CuratorList />
          </Route>
          
          <Route path="/Admin/ExhibitionList">
            <ExhibitionList />
          </Route>

          <Route path="/Admin/ImageList">
            <ImageList />
          </Route>

          <Route path="/Admin/ImageEdit/:id" component={ImageEdit} />


          <Route path="/Admin/Invite">
            <InviteForm />
          </Route>

        </div>
      </div>
    </div>
  );
}

export default Admin;
