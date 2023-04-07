// File Created 3/24/2023 by Gabriela Saenz
import './Exhibit.css';
import { View } from 'react-native';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
import NavBar from '../NavBar/NavBar'

function errorMessage()
{
  alert('Searching...')
}

class ExhibitMain extends Component {
  push = () => {
    this.props.history.push("/exhibitmain");
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      //artist: '',
      //tags: '',
      //inscriptions: '',
      //medium: '',
      //dimensions: '',
      //accessionNumber: '',
      //copyright: '',
      //subject: '',
      //collectionLocation: '',
      //dateCreated: '',
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
    description: this.state.description,
    //artist: this.state.artist,
    //medium: this.state.medium,
    //inscriptions: this.state.inscriptions,
    //dateCreated: this.state.dateCreated,
    //subject: this.state.subject,
    //collectionLocation: this.state.collectionLocation,
    //accessionNumber: this.state.accessionNumber,
    //dimensions: this.state.dimensions,
    //copyright: this.state.copyright,
    //tags: this.state.tags
   } )
  this.push()
}


  

  render() {
    return (
    <div className="Exhibit">
      <NavBar />
      <div className="dataInputForm">
        <form onSubmit={this.handleSubmit}>
        <Grid container spacing={3}>
        <Grid item xs={5} sm={5}>
        <label>Exhibit Title</label>
        <input 
          type="text" 
          name="title"
          value={this.state.value} 
          onChange={this.handleChange}
        />
        </Grid>
     
        <Grid item xs={5} sm={5}>
        <label>Description</label>
        <input 
          type="text" 
          name="description"
          value={this.state.value} 
          onChange={this.handleChange}
            
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Current Exhibits</label>
        <output 
          type="text" 
          name="title"
          value={this.state.value} 
          onChange={this.handleChange}
        />
        </Grid>
        </Grid>
     
      
      
        <button>+ Create New Exhibit</button>
        </form>
      </div>
    </div>
  );
    }
}

export default withRouter(ExhibitMain);