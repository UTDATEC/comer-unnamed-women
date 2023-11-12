import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
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



      <div style={ContainerStyle}>

        <div style={CuratorNavStyle}>
          <CuratorNav />
        </div>
        
        <div style={CuratorContent}>

          <Routes>
            <Route path="Profile" element={<Profile />} />
            <Route path="ExhibitionList" element={<Exhibition />} />
            <Route path="ImageList" element={<Image />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default Curator;
