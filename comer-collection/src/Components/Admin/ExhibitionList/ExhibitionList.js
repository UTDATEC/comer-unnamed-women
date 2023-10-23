import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Table.css"
import { Link } from 'react-router-dom';


function ExhibitionList() {
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
          <h2 className="table-name">List of Exhibition</h2>

          <table className='Table'>

            <thead>
              <tr>
                <th>Exhibition Name</th>
                <th>Arist</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* {admin.map((data, i) => (
                <tr key={i}>
                  <td>{data.netid}</td>
                  <td>{data.fullname}</td>
                  <td>
                    <Link to="/DeleteExhibition" className='RedButton'>
                      Delete
                    </Link>
                  </td>

                </tr>
              ))} */}

              <tr>
                <td>Exhibition Name</td>
                <td>John Doe</td>
                <td>
                    <Link to="/DeleteExhibition" className='RedButton'>
                      Delete
                    </Link>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExhibitionList;
