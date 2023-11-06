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

  // async function LoginUser()


  //disable javascript.validate in vsc settings?
  // [email, setEmail] = useState();
  // [password, setPassword] = useState();

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
  
    this.setState({
      [name]: value
    });
  }

  handleLogin(event) {
    event.preventDefault();
    //todo
    alert(email);

    // const response = await LoginUser({
    //   email,
    //   password
    // });


  }

  render() {
    return (
      <div>
        <NavBar />
        <div class="separator" />
        <div class="loginForm">
          <form onSubmit={this.handleLogin}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={this.state.value}
              onChange={this.handleChange}
              required
            />

            <label>Password</label>
            <input style={{marginBottom: "11px"}}
              type="text"
              name="password"
              value={this.state.value}
              onChange={this.handleChange}
              required
            />
            <button id="centered">Login</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
