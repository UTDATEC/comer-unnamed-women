import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView';
import ExpandedView from '../ExpandedView/ExpandedView';
import SearchBy from '../SearchBy/SearchBy';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { Component, useEffect, useState } from 'react';
import Admin from '../Users/Admin/Admin';
import Curator from '../Users/Curator/Curator';

import { PrivateRoute } from '../Routes/PrivateRoute';
import ExhibitionViewer from '../ExhibitionViewer/ExhibitionViewer';
import { ThemeProvider, createTheme } from '@mui/material';
import { green, orange } from '@mui/material/colors';

export default function App() {
  const [searchParams, setSearchParams] = useState({
    title: '',
    inscriptions: '',
    medium: '',
    subject: '',
    tags: '',
    dateCreated: '',
    dimensions: '',
    accessionNumber: '',
    collectionLocation: '',
    copyright: '',
    artist: '',
  });

  const [selectedImage, setSelectedImage] = useState({
    accessionNumber: '',
    artist: '',
    collectionLocation: '',
    copyright: '',
    createdAt: '',
    dateCreated: '',
    dimensions: '',
    fileName: '',
    id: -1,
    inscriptions: '',
    medium: '',
    subject: '',
    tags: '',
    title: '',
    updatedAt: '',
  });

  const theme = createTheme({
    typography: {
      fontFamily: [
        "Helvetica"
      ].join(","),
      fontSize: 12,
    },
    palette: {
      primary: {
        main: green['900'],
        contrastText: 'white'
      },
      secondary: {
        main: orange['700'],
        contrastText: 'black'
      }
    }
  })

  return (
    <div className="wrapper">
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/searchBy" element={<SearchBy paramSetter={setSearchParams} />} />
          <Route path="/exhibition_viewer" element={<ExhibitionViewer />} />
          <Route path="/expandedView" element={<ExpandedView selectedImage={selectedImage} />} />

          <Route path="/Admin/*" element={<Admin />} />
          <Route path="/Curator/*" element={<Curator />} />

          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <GridView
            searchParams={searchParams}
            setSelectedImage={setSelectedImage}
          />
          } />
            
        </Routes>
        
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}
