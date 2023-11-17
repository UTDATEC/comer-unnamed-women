import { Box, Button, Stack, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router'

const Unauthorized = (props) => {

    const navigate = useNavigate();

    const { message, buttonText, buttonDestination } = props;

    return (
        <Box sx={{width: '100%', height: '100%'}}>
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