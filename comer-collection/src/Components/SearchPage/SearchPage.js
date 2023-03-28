import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import Cards from './Cards'
import NavBar from "../NavBar/NavBar";


export default function SearchPage(props) {
    return(
      <div>
<<<<<<< HEAD
        <ButtonAppBar />
        <Cards appProps={props}/>
=======
        {/* {console.log(props)} */}
        {/*<Cards appProps={props}/>*/}
          <NavBar />
>>>>>>> 49bbe6411372c9982f24eb4c18f43744457cd725
      </div>
    );
}
