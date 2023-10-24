import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Table.css"
import { Link } from 'react-router-dom';

function StudentList() {
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

  // Function to format ISO 8601 date to a readable format (YYYY-MM-DD)
  const formatISODate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to calculate the "Deactivating in (Days)" for each user
  const calculateDeactivationInDays = (deactivationDate) => {
    const today = new Date();
    const deactivation = new Date(deactivationDate);

    const differenceInTime = deactivation.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Function to handle the Deactivate button click and show a confirmation dialog
  const handleDeactivateClick = () => {
    const confirmed = window.confirm("Are you sure you want to deactivate this student?");
    if (confirmed) {
      // User clicked "Yes," conditionally render the Link component to navigate
      return <Link to="/deactivate">Deactivate</Link>;
    } else {
      // User clicked "No," you can do nothing here or perform other actions
    }
  };



  return (
    <div className='ListContainer'>


      <div className='TableContainer'>


        <div className='AdminTable'>

          <h2 className="table-name">List of Students</h2>

          <table className='Table'>

            <thead>
              <tr>
                <th>Net ID</th>
                <th>Name</th>
                <th>Exhibition</th>
                <th>Deactivation Date</th>
                <th>Deactivating in (Days)</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* {admin.map((data, i) => (
                <tr key={i}>
                  <td>{data.netid}</td>
                  <td>{data.fullname}</td>
                  <td className='text-center'>{data.exhibition}</td>
                  <td className='text-center'>{formatISODate(data.deactivationdate)}</td>
                  <td className='text-center'>{calculateDeactivationInDays(data.deactivationdate)}</td>
                  <td>
                    <Link to="/deactivate" className='RedButton'>
                      Deactivate
                    </Link>
                  </td>
                </tr>
              ))} */}
              {/* testing data */}
              <tr> 
                <td>"abc1234567"</td>
                <td>"John Doe"</td>
                <td className='text-center'>"20"</td>
                <td className='text-center'>"2024-01-01"</td>
                <td className='text-center'>{calculateDeactivationInDays("2024-01-01")}</td>
                <td>
                  <button className='RedButton' onClick={handleDeactivateClick}>
                    Deactivate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
