import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import React, { createContext, useEffect, useState } from 'react';
import Account from '../Users/Account';

import { Box, ThemeProvider, createTheme } from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';
import { CollectionBrowser } from '../CollectionBrowser/CollectionBrowser';
import { ExhibitionPage } from '../ExhibitionPage/ExhibitionPage';
import { ExhibitionBrowser } from '../ExhibitionBrowser/ExhibitionBrowser';
import { SnackbarProvider } from './AppSnackbar';
import { AppUserProvider } from './AppUser';
import { TitleProvider } from './AppTitle';


const App = () => {

  const [appDarkTheme, setAppDarkTheme] = useState(true);

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
      mode: appDarkTheme ? "dark" : "light",
      primary: {
        main: appDarkTheme ? primaryColor['700'] : primaryColor['900'],
        light: primaryColor['500'],
        contrastText: 'white',
        "200": primaryColor['200'],
        "100": primaryColor['100'],
        translucent: `${primaryColor['700']}40`,
        veryTranslucent: `${primaryColor['700']}20`
      },
      secondary: {
        main: secondaryColor['700'],
        contrastText: 'white',
        "200": secondaryColor['200'],
        "100": secondaryColor['100'],
        translucent: `${secondaryColor['700']}40`,
        veryTranslucent: `${secondaryColor['700']}20`
      },
      grey: {
        main: grey['600'],
        contrastText: 'white',
        translucent: appDarkTheme ? grey['800'] : '#CCC',
        veryTranslucent: appDarkTheme ? '#333' : '#EEE',
      }
    }
  })



  return (
    <AppUserProvider>
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
        <NavBar {...{appDarkTheme, setAppDarkTheme}} sx={{ gridArea: 'header' }} />
        <Box sx={{ gridArea: 'body', position: 'relative' }} >

        <TitleProvider>
        <SnackbarProvider >
        <Routes>
          
          <Route index element={<Navigate to="/login" />} />
          
          <Route path="/BrowseCollection" element={<CollectionBrowser />} />
          <Route path="/Exhibitions" element={<ExhibitionBrowser />} />
          <Route path="/Exhibitions/:exhibitionId" element={<ExhibitionPage />} />

          <Route path="/Account/*" element={<Account />} />

          <Route path="/login" element={<Login />} />

              
          </Routes>
          </SnackbarProvider>

        </TitleProvider>
        </Box>
        </Box>
        
      </BrowserRouter>
      
      

      </ThemeProvider>
    </AppUserProvider>
  );
}

export default App;