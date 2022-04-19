import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SearchPage from '../SearchPage/SearchPage'
import SearchPage2 from '../SearchPage2/SearchPage2'
import SearchBy from '../SearchBy/SearchBy'

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/searchpage">
            <SearchPage/>
          </Route>
          <Route path="/searchpage2">
            <SearchPage2/>
          </Route>
          <Route path="/">
            <SearchBy/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
