import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import GridView from '../GridView/GridView'
import ExpandedView from '../ExpandedView/ExpandedView'
import SearchBy from '../SearchBy/SearchBy'
import DataInput from '../DataInput/DataInputForm'
import ExhibitMain from '../Exhibit/ExhibitMain'
import NavBar from '../NavBar/NavBar'
import React, { Component, useEffect, useState } from 'react';

import { PrivateRoute } from '../Routes/PrivateRoute';

export default function App() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    inscriptions: "",
    medium: "",
    subject: "",
    tags: "",
    dateCreated: "",
    dimensions: "",
    accessionNumber: "",
    collectionLocation: "",
    copyright: "",
    artist: ""
  });

  const [selectedImage, setSelectedImage] = useState({
    accessionNumber: "",
    artist: "",
    collectionLocation: "",
    copyright: "",
    createdAt: "",
    dateCreated: "",
    dimensions: "",
    fileName: "",
    id: -1,
    inscriptions: "",
    medium: "",
    subject: "",
    tags: "",
    title: "",
    updatedAt: ""
  });

  return (

      <div className="wrapper">
        <BrowserRouter>
        <Switch>
          <Route path="/searchBy">
            <SearchBy paramSetter={setSearchParams}/>
          </Route>
          <Route path="/exhibitmain">
            <ExhibitMain paramSetter={setSearchParams}/>
          </Route>
          <Route path="/expandedView">
            <ExpandedView selectedImage={selectedImage}/>
          </Route>
          <Route path="/DataInputForm">
            <DataInput/>
          </Route>
          <PrivateRoute path="/">
            <GridView searchParams={searchParams} setSelectedImage={setSelectedImage}/>
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
