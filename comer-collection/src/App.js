import logo from './logo.svg';
import './App.css';
import DataInputForm from './DataInputForm';

const btn = document.getElementById('btn');

function submitMessage()
{
  alert('Submitted Successfully!')
  //btn.style.backgroundColor = 'salmon';
  //btn.style.color = 'white';
}

function App() {
  return (
    <div className="App">
      <DataInputForm />
    </div>
  );
}

export default App;
