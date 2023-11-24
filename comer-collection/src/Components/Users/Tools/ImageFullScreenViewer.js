import { useTheme } from "@emotion/react"
import { Backdrop, Box, Stack } from "@mui/material"

export const ImageFullScreenViewer = ({ image, backdropOpen, setBackdropOpen }) => {
    const theme = useTheme();
    return (
        <Backdrop open={backdropOpen} sx={{opacity: 1, zIndex: (theme) => theme.zIndex.drawer + 1}} onClick={() => {
            setBackdropOpen(false);
        }}>
            <Stack direction="row">
                <Box>
                    <img src={image?.url ? image?.url : image?.thumbnailUrl} />
                </Box>
                <Box>
                    Information
                </Box>
            </Stack>
        </Backdrop>
    )
}