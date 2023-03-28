import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import Cards from './Cards'


export default function SearchPage(props) {
    return(
      <div>
        <ButtonAppBar />
        <Cards appProps={props}/>
      </div>
    );
}
