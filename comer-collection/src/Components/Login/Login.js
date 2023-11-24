import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';

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
  
  const { appUser, setAppUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();


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
        setAppUser(profileResponseJson.data);
        navigate('/Account');
      }
      else {
        setAppUser(null);
        localStorage.removeItem('token');
        setPassword("");
        setError(true);
      }

      
    }
    else {
      setPassword("");
      setError(true);
    }
    
  };

    return appUser && (
        <Navigate to="/Account" />
      ) || !appUser && (
      <Box component={Paper} square sx={{height: "100%"}}>
        <Box component="form" sx={{height: "100%"}} onSubmit={handleLogin}>
            <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" 
              sx={{width: "100%", height: "100%"}}>
              <TextField sx={{minWidth: "400px"}} autoFocus
                error={Boolean(error)}
                label="Email"
                type="text"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(false);
                }}
                required
              />
              <TextField sx={{minWidth: "400px"}}
                error={Boolean(error)}
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(false);
                }}
                required
              />
              <Divider />
              <Button type="submit" 
                variant="contained" 
                sx={{minWidth: "400px"}} 
                disabled={!(email && password)}
              >
                <Typography variant="body1">Log In</Typography>
              </Button>
            </Stack>
        </Box>
      </Box>
    );
}

export default Login;
