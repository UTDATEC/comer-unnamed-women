// File Created 3/24/2023 by Gabriela Saenz
import './Exhibit.css';
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import NavBar from '../NavBar/NavBar'
import ExhibitCard from './ExhibitCard'
import logo from '../GridView/utd.jpg';
import exhibitData from './exhibitData';


export default function ExhibitMain(props){
  const INITIAL_STATE = {
    img: logo,
    title: '',
  };

  const [form, setForm] = React.useState({
    INITIAL_STATE
  });
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    let newItem = {img: logo,  title: form.title}
    exhibitData.push(newItem);
    setForm(INITIAL_STATE);
  };
  return (
    <div>
      <NavBar />
      <div>
        <h2></h2>
      </div>
      <ExhibitCard appProps={props}/>
      <div className="dataInputForm">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={5} sm={5}>
              <label>Exhibit Title</label>
              <input 
                type="text" 
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </Grid>
            <button className = "myButton" type="submit">+ Create New Exhibit</button>
          </Grid>
          
        </form>
      </div>
    </div>
  );
}
