import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView';
import SearchBy from '../SearchBy/SearchBy';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { useEffect, useState } from 'react';
import Account from '../Users/Account';

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

  const primaryColor = green;
  const secondaryColor = orange;

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
      mode: "light",
      primary: {
        main: primaryColor['900'],
        light: primaryColor['500'],
        contrastText: 'white',
        "200": primaryColor['200']
      },
      secondary: {
        main: secondaryColor['700'],
        contrastText: 'black',
        "200": secondaryColor['200']
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
          gridTemplateRows: '64px calc(100vh - 64px)',
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

          {/* <Route path="/Account" element={<Account />} /> */}
          <Route path="/Account/*" element={<Account  user={currentUserProfile} setUser={setCurrentUserProfile} />} />
          {/* <Route path="/Curator/*" element={<Curator />} /> */}

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