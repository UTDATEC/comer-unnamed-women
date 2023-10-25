import React from 'react';
import { Route } from 'react-router-dom'; // Import Route from react-router-dom
import NavBar from '../../NavBar/NavBar';
import CuratorNav from './CuratorNav';
import Exhibition from './Exhibition';
import Image from './Image';
import Profile from './Profile';


function Curator() {
  
  const ContainerStyle = {
    display: 'flex',
  };

  const CuratorNavStyle = {
    flex: 1,
  };

  const CuratorContent = {
    flex: 3, 
  };

  return (
    <div>

      <NavBar />


      <div style={ContainerStyle}>

        <div style={CuratorNavStyle}>
          <CuratorNav />
        </div>
        
        <div style={CuratorContent}>

          <Route path="/Curator/Profile">
            <Profile />
          </Route>
          
          <Route path="/Curator/ExhibitionList">
            <Exhibition />
          </Route>

          <Route path="/Curator/ImageList">
            <Image />
          </Route>

        </div>
      </div>
    </div>
  );
}

export default Curator;
