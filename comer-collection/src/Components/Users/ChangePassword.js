import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAppUser } from "../App/AppUser";
import { useTitle } from "../App/AppTitle";
import { useSnackbar } from "../App/AppSnackbar";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls";
import { useAccountNav } from "./Account";

const ChangePassword = () => {
  
    const [, setSelectedNavItem] = useAccountNav();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const [appUser, , initializeAppUser] = useAppUser();

    const showSnackbar = useSnackbar();
  
    const navigate = useNavigate();
    const setTitleText = useTitle();


    //Api call here
    const handleChangePassword = async (event) => {
        event.preventDefault();
        setSubmitEnabled(false);

        try {
            const response = await sendAuthenticatedRequest("PUT", "/api/user/changepassword", { oldPassword, newPassword });
  
            if(response.token) {
                localStorage.setItem("token", response.token);
  
                await initializeAppUser();
                navigate("/Account");
                showSnackbar("Password changed", "success");
        
            }
            else {
                throw new Error("Password change request did not get a token in the response");
            }
        } catch(err) {
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setError(true);
            setSubmitEnabled(true);
        }
    
    };

    useEffect(() => {
        setSelectedNavItem("Change Password");
        setTitleText("Change Password");
    });

    return (
        <Box component={Paper} square sx={{height: "100%"}}>
            <Box component="form" sx={{height: "100%"}} onSubmit={handleChangePassword}>
                <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" 
                    sx={{width: "100%", height: "100%"}}>
                    {appUser.pw_change_required && (
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
                        disabled={!(submitEnabled && oldPassword && newPassword && newPassword == newPasswordConfirm)}
                    >
                        <Typography variant="body1">Change Password</Typography>
                    </Button>
                    {!appUser.pw_change_required && (<Button disabled={!submitEnabled} onClick={() => {
                        navigate("/Account/Profile");
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
};

export default ChangePassword;
