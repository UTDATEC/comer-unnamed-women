import './Login.css';
import NavBar from '../NavBar/NavBar';
import { Component } from 'react';

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

export default Login;
