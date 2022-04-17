import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SearchPage from '../SearchPage/SearchPage'
import SearchPage2 from '../SearchPage2/SearchPage2'

function App() {
  return (
    <div className="wrapper">
      <h1>Marine Mammals</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/searchpage">
            <SearchPage2/>
          </Route>
          <Route path="/">
            <SearchPage/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
