import { Navigate, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { sendAuthenticatedRequest } from '../Users/Tools/HelperMethods/APICalls';
import { useAppUser } from '../App/AppUser';
import { useTitle } from '../App/AppTitle';


const Login = () => {
  
  const [appUser, setAppUser] = useAppUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [formEnabled, setFormEnabled] = useState(true);

  const navigate = useNavigate();
  const setTitleText = useTitle();

  const handleLogin = async (event) => {
    event.preventDefault();
    setFormEnabled(false);

    try {
      const response = await sendAuthenticatedRequest("PUT", "/api/public/signin", {
        email, password
      });
  
      if(response.token) {
        localStorage.setItem('token', response.token);
        const profileResponse = await sendAuthenticatedRequest("GET", "/api/user/profile")
        setAppUser(profileResponse.data);
        navigate('/Account');
      }
    }
    catch(e) {
      setAppUser(null);
      localStorage.removeItem('token');
      setPassword("");
      setFormEnabled(true);
      setError(true);
    }

    
  };

  useEffect(() => {
    setTitleText("Log In")
  })

    return appUser && (
        <Navigate to="/Account" />
      ) || !appUser && (
      <Box component={Paper} square sx={{height: "100%"}}>
        <Box component="form" sx={{height: "100%"}} onSubmit={handleLogin}>
            <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" 
              sx={{width: "100%", height: "100%"}}>
              <TextField sx={{minWidth: "400px"}} autoFocus
                error={Boolean(error)}
                disabled={!formEnabled}
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
                disabled={!formEnabled}
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
                disabled={!(email && password && formEnabled)}
              >
                <Typography variant="body1">Log In</Typography>
              </Button>
            </Stack>
        </Box>
      </Box>
    );
}

export default Login;
