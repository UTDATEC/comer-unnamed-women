import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SearchPage from '../SearchPage/SearchPage'

function App() {
  return (
    <div className="wrapper">
      <h1>Marine Mammals</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <SearchPage/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
