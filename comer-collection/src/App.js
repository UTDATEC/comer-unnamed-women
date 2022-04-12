import logo from './logo.svg';
import './App.css';
import ButtonAppBar from './ButtonAppBar'
import TitlebarGridList from './Cards'

class App extends Component {
  render() {
    return(
      <div>
        <ButtonAppBar />
        <TitlebarGridList />
      </div>
    );
  }
}

// export default App;
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload test.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
