import React, { Component, useEffect, useState } from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import ButtonAppBar from './ButtonAppBar'
import TitlebarGridList from './Cards'


export default function SearchPage() {
    return(
      <div>
        <ButtonAppBar />
        <TitlebarGridList />
      </div>
    );
}
