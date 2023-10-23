import React from 'react'
import "./AdminNavData"
import { AdminNavData } from './AdminNavData';
import "./AdminNav.css"

function AdminNav() {

  return (

    <div className='AdminSideBar'> 
      <div className='AdminProfile'>

        <h2>Admin</h2>
      
      </div>

      <ul className='AdminSideBarList'>
        {AdminNavData.map ((val, key) => {
          return ( 
            <li key={key} 
            className='AdminSideBarRow'


            // color stay wherever the current pathname
            id={window.location.pathname === val.link ? "active" : ""}
            onClick = {() => {
              // change path when clicking
              window.location.pathname = val.link
                }
              }>
              <div id='AdminIcon'>{val.icon}</div>
              <div id='AdminTitle'>{val.title}</div>
            </li>
          )
      })}
      </ul>
    </div>
  )
}

export default AdminNav