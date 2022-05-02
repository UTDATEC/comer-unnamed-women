import {useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SearchPage from '../SearchPage/SearchPage'
import SearchPage2 from '../SearchPage2/SearchPage2'
import SearchBy from '../SearchBy/SearchBy'
import DataInput from '../DataInput/DataInputForm'

function App() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    inscriptions: "",
    medium: "",
    subject: "",
    tags: "",
    title: "",
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
          <Route path="/searchpage2">
            <SearchPage2 selectedImage={selectedImage}/>
          </Route>
          <Route path="/DataInputForm">
            <DataInput/>
          </Route>
          <Route path="/">
            <SearchPage searchParams={searchParams} setSelectedImage={setSelectedImage}/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
