import './ExpandedView.css';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from '../NavBar/NavBar';

const PREFIX = 'ExpandedView';

const classes = {
  abRoot: `${PREFIX}-abRoot`,
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.abRoot}`]: {
  backgroundColor: '#e87500',
  },

  [`& .${classes.root}`]: {
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  }
}));

function ExpandedView(props) {

  const navigate = useNavigate();
  const data = navigate.location.state.data

  return (
    <Root className="App">
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
    </Root>
  );
}

export default ExpandedView;
