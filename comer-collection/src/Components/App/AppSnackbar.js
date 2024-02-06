import { Snackbar, Alert, Stack, Typography } from "@mui/material";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { createContext } from 'react';


const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = useCallback((message, severity = "info") => {
    console.log("called showSnackbar");
    setSnackbarText(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, [setSnackbarOpen, setSnackbarSeverity, setSnackbarText]);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        onClose={() => {
          setSnackbarOpen(false);
        } }
      >
        <Alert severity={snackbarSeverity} variant="standard" sx={{ width: "100%" }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="body1">{snackbarText}</Typography>
          </Stack>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};


export const useSnackbar = () => {
  const showSnackbar = useContext(SnackbarContext);
  return showSnackbar;
};
