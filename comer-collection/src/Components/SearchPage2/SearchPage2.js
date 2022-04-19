import logo from './logo.svg';
//import logo from './logo.png';
import './SearchPage2.css';
//import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
//.Logo {
 // background-image: url(./logo.png);
//}
//import {  TextField, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { ReactComponent as Logo } from './utd.svg';
import { ReactComponent as DashboardIcon } from './utd.svg';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  abRoot: {
  backgroundColor: '#e87500',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const btn = document.getElementById('btn');

function errorMessage()
{
  alert('Error')
  //btn.style.backgroundColor = 'salmon';
  //btn.style.color = 'white';
}




function SearchPage2() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className="App">
      <AppBar position="fixed" classes={{ root: classes.abRoot}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Search Results Page
          </Typography>
          <Button class = "myButton" onClick={() => history.goBack()}>Go Back</Button>
        </Toolbar>
      </AppBar>




     <a class="align-search">
       <text>
         <br></br> <br></br> <br></br> <br></br>
       </text>
      <TextField
      id="filled-basic"
  variant="filled"
  margin="normal"
  label="Terms that were searched"
  style={{width:750}}
  InputProps={{
    endAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>


    )

  }}


/>
</a>




<a class="align-left">
<text>
         <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
       </text>
    <ul className="nav-links">
    <li>
      <div className="divHover">
        <a href="#">
          <DashboardIcon className="navLinkHolder" height={500} style={{width:900}} />
          <div class="container">Title: Sarah in the Jungle</div>
          <div class="container">Artist: Stephanie Joseph</div>
        </a>
      </div>
    </li>
  </ul>

  </a>


<a class="align-right">
<text>
<br></br> <br></br> <br></br> <br></br><br></br> <br></br> <br></br> <br></br><br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
       </text>
  <button class = "myButton" onClick = {errorMessage} style={{width:300}}>
        ADD TO AN EXHIBITION
      </button>


<text>
         <br></br> <br></br> <br></br> <br></br>
       </text>
      <button class = "myButton" onClick = {errorMessage} style={{width:300}}>
        EDIT TAGS
      </button>




      <text>
          <br></br> <br></br> <br></br> <br></br>
       </text>
      <button class = "myButton" onClick = {errorMessage} style={{width:300}}>
        GET JSON OBJECT
      </button>
      </a>




    </div>



  );
}

export default SearchPage2;
