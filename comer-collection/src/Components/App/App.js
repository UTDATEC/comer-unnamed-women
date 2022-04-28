import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SearchPage from '../SearchPage/SearchPage'
import SearchPage2 from '../SearchPage2/SearchPage2'
import SearchBy from '../SearchBy/SearchBy'
import DataInput from '../DataInput/DataInputForm'

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/searchBy">
            <SearchBy/>
          </Route>
          <Route path="/searchpage2">
            <SearchPage2/>
          </Route>
          <Route path="/DataInputForm">
            <DataInput/>
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
