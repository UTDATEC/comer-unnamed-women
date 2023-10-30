import React from 'react'
import "./AdminNavData"
import { AdminNavData } from './AdminNavData';
import "../AccountNav.css"

function AdminNav() {

  return (

    <div className='SideBar'> 
      <div className='Profile'>

        <h2>Admin</h2>
      
      </div>

      <ul className='SideBarList'>
        {AdminNavData.map ((val, key) => {
          return ( 
            <li key={key} 
            className='SideBarRow'


            // color stay wherever the current pathname
            id={window.location.pathname === val.link ? "active" : ""}
            onClick = {() => {
              // change path when clicking
              window.location.pathname = val.link
                }
              }>
              <div id='icon'>{val.icon}</div>
              <div id='title'>{val.title}</div>
            </li>
          )
      })}
      </ul>
    </div>
  )
}

export default AdminNav