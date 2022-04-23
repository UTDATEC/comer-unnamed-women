// const DataInputForm = () => {
//     return (
//         <div className="dataInput">
//             <p>
//             Data Input Form
//              </p>
//         </div> 
//     );
// }

import './DataInputForm.css';
import Grid from '@material-ui/core/Grid'
import { Component } from 'react';

export default class DataInputForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      artist: '',
      inscriptions: '',
      apiResponse: ""
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   this.setState({title: event.target.value});
  // }

  // Can have differnet input change handlers to set the state dependend upon what kind of input it is (date, text, etc_)
  handleChange(event) {
    const target = event.target;
    //const value = target.type === 'checkbox' ? target.checked : target.value;
    const value = target.value;
    const name = target.name;
    //console.log(target.name)

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    // Put this at end also works
    event.preventDefault();

    const dataObj = function(myTitle, myArtist, myInscriptions) {
      const title = myTitle;
      const artist = myArtist;
      const inscriptions = myInscriptions;
      return { title, artist, inscriptions };
  };
  
  const myDataObj = dataObj(this.state.title, this.state.artist, this.state.inscriptions);

    // Might need this.state.title?
    //const dataObj = { title }  
    //console.log(myDataObj)

    // Make post request, passing in state parameters
    fetch("http://localhost:9000/post", {
      // Maye done need method or headers
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(myDataObj)
    })


      // WORKING GET FROM TESTAPI
      // fetch("http://localhost:9000/testAPI")
      //     .then(res => res.text())
      //     .then(res => this.setState({ apiResponse: res }))

      //console.log(this.state.apiResponse)



    //alert('A name was submitted: ' + this.state.title);
    
  }

  

  render() {
    return (
      <div className="dataInputForm">
    <h2>Ingestion Engine Input</h2>
    <form onSubmit={this.handleSubmit}>
      <Grid container spacing={3}>
      <Grid item xs={5} sm={5}>
      <label>Title</label>
      <input 
        type="text" 
        name="title"
        value={this.state.value} 
        onChange={this.handleChange}
        required 
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Artist</label>
      <input 
        type="text" 
        name="artist"
        value={this.state.value} 
        onChange={this.handleChange}
        required 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Inscriptions</label>
      <input 
        type="text" 
        name="inscriptions"
        value={this.state.value} 
        onChange={this.handleChange}
        required 
         
      />
      {/* <Grid item xs={5} sm={5}>
      <label>This was supposed to be something else they said</label>
      <input 
        type="text" 
        required 
      /> */}
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Tags</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Date</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Medium</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Dimensions</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Accession Number</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Copyright</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Subject</label>
      <input 
        type="text" 
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Collection Location</label>
      <input 
        type="text" 
         
      />
      </Grid>
      </Grid>
      <button>Submit</button>
    </form>
  </div>
    );

  }
}
