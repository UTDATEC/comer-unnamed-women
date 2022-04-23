import './DataInputForm.css';
import Grid from '@material-ui/core/Grid'
import { Component } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

export default class DataInputForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      artist: '',
      data: '',
      file: '',
      apiResponse: ""
  };

    this.handleChange = this.handleChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFileChange(e) {
    //this.setState({ data: e.target.files[0] })
    console.log(e);
  }


  state = {

    // Initially, no file is selected
    selectedFile: null
    };
    onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    };

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

    const formData = new FormData()
    // formData.append('title', this.state.title)
    // formData.append('artist', this.state.artist)
    // formData.append('data', this.state.data)
    formData.append('file', "steph")
    // fetch("http://localhost:9000/post", {
    //   // Maye done need method or headers
    //   method: 'POST',
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData)
    // })

    // axios.post("http://localhost:4000/api/user-profile", formData, {
    // }).then(res => {
    //     console.log(res)
    // })

    // fetch("http://localhost:9000/post", {
    //   // Maye done need method or headers
    //   method: 'POST',
    //   headers: { "Content-Type": "application/json" },
    //   body: formData
    // })



    const dataObj = function(myTitle, myArtist, myData) {
      const title = myTitle;
      const artist = myArtist;
      const data = myData;
      return { title, artist, data };
  };
  const myDataObj = dataObj(this.state.title, this.state.artist, this.state.data);

    // Might need this.state.title?
    //const dataObj = { title }  
    //console.log(myDataObj)

    //console.log(formData)

    //Make post request, passing in state parameters
    // fetch("http://localhost:9000/upload", {
    //   // Maye done need method or headers
    //   method: 'POST',
    //   //headers: { "Content-Type": "multipart/form-data" },
    //   headers: { "Content-Type": "multipart/form-data" },
    //   body: formData
    // }).then(response => {
    //   console.log(response)
    // }).catch(err => {
    //   console.log(err)
    // }) 

    axios.post("http://localhost:9000/upload", formData, {
        }).then(res => {
            console.log(res)
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
        type="file" 
        name="file"
        id="file"
        value={this.state.value} 
        onChange={this.onFileChange}
         
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
      <Grid item xs={5}sm={5}>
        <label>Image Upload</label>
        <div>
        <div>
        <input type="file" onChange={this.onFileChange} />
        </div>
        </div>
        </Grid>
      </Grid>
      <button>Submit</button>
    </form>

    {/* <div className="container">
                <div className="row">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="file" onChange={this.onFileChange} />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" name="file" type="submit">Upload</button>
                        </div>
                    </form>
                </div>
            </div> */}
    {/* <div class="row">
        <div class="col-sm-12">
          <div class="preview-images"></div>
        </div>
    </div> */}
    {/* <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script> */}

    
  </div>
    );

  }
}
