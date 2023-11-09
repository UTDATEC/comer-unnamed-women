import './Login.css';
import { useState } from 'react';
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      error: '',
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  //Api call here
  handleLogin = (event) => {
    event.preventDefault();

    //Debug just to test if its passing correct arguments
    const { email, password } = this.state;
    alert(`Passed Email: ${email}\nPassed Password: ${password}`);
  };

  render() {
    return (
      <div>
        {/* todo: navbar when logged in */}
        <NavBar />
        <div className="separator" />
        <div className="loginForm">
          <form onSubmit={this.handleLogin}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required
            />

            <label>Password</label>
            <input
              style={{ marginBottom: '12px' }}
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
            <button id="centered" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
