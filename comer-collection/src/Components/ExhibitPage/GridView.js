import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import Images from './Images'
import NavBar from "../NavBar/NavBar";

//<Cards appProps={props}/> replaced by <Images appProps={props}/>
export default function Search(props) {
    return(
      <div>
        {/* {console.log(props)} */}
        {/*<Cards appProps={props}/>*/}
          <NavBar />
          <Images appProps={props}/>
      </div>
    );
}
