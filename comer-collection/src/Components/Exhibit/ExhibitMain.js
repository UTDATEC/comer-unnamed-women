// File Created 3/24/2023 by Gabriela Saenz
import './Exhibit.css';
import * as React from 'react';
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
import ExhibitCard from './ExhibitCard'
import logo from '../SearchPage/utd.jpg';
import exhibitData from './exhibitData';

/*
function errorMessage()
{
  alert('Searching...')
}
*/

//class ExhibitMain extends Component {
  /*
  push = () => {
    this.props.history.push("/exhibitmain");
  };

  constructor(props) {
    super(props);
    this.state = {
      img: logo,
      title: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleClick = this.handleClick.bind(this);
    //INITIAL_STATE = this.INITIAL_STATE.bind(this);
    //this.exhibitForm = this.exhibitForm.bind(this);

  }
  */

  
/*
  const exhibitForm = () => {
    const [exhibitData, setForm] = React.useState(INITIAL_STATE);
    const handleChange = (event) => {
      setForm({
        ...exhibitData,
        [event.target.id]: event.target.value,
      });
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      setForm(INITIAL_STATE);
      
    };
    return alert('Entered Value is: '+ exhibitData.title);

  };
*/

  /*
handleChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}*/

/*
const handleChange = (event) => {
  setForm({
    ...form,
    [event.target.id]: event.target.value,
  });
}

const handleSubmit = (event) => {
  event.preventDefault();
  return alert('Entered Value is: '+ form.title)
}
*/

/*
handleSubmit(event) {
  event.preventDefault();
  this.props.paramSetter({ 
    img: logo,
    title: this.state.title,
    //description: this.state.description,
   } )
  this.push()
  return alert('Entered Value is: '+ this.title)
}
*/

//}
  //render(props) {
export default function ExhibitMain(props){
  /*
  const push = () => {
    props.history.push("/exhibitmain");
  };
  */
  const INITIAL_STATE = {
    img: logo,
    title: '',
  };

  const [form, setForm] = React.useState({
    //img: logo,
    //title: '',
    INITIAL_STATE
  });
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    let newItem = {img: logo,  title: form.title}
    exhibitData.push(newItem);
    return alert('Entered Value is: '+ form.title)
    //setForm(INITIAL_STATE);
    //push();
  }
  return (
    <div>
      <NavBar />
      <ExhibitCard appProps={props}/>
      <div className="dataInputForm">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={5} sm={5}>
              <label>Exhibit Title</label>
              <input 
                type="text" 
                name="title"
                //value={this.state.value} 
                value={form.title}
                //onChange={this.handleChange}
                onChange={handleChange}
              />
            </Grid>
      
        {/*
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
          
        */}
      
            <button type="submit">+ Create New Exhibit</button>
          </Grid>
          
        </form>
      </div>
    </div>
  );
}
//}

//export default withRouter(ExhibitMain);