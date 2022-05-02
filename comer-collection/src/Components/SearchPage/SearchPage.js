import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import TitlebarGridList from './Cards'


export default function SearchPage(props) {
    return(
      <div>
        {/* {console.log(props)} */}
        <ButtonAppBar />
        <TitlebarGridList appProps={props}/>
      </div>
    );
}
