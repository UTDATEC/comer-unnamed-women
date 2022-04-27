import React from 'react'
import TextField from '@mui/material/TextField';
import { Box, Toolbar } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
    input1: {
      height: 50
    }
  }));

export default function XfieldBox() {
    const classes = useStyles();

  return (
    <Box 
    className="boxTest" 
    component="form" 
    noValidate>
        <TextField id="outlined-basic" label="Description" variant="outlined" size="large" multiline rows={15}/>
    </Box>
  )
}


