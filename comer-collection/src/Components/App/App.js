import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView';
import SearchBy from '../SearchBy/SearchBy';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { useState } from 'react';
import Admin from '../Users/Admin/Admin';
import Curator from '../Users/Curator/Curator';

import ExhibitionViewer from '../ExhibitionViewer/ExhibitionViewer';
import { Box, ThemeProvider, createTheme } from '@mui/material';
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
      fontSize: 10,
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
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{
          height: '100vh', 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '64px auto',
          gridTemplateAreas: `
            "header"
            "body"
          `
        }}>
        <NavBar sx={{ gridArea: 'header' }} />
        <Box sx={{ gridArea: 'body' }} >
        <Routes>
          <Route path="/searchBy" element={<SearchBy paramSetter={setSearchParams} />} />
          <Route path="/exhibition_viewer" element={<ExhibitionViewer />} />

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
        </Box>
        </Box>
        
      </BrowserRouter>
      </ThemeProvider>
  );
}
