import './App.css';
import { View } from 'react-native';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
  input1: {
    height: 50
  },
}));

function errorMessage()
{
  alert('Searching...')
}

function SearchBy() {
  const classes = useStyles();
  const history = useHistory();

  return (


    <div className="App">
      <AppBar position="fixed" classes={{ root: classes.abRoot}}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color= "inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Search By Page
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>


      <a class="align1">
      <text>
      <br /><br /><br /><br /><br /><br />Title<br />
      </text>
      <TextField id="filled-basic" label="Title" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      <text>
      <br /><br />Artist<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Artist" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Tags<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Tags" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Inscriptions<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Inscriptions" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Date Created<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Date Created" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      </a>
      <a class="align2">
      <text>
      <br /><br /><br /><br /><br /><br />Medium<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Medium" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br />Dimensions<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Dimensions" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Accession Number<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Accession Number" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Copyright<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Copyright" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      <text>
      <br /><br />Subject<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Subject" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      </a>
      <a className = "align3">
      <text>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />Collection Location<br />
      </text>
      <div>
      <TextField id="filled-basic" label="Collection Location" variant="filled" margin="normal" style = {{width: 500}} InputProps={{ classes: { input: classes.input1 } }}/>
      </div>
      </a>
      <a className = "align4">
      <text>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </text>
      <button class = "myButton" onClick={() => history.push('/searchpage')}>
        Search
      </button>
      <text>
        <br /><br /><br /><br /><br /><br />
      </text>
      </a>

    </div>
  );
}

export default SearchBy;
