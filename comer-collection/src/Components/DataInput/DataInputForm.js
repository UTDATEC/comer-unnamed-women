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
      tags: '',
      inscriptions: '',
      medium: '',
      dimensions: '',
      accessionNumber: '',
      copyright: '',
      subject: '',
      collectionLocation: '',
      dateCreated: '',
      file: '',
  };

    this.handleChange = this.handleChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] })
    //console.log(e);
  }


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

    console.log(this.state)

    const formData = new FormData()
    formData.append('title', this.state.title)
    formData.append('artist', this.state.artist)
    formData.append('tags', this.state.tags)
    formData.append('inscriptions', this.state.inscriptions)
    formData.append('dateCreated', this.state.dateCreated)
    formData.append('medium', this.state.medium)
    formData.append('dimensions', this.state.dimensions)
    formData.append('accessionNumber', this.state.accessionNumber)
    formData.append('copyright', this.state.copyright)
    formData.append('subject', this.state.subject)
    formData.append('collectionLocation', this.state.collectionLocation)
    formData.append('file', this.state.file)


    // Working Post
    axios.post("http://localhost:9000/upload", formData, {
        }).then(res => {
            console.log(res)
        })
    
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
         
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Tags</label>
      <input 
        type="text" 
        name="tags"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Date</label>
      <input 
        type="text" 
        name="dateCreated"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Medium</label>
      <input 
        type="text" 
        name="medium"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Dimensions</label>
      <input 
        type="text" 
        name="dimensions"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Accession Number</label>
      <input 
        type="text" 
        name="accessionNumber"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Copyright</label>
      <input 
        type="text" 
        name="copyright"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Subject</label>
      <input 
        type="text" 
        name="subject"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Collection Location</label>
      <input 
        type="text" 
        name="collectionLocation"
        value={this.state.value} 
        onChange={this.handleChange}
      />
      </Grid>
      <Grid item xs={5} sm={5}>
      <label>Image Upload</label>
      <input 
        type="file" 
        name="file"
        onChange={this.onFileChange}
      />
      </Grid>
      </Grid>
      <button>Submit</button>
    </form>
    
  </div>
    );

  }
}
