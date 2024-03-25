import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

const Unauthorized = ({ message, buttonText, buttonDestination, Icon }) => {

    const navigate = useNavigate();

    return (
        <Box component={Paper} square sx={{width: "100%", height: "100%"}}>
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: "100%"}}>
                <Icon sx={{fontSize: "150pt", opacity: 0.5}} />
                <Typography variant="h4">{message}</Typography>
                {(buttonDestination || buttonText) && (
                    <Button variant="contained" onClick={() => navigate(buttonDestination ?? "/login")}>
                        <Typography variant="body1">{buttonText ?? "Return to Login Page"}</Typography>
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

Unauthorized.propTypes = {
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    buttonDestination: PropTypes.string,
    Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};


export default Unauthorized;