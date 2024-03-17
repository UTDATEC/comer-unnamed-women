import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { LockIcon } from '../IconImports';
import { useNavigate } from 'react-router'
import { useTheme } from '@emotion/react';

const Unauthorized = (props) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const { message, buttonText, buttonDestination, customIcon } = props;
    const Icon = customIcon ?? LockIcon;

    return (
        <Box component={Paper} square sx={{width: '100%', height: '100%'}}>
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                <Icon sx={{fontSize: '150pt', opacity: 0.5}} />
                <Typography variant="h4">{message ?? "Unauthorized"}</Typography>
                {(buttonDestination || buttonText) && (
                    <Button variant="contained" onClick={() => navigate(buttonDestination ?? '/login')}>
                        <Typography variant="body1">{buttonText ?? "Return to Login Page"}</Typography>
                    </Button>
                )}
            </Stack>
        </Box>
    )
}


export default Unauthorized;