import './Login.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from '../NavBar/NavBar';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
// import '../App/App.css';
// import '../SearchBy/DataInputForm.css';

export default class Login extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div class="separator" />
        <div class="loginForm">
          <form>
            <label>Email</label>
            <input
              type="text"
              name="email"
              // value={this.state.value}
              // onChange={this.handleChange}
              // required
            />

            <label>Password</label>
            <input
              type="text"
              name="password"
              // value={this.state.value}
              // onChange={this.handleChange}
              // required
            />
            
            <button id="centered">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}