import { Box, Stack, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

const Unauthorized = (props) => {

    return (
        <Box sx={{width: '100%', height: '100%', opacity: 0.5}}>
            <Stack direction="column" alignItems="center" justifyContent="center" sx={{height: '100%'}}>
                <LockIcon sx={{fontSize: '150pt'}} />
                <Typography variant="h4">Unauthorized</Typography>
            </Stack>
        </Box>
    )
}


export default Unauthorized;