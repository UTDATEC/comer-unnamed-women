import {Card, Container, ImageList, ImageListItem, ImageListItemBar} from '@mui/material'
import {useValue} from '../../context/ContextProvider'

const Tiles = () => {
    const {state:{tileData}} = useValue()
    return (
        <Container>
            <ImageList
                gap={12}
                sx = {{mb:8,}}
            >
                {
                    tileData.map(item=>(
                        <Card key={item._id}>
                            <ImageListItem sx={{height:'100% !important'}}>
                                <img
                                src={item.images[0]}
                                alt={item.title}
                                loading='lazy'
                                />
                                <ImageListItemBar
                                    title={item.title}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${item.title}`} className={classes.icon} onClick={() => handleClick(item)}>
                                            <InfoIcon />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </Card>
                    ))
                }
            </ImageList>
        </Container>
    )
}