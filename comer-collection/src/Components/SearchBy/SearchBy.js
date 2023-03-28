import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { View } from 'react-native';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
//import './DataInputForm.css';
import Grid from '@material-ui/core/Grid'
import { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import NavBar from "../NavBar/NavBar";

function errorMessage()
{
  alert('Searching...')
}

class SearchBy extends Component {
  push = () => {
    this.props.history.push("/searchpage");
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      artist: '',
      tags: '',
      inscriptions: '',
      medium: '',
      dimensions: '',
      accessionNumber: '',
      copyright: '',
      subject: '',
      collectionLocation: '',
      dateCreated: '',
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleClick = this.handleClick.bind(this);
  }

handleChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

handleSubmit(event) {
  event.preventDefault();
  this.props.paramSetter({ 
    title: this.state.title,
    artist: this.state.artist,
    medium: this.state.medium,
    inscriptions: this.state.inscriptions,
    dateCreated: this.state.dateCreated,
    subject: this.state.subject,
    collectionLocation: this.state.collectionLocation,
    accessionNumber: this.state.accessionNumber,
    dimensions: this.state.dimensions,
    copyright: this.state.copyright,
    tags: this.state.tags
   } )
  this.push()
}




  render() {
    return (
    <div className="App">
        {/*<div>
        <AppBar position="fixed" className= "abRoot" style = {{background : "#e87500"}}>
          <Toolbar>
            <IconButton edge="start" className="menuButton" color= "inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className="title">
              Search By Page
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>*/}
        <NavBar />
      <div className="dataInputForm">
   <form onSubmit={this.handleSubmit}>
     <Grid container spacing={3}>
     <Grid item xs={5} sm={5}>
     <label>Title</label>
     <input 
       type="text" 
       name="title"
       value={this.state.value} 
       onChange={this.handleChange}
     />
     </Grid>
     <Grid item xs={5} sm={5}>
     <label>Artist</label>
     <input 
       type="text" 
       name="artist"
       value={this.state.value} 
       onChange={this.handleChange}
        
     />
     </Grid>
      <Grid item xs={5} sm={5}>
      <label>Inscriptions</label>
      <input 
       type="text" 
       name="inscriptions"
       value={this.state.value} 
       onChange={this.handleChange}
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Tags</label>
      <input 
        type="text" 
        name="tags"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Date</label>
      <input 
        type="text" 
        name="dateCreated"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Medium</label>
      <input 
        type="text" 
        name="medium"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Dimensions</label>
      <input 
        type="text" 
        name="dimensions"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Accession Number</label>
      <input 
        type="text" 
        name="accessionNumber"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Copyright</label>
      <input 
        type="text" 
        name="copyright"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Subject</label>
      <input 
        type="text" 
        name="subject"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Collection Location</label>
      <input 
        type="text" 
        name="collectionLocation"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
     </Grid>
     <button> Submit</button>
   </form>
  </div>
     </div>
  );
    }
}


export default withRouter(SearchBy);
