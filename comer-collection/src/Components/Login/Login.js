import './Login.css';
import { Component } from 'react';

async function loginUser(email, password) {
  const response = await fetch('http://localhost:9000/api/account/signin', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  return response.json();
}

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
  handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const response = await loginUser(email, password);

    if(response.token) {
      alert("Success");
      localStorage.setItem('token', response.token);
    }
    else {
      alert("Error - no token detected")
    }
    
  };

  render() {
    return (
      <div>
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
