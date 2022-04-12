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

const DataInputForm = () => {
    return (
        <div className="dataInputForm">
      <h2>Ingestion Engine Input</h2>
      <form>
        <Grid container spacing={3}>
        <Grid item xs={5} sm={5}>
        <label>Title</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Artist</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Tags</label>
        <input 
          type="text" 
          required 
        />
        {/* <Grid item xs={5} sm={5}>
        <label>Tags</label>
        <input 
          type="text" 
          required 
        /> */}
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Inscriptions</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Date</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Medium</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Dimensions</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Accession Number</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Copyright</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Subject</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        <Grid item xs={5} sm={5}>
        <label>Collection Location</label>
        <input 
          type="text" 
          required 
        />
        </Grid>
        </Grid>
        <button>Submit</button>
      </form>
    </div>
    );
}

export default DataInputForm;