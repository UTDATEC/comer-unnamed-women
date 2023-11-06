import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Table.css"
import { Link } from 'react-router-dom';


function Image() {
  const [admin, setAdmin] = useState([])

  // Place the useEffect hook at the top level of the component
  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => {
        // Set the state with the data received from the server
        setAdmin(res.data);
      })
      .catch(err => console.error(err))
  }, []);

  return (
    <div className='ListContainer'>
      <div className='TableContainer'>
        <div className='AdminTable'>
          <h2 className="table-name">List of Images</h2>

          <table className='Table'>

            <thead>
              <tr>
                <th>Image Name</th>
                <th>Photographer</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* {admin.map((data, i) => (
                <tr key={i}>
                  <td>{data.netid}</td>
                  <td>{data.fullname}</td>
                  <td>
                    <Link to="/ViewImages" className='GreenButton'>
                      View
                    </Link>
                  </td>
                  <td>
                    <Link to="/EditImages" className='GreenButton'>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))} */}

              <tr>
                <td>Image Name</td>
                <td>Name</td>
                <td>
                    <Link to="/ViewImages" className='GreenButton'>
                      View
                    </Link>
                  </td>
                  <td>
                    <Link to="/EditImages" className='GreenButton'>
                      Edit
                    </Link>
                  </td>
              </tr>


            </tbody>
          </table>
        </div>

      <div>
        <button className='GreenButton' id='top-margin'>Upload New Image</button>
      </div>

    </div>
  </div>
  );
}

export default Image;
