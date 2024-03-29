import './ExpandedView.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from '../NavBar/NavBar'

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
  const data = history.location.state.data

  return (
<div className="App">
    <NavBar />
    <Container>
    <Col>
      <Row>
        <div className="align-center">
          {/*<img className="img" src={`http://localhost:9000/images/${props.selectedImage.fileName}`} />*/}
          <img className="img" src={data.img} />
        </div>
      </Row>
      <Row>
        <div className = "bigText">
          <span>Title:  <i>{JSON.stringify(data.title)}</i> </span>
          <span>Year:  <i>{JSON.stringify(data.year)}</i> </span>
        </div>
      </Row>
      <Row>
        <div className="medText">
          <span> Artist: <i>{JSON.stringify(data.artist)}</i> </span>
          <span> Medium: <i>{JSON.stringify(data.medium)}</i> </span>

        </div>
      </Row>
      <Row>
        <div className = "demo">
          <ul><span><b> Title: </b> <i>{JSON.stringify(data.title)}</i> </span></ul>
          <ul><span><b> Artist: </b> <i>{JSON.stringify(data.artist)}</i> </span></ul>
          <ul><span><b> Year: </b> <i>{JSON.stringify(data.year)}</i> </span></ul>
          <ul><span><b> Medium: </b> <i>{JSON.stringify(data.medium)}</i> </span></ul>
          <ul><span><b> Dimensions: </b> <i>{JSON.stringify(data.dimensions)}</i> </span></ul>
          <ul><span><b> Copyrights Holder: </b> <i>{props.selectedImage.copyright}</i> </span></ul>
          <ul><span><b> Inscriptions: </b> <i>{props.selectedImage.inscriptions}</i> </span></ul>
          <ul><span><b> Location: </b> <i>{props.selectedImage.location}</i> </span></ul>
          <ul> <span><b> Tags: </b> <i>{props.selectedImage.tags}</i> </span></ul>
        </div>
      </Row>

    </Col>

    </Container>

    <div class="align-right">
      <button class = "myButton" style={{width:200}}>
        ADD TO AN EXHIBITION
      </button>

      <button class = "myButton"  style={{width:200}}>
        EDIT TAGS
      </button>
    </div>
</div>
);
}

export default ExpandedView;
