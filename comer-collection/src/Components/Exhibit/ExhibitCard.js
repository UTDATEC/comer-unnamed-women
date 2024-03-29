import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import exhibitData from './exhibitData';
import ListSubHeader from '@material-ui/core/ListSubheader';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import logo from '../GridView/utd.jpg';

// This file displays the existing exhibits from the database

const useStyles = makeStyles((theme) => ({
    root: {
        //styles for div
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        //overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        //boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    },
    imageList: {
        //styles for ImageList
        width: '1000px',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    shadow: {
        //Styles for ImageList shadows
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #ccc',
    },
    titleBar: {
        //styles for title of exhibit
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0000) 100%',
    },
    icon: {
        //styles for ImageListItemBar
        color: 'rgba(255, 255, 0.54)'
    },
    button: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        '&:hover': {
        backgroundColor: 'lightgray',
        opacity: 0
        },
    }
}));


export default function ExhibitCard(){
    const classes = useStyles();
    const history = useHistory();

    const INITIAL_STATE = {
        img: logo,
        title: '',
    };

    const [form, setForm] = React.useState({
        INITIAL_STATE
    });

    const handleChange = (event) => {
        setForm({
          ...form,
          [event.target.name]: event.target.value,
        });
      };

      /*
    const handleDelete = (item) => {
        //props.appProps.setSelectedImage(image) //no props
        //history.push("/searchpage2")
        //event.preventDefault();
        //let deleteItem = {img: logo, title: "Delete"}
        let deleteItem = item
        //exhibitData.filter(deleteItem);
        exhibitData.delete(item)
        alert("Deleting "+ item.title+"?");
        setForm(form => {
            INITIAL_STATE
        })
    }
    */

    /* if clicked, exhibits go to expanded view, however this exhibit expanded view has yet to be implemented */
    function handleClick(image){
        history.push("/ExpandedView")
    }

    return (
        <div>
            <div style={{ height: '70px' }}/>
            <div className={classes.root}>
                <ImageList cols={4} gap={15} className={classes.imageList}>
                    {/*this ILItem adds space between the images and the navigation bar*/}
                    <ImageListItem key="Subheader" cols={4} style={{ height: 10 }}>
                        <ListSubHeader component="div"></ListSubHeader>
                    </ImageListItem>
                    {exhibitData.map((item) => (
                        /*this ILItem specifies attributes for the exhibits that will be displayed*/  
                            <ImageListItem key={item.name} className={classes.shadow} style={{marginBottom: 10}}>                   
                                <img 
                                    src={logo}
                                    alt={item.name}
                                    loading="lazy"
                                />
                                
                                <button onClick={() => handleClick(item)} className = {classes.button}>
                                    <ImageListItemBar title={item.name}/>   
                                </button>
                                
                            </ImageListItem>
                        
                    ))}
                </ImageList>
            </div>
            {/*adds space after images*/}
            <div style={{ width: '100%', height: '80px' }} />
        </div>
    );


}

{/*actionIcon={
                                    <IconButton 
                                        sx={{ color: 'white' }} 
                                        //aria-label={`star ${item.title}`} 
                                        onClick={() => {
                                            const confirmBox = window.confirm("Would you like to delete "+item.title+"?")
                                            if(confirmBox === true){
                                                handleDelete(item)
                                            }                           
                                        }}
                                    >
                                        /*<StarBorderIcon />*/
                                        
                                      /* <DeleteIcon />
                                    </IconButton>
                                }*/}