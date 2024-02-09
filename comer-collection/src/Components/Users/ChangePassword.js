import { Navigate, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useAppUser } from '../App/AppUser';
import { useTitle } from '../App/AppTitle';

const ChangePassword = (props) => {
  
  const { selectedNavItem, setSelectedNavItem } = props;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState(false);

  const [appUser, setAppUser] = useAppUser();

  const navigate = useNavigate();
  const setTitleText = useTitle();


  //Api call here
  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put('http://localhost:9000/api/account/changepassword', { oldPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
  
      if(response.data.token) {
        localStorage.setItem('token', response.data.token);
  
        const profileResponse = await fetch("http://localhost:9000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        })
        if(profileResponse.status == 200) {
          let profileResponseJson = await profileResponse.json();
          setAppUser(profileResponseJson.data);
          navigate('/Account');
        }
        else {
          throw new Error("Could not retrieve user profile after password change");
        }
  
        
      }
      else {
        throw new Error("Password change request did not get a token in the response");
      }
    } catch(err) {
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setError(true);
    }
    
  };

  useEffect(() => {
    setSelectedNavItem("Change Password")
    setTitleText("Change Password")
  });

    return (
      <Box component={Paper} square sx={{height: "100%"}}>
      <Box component="form" sx={{height: "100%"}} onSubmit={handleChangePassword}>
          <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" 
            sx={{width: "100%", height: "100%"}}>
              {appUser.password_change_required && (
                <>
                  <Typography variant="h5">Please change your password.</Typography>
                  <Divider />
                </>
              )}
            <TextField sx={{minWidth: "400px"}} autoFocus
              error={Boolean(error)}
              label="Old Password"
              type="password"
              name="password"
              value={oldPassword}
              onChange={(event) => {
                setOldPassword(event.target.value);
                setError(false);
              }}
              required
            />
            <Divider />
            <TextField sx={{minWidth: "400px"}}
              error={Boolean(error)}
              label="New Password"
              type="password"
              name="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError(false);
              }}
              required
            />
            <TextField sx={{minWidth: "400px"}}
              error={Boolean(error)}
              label="Confirm New Password"
              type="password"
              name="password"
              value={newPasswordConfirm}
              onChange={(event) => {
                setNewPasswordConfirm(event.target.value);
                setError(false);
              }}
              required
            />
            <Divider />
            <Button type="submit" 
              variant="contained" 
              sx={{minWidth: "400px"}} 
              disabled={!(oldPassword && newPassword && newPassword == newPasswordConfirm)}
            >
              <Typography variant="body1">Change Password</Typography>
            </Button>
            {!appUser.password_change_required && (<Button onClick={() => {
              navigate('/Account/Profile')
            }} 
              variant="outlined" 
              sx={{minWidth: "400px"}} 
            >
              <Typography variant="body1">Return to Profile</Typography>
            </Button>)}
          </Stack>
      </Box>
      </Box>
    );
}

export default ChangePassword;
