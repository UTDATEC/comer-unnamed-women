import React from 'react';
// import logo from './utd.svg';
import '../App/App.css';
import Images from './Images';

//<Cards appProps={props}/> replaced by <Images appProps={props}/>
export default function SearchPage(props) {
    return(
      <div>
        {/* {console.log(props)} */}
        {/*<Cards appProps={props}/>*/}
          <Images appProps={props}/>
      </div>
    );
}