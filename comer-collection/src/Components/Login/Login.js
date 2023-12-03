import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { sendAuthenticatedRequest } from '../Users/Tools/HelperMethods/APICalls';
import { useAppUser } from '../App/AppUser';


const Login = () => {
  
  const [appUser, setAppUser] = useAppUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  const navigate = useNavigate();


  //Api call here
  const handleLogin = async (event) => {
    event.preventDefault();
    setButtonEnabled(false);
    const response = await sendAuthenticatedRequest("PUT", "/api/account/signin", {
      email, password
    });

    if(response.token) {
      // alert("Success");
      localStorage.setItem('token', response.token);

      try {
        const profileResponse = await sendAuthenticatedRequest("GET", "/api/account/profile")
        setAppUser(profileResponse.data);
        navigate('/Account');
      }
      catch(e) {
        setAppUser(null);
        localStorage.removeItem('token');
        setPassword("");
        setButtonEnabled(true);
        setError(true);
      }

      
    }
    else {
      setPassword("");
      setButtonEnabled(true);
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
                disabled={!(email && password && buttonEnabled)}
              >
                <Typography variant="body1">Log In</Typography>
              </Button>
            </Stack>
        </Box>
      </Box>
    );
}

export default Login;
