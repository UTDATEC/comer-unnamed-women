import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Box, ImageListItem, ListSubheader, Toolbar } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Button, GridList, GridListTile, GridListTileBar, IconButton, ImageList, makeStyles } from '@material-ui/core';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'
import dataCard from './dataCard';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import './server'
import { makeServer } from './server';


export default function Cards() {
    var json_var = require('./dataCard.json')
    console.log(json_var[0].title1)

    return (
        <div className="parent_container">
          <div className="child_container_1">
                  <ImageList justifyContent="center" lg={{width: 150, height:150}} md={{width: 150, height: 150}} cols={4} rowHeight={240} gap={8}>
                      {dataCard.map((data) => (
                          <ImageListItem justifyContent="center" key={data.img}>
                              <Paper elevation={10}>
                                  <img className="pictureTest" src={data.img} alt={data.img} />
                              </Paper>
                          </ImageListItem>
                      ))}
                  </ImageList>
              </div>
              <div className="child_container">
                  <Box 
                  component="form" 
                  noValidate>
                      <TextField id="outlined-basic" label="Description" variant="outlined" size="large" multiline rows={15} style = {{ width: 250}}/>
                  </Box>
              </div>
              <div className="addImg">
              <Button 
              variant="contained"
              size="large"
              backgroundColor="#e87500"
              >BUTTON</Button>
              </div>
              <div className="bottomText">
              <Box 
                  component="form" 
                  noValidate>
                      <TextField id="outlined-basic" label="Description" variant="outlined" size="large" fullWidth/>
                  </Box>
              </div>
              <div className="bottomButtons">
              <Button 
              variant="contained"
              size="large"
              backgroundColor="#e87500"
              >SAVE</Button>
              <div className="space"></div>
              <Button 
              variant="contained"
              size="large"
              backgroundColor="#e87500"
              >PUBLISH</Button>
              </div>
          </div>
   )
  
  
}


/*

return (
      <div className="parent_container">
        <div className="child_container_1">
                <ImageList justifyContent="center" lg={{width: 150, height:150}} md={{width: 150, height: 150}} cols={4} rowHeight={240} gap={8}>
                    {dataCard.map((data) => (
                        <ImageListItem justifyContent="center" key={data.img}>
                            <Paper elevation={10}>
                                <img className="pictureTest" src={data.img} alt={data.img} />
                            </Paper>
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <div className="child_container">
                <Box 
                component="form" 
                noValidate>
                    <TextField id="outlined-basic" label="Description" variant="outlined" size="large" multiline rows={15} style = {{ width: 250}}/>
                </Box>
            </div>
            <div className="addImg">
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >BUTTON</Button>
            </div>
            <div className="bottomText">
            <Box 
                component="form" 
                noValidate>
                    <TextField id="outlined-basic" label="Description" variant="outlined" size="large" fullWidth/>
                </Box>
            </div>
            <div className="bottomButtons">
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >SAVE</Button>
            <div className="space"></div>
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >PUBLISH</Button>
            </div>
        </div>
 )

*/


/*
return (
      <div className="parent_container">
        <div className="child_container_1">
                <ImageList justifyContent="center" lg={{width: 150, height:150}} md={{width: 150, height: 150}} cols={4} rowHeight={240} gap={8}>
                    {json_var.map((data) => (
                        <ImageListItem justifyContent="center" key={data.title}>
                            <Paper elevation={10}>
                                <h3>{data.title} </h3>
                            </Paper>
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <div className="child_container">
                <Box 
                component="form" 
                noValidate>
                    <TextField id="outlined-basic" label="Description" variant="outlined" size="large" multiline rows={15} style = {{ width: 250}}/>
                </Box>
            </div>
            <div className="addImg">
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >BUTTON</Button>
            </div>
            <div className="bottomText">
            <Box 
                component="form" 
                noValidate>
                    <TextField id="outlined-basic" label="Description" variant="outlined" size="large" fullWidth/>
                </Box>
            </div>
            <div className="bottomButtons">
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >SAVE</Button>
            <div className="space"></div>
            <Button 
            variant="contained"
            size="large"
            backgroundColor="#e87500"
            >PUBLISH</Button>
            </div>
        </div>
 )

*/