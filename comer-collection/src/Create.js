import React from 'react'
import App from './App.css'
import Typography from '@material-ui/core/Typography'
import AppBar from '@mui/material/AppBar'
import { Box, Toolbar } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, makeStyles } from '@material-ui/core';

const primaryStyle = makeStyles((theme) => ({
    
}))

export default function Create() {
  return (
      <>
        <div className="currentImg">
            <h2>Current Selected Images:</h2>
        </div>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="absolute" style={{ background: "#e87500" }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography id="exhibition" variant="h6" component="div" sx={{ flexGrow: 4 }}>
            Exhibition
        </Typography>
        <Button id="headerButton" color="inherit">Login</Button>
      </Toolbar>

    </AppBar>
  </Box>
  </>

  )
}
