import logo from './logo.svg';
import './App.css';

const btn = document.getElementById('btn');

function errorMessage()
{
  alert('Error')
  //btn.style.backgroundColor = 'salmon';
  //btn.style.color = 'white';
}

function App() {
  return (
    <div className="App">
      <button class = "myButton" onClick = {errorMessage}>
        Button
      </button>
    </div>
  );
}

export default App;
