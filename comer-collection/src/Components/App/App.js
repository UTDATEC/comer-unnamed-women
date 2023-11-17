import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView';
import SearchBy from '../SearchBy/SearchBy';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { useEffect, useState } from 'react';
import Account from '../Users/Account'
import Admin from '../Users/Admin/Admin';
import Curator from '../Users/Curator/Curator';

import ExhibitionViewer from '../ExhibitionViewer/ExhibitionViewer';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { green, orange } from '@mui/material/colors';

const App = () => {
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
      body1: {
        fontWeight: 500,
        fontSize: '0.9rem'
      }
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

  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  useEffect(() => {
    const setAppUser = async() => {
      try {
        const response = await fetch("http://localhost:9000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.status == 200) {
          let responseJson = await response.json();
          setCurrentUserProfile(responseJson.data);
        } else {
          throw new Error("Response status was not 200")
        }
      } catch (error) {
        setCurrentUserProfile(null);
      }
      
    }
    setAppUser();
  }, []);


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
        <NavBar user={currentUserProfile} setUser={setCurrentUserProfile} sx={{ gridArea: 'header' }} />
        <Box sx={{ gridArea: 'body', position: 'relative' }} >
        <Routes>
          <Route path="/searchBy" element={<SearchBy paramSetter={setSearchParams} />} />
          <Route path="/exhibition_viewer" element={<ExhibitionViewer />} />

          <Route path="/Account" element={<Account />} />
          <Route path="/Admin/*" element={<Admin />} />
          <Route path="/Curator/*" element={<Curator />} />

          <Route path="/login" element={<Login user={currentUserProfile} setUser={setCurrentUserProfile} />} />
          
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

export default App;