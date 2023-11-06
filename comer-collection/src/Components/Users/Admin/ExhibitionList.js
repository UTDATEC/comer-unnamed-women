import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Table.css"
import { Link } from 'react-router-dom';


function ExhibitionList() {


  return (
    <div className='ListContainer'>
      <div className='TableContainer'>
        <div className='AdminTable'>
          <h2 className="table-name">List of Exhibitions</h2>

          <table className='Table'>

            <thead>
              <tr>
                <th>Exhibition Name</th>
                <th>Curator</th>
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
