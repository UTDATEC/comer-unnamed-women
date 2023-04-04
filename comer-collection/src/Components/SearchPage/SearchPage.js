import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import Cards from './Cards'
import NavBar from "../NavBar/NavBar";


export default function SearchPage(props) {
    return(
      <div>
        {/* {console.log(props)} */}
        {/*<Cards appProps={props}/>*/}
          <NavBar />
      </div>
    );
}
