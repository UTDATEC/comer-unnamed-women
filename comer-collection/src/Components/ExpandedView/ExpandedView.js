import './ExpandedView.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from '../NavBar/NavBar'
import logo from './utd.svg';

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

function ExpandedView(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
  <div className="App">
    {/*<AppBar position="fixed" classes={{ root: classes.abRoot}}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Search Results Page
        </Typography>
        <Button class = "myButton" onClick={() => history.goBack()}>Go Back</Button>
      </Toolbar>
    </AppBar> */}
    <NavBar />
    <Container>
    <Col>
      <Row>
      <div className="align-center">
        <img className="img" src={`http://localhost:9000/images/${props.selectedImage.fileName}`} />
      </div>
      </Row>
      <Row>
        <div className = "demo">
          <span><b> Title: </b> <i>{props.selectedImage.title}</i> </span>
          <span><b> Artist: </b> <i>{props.selectedImage.artist}</i> </span>
          <span><b> Medium: </b> <i>{props.selectedImage.medium}</i> </span>
        </div>
      </Row>
      <Row>
      <div className = "demo">
          <span><b> Tags: </b> <i>{props.selectedImage.tags}</i> </span>
          <span><b> Inscriptions: </b> <i>{props.selectedImage.inscriptions}</i> </span>
          <span><b> Copyrights Holder: </b> <i>{props.selectedImage.copyright}</i> </span>
        </div>
      </Row>
    </Col>
    </Container>




    <div className="align-right">
      <button className = "myButton" style={{width:300}}>
        ADD TO AN EXHIBITION
      </button>

      <button className = "myButton"  style={{width:300}}>
        EDIT TAGS
      </button>
    </div>
</div>
);
}

export default ExpandedView;
