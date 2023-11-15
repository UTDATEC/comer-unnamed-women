import { useNavigate } from 'react-router';
import './Login.css';
import { useState } from 'react';

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

const Login = (props) => {
  
  const { user, setUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  //Api call here
  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await loginUser(email, password);

    if(response.token) {
      // alert("Success");
      localStorage.setItem('token', response.token);

      const profileResponse = await fetch("http://localhost:9000/api/account/profile", {
        headers: {
          Authorization: `Bearer ${response.token}`
        }
      })
      if(profileResponse.status == 200) {
        let profileResponseJson = await profileResponse.json();
        setUser(profileResponseJson.data);
        navigate('/Admin');
      }
      else {
        setUser(null);
        localStorage.removeItem('token');
      }

      
    }
    else {
      alert("Error - no token detected")
    }
    
  };

    return (
      <div>
        <div className="separator" />
        <div className="loginForm">
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />

            <label>Password</label>
            <input
              style={{ marginBottom: '12px' }}
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
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

export default Login;
