import logo from './logo.svg';
import './App.css';
import Create from './Create'
import Cards from './Cards'
import { Routes } from 'react-router-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import XfieldBox from './XfieldBox';
import './server'



function App() {
  return (
    <div>
      
      <Create />
      <Cards />
     
    </div>
  );
}

export default App;
