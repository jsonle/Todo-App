import React, {useState, useEffect} from 'react';
import { supabase } from './supabaseclient';
import './App.css';

function App() {
  // State to hold list of todos that are fetched from supabase db
  const [todos, setTodos] = useState([]);
  // State to hold new todos being added
  const [newTodo, setNewtodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [])

  // Fetch todos from supabase 'todos' table
  const fetchTodos = async() => {
    let { data: todos, error } = await supabase
      .from('todos')
      .select('*'); // Select all columns

    if (error) {
      console.log(error);
    } else {
      setTodos(todos);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
