import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView';
import SearchBy from '../SearchBy/SearchBy';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { useEffect, useState } from 'react';
import Account from '../Users/Account';

import ExhibitionViewer from '../ExhibitionViewer/ExhibitionViewer';
import { Box, ThemeProvider, createTheme, Snackbar, Alert, Stack, Typography } from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';

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
        contrastText: 'white',
        "200": secondaryColor['200']
      },
      grey: {
        main: grey['800']
      }
    }
  })

  const [appUser, setAppUser] = useState(null);
  

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    const initializeAppUser = async() => {
      try {
        const response = await fetch("http://localhost:9000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.status == 200) {
          let responseJson = await response.json();
          setAppUser(responseJson.data);
        } else {
          throw new Error("Response status was not 200")
        }
      } catch (error) {
        setAppUser(null);
      }
      
    }
    initializeAppUser();
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
        <NavBar {...{appUser, setAppUser}} sx={{ gridArea: 'header' }} />
        <Box sx={{ gridArea: 'body', position: 'relative' }} >
        <Routes>
          <Route path="/searchBy" element={<SearchBy paramSetter={setSearchParams} />} />
          <Route path="/exhibition_viewer" element={<ExhibitionViewer />} />

          <Route path="/Account/*" element={<Account {
              ...{appUser, setAppUser, 
                snackbarOpen, snackbarText, snackbarSeverity,
                setSnackbarOpen, setSnackbarText, setSnackbarSeverity
              }
            } />} />

          <Route path="/login" element={<Login {...{appUser, setAppUser}} />} />
          
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
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      >
        <Alert severity={snackbarSeverity} variant="standard" sx={{width: "100%"}}>
          <Stack direction="row" spacing={2}>
            <Typography variant="body1">{snackbarText}</Typography>
          </Stack>
        </Alert>
      </Snackbar>

      </ThemeProvider>
  );
}

export default App;