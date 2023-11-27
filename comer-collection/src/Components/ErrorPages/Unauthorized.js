import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router'
import { useTheme } from '@emotion/react';

const Unauthorized = (props) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const { message, buttonText, buttonDestination } = props;

    return (
        <Box component={Paper} square sx={{width: '100%', height: '100%'}}>
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                <LockIcon sx={{fontSize: '150pt', opacity: 0.5}} />
                <Typography variant="h4">{message ?? "Unauthorized"}</Typography>
                <Button variant="contained" onClick={() => navigate(buttonDestination ?? '/')}>
                    <Typography variant="body1">{buttonText ?? "Return to Homepage"}</Typography>
                </Button>
            </Stack>
        </Box>
    )
}


export default Unauthorized;