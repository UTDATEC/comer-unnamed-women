import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../Login/Login.js";
import NavBar from "../NavBar/NavBar.js";
import React, { useState } from "react";
import Account from "../Users/Account.js";

import { Box, ThemeProvider, createTheme } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors/index.js";
import { CollectionBrowser } from "../CollectionBrowser/CollectionBrowser.js";
import { ExhibitionPage } from "../ExhibitionPage/ExhibitionPage.js";
import { ExhibitionBrowser } from "../ExhibitionBrowser/ExhibitionBrowser.js";
import { SnackbarProvider } from "./AppSnackbar.js";
import { AppUserProvider } from "./AppUser.js";
import { TitleProvider } from "./AppTitle.js";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";


const App = () => {

    const [appDarkTheme, setAppDarkTheme] = useState(true);

    const primaryColor = green;
    const secondaryColor = orange;

    const cache = createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    });

    const theme = createTheme({
        typography: {
            fontFamily: [
                "Helvetica"
            ].join(","),
            fontSize: 12,
            body1: {
                fontWeight: 500,
                fontSize: "0.9rem"
            }
        },
        palette: {
            mode: appDarkTheme ? "dark" : "light",
            primary: {
                main: appDarkTheme ? primaryColor["700"] : primaryColor["900"],
                light: primaryColor["500"],
                contrastText: "white",
                "200": primaryColor["200"],
                "100": primaryColor["100"],
                translucent: `${primaryColor["700"]}40`,
                veryTranslucent: `${primaryColor["700"]}20`
            },
            secondary: {
                main: secondaryColor["700"],
                contrastText: "white",
                "200": secondaryColor["200"],
                "100": secondaryColor["100"],
                translucent: `${secondaryColor["700"]}40`,
                veryTranslucent: `${secondaryColor["700"]}20`
            },
            grey: {
                main: grey["600"],
                contrastText: "white",
                translucent: appDarkTheme ? grey["800"] : "#CCC",
                veryTranslucent: appDarkTheme ? "#333" : "#EEE",
            }
        }
    });



    return (
        <CacheProvider value={cache}>
            <HelmetProvider>
                <Helmet>
                    <meta httpEquiv='Content-Security-Policy' 
                        content={`default-src 'none'; script-src 'none'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${process.env.REACT_APP_API_HOST}; connect-src ${process.env.REACT_APP_API_HOST}`} />
                </Helmet>
            </HelmetProvider>
            <AppUserProvider>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Box sx={{
                            height: "100vh", 
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gridTemplateRows: "64px calc(100vh - 64px)",
                            gridTemplateAreas: `
            "header"
            "body"
          `
                        }}>
                            <NavBar {...{appDarkTheme, setAppDarkTheme}} sx={{ gridArea: "header" }} />
                            <Box sx={{ gridArea: "body", position: "relative" }} >

                                <TitleProvider>
                                    <SnackbarProvider >
                                        <Routes>
          
                                            <Route index element={<Navigate to="/login" />} />
          
                                            <Route path="/BrowseCollection" element={<CollectionBrowser isDialogMode={false} />} />
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
        </CacheProvider>
    );
};

export default App;