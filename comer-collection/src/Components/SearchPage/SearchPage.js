import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import Cards from './Cards'
import Images from './Images'

//<Cards appProps={props}/> replaced by <Images appProps={props}/>
export default function SearchPage(props) {
    return(
      <div>
        {/* {console.log(props)} */}
        <ButtonAppBar />
        <Images appProps={props}/>
      </div>
    );
}
