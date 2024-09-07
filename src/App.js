import React, {useState, useEffect} from 'react';
import { supabase } from './supabaseclient';
import './App.css';

function App() {
  // State to hold list of todos that are fetched from supabase db
  const [todos, setTodos] = useState([]);
  // State to hold new todos being added
  const [newTodo, setNewtodo] = useState('');

  // fetch todos whenever component is mounted
  useEffect(() => {
    fetchTodos();
  }, [])

  // Fetch todos from supabase 'todos' table
  const fetchTodos = async() => {
    let {data: todos, error} = await supabase
      .from('todos')
      .select('*'); // Select all columns

    if (error) {
      console.log(error); // Log the error if there is one
    } else {
      setTodos(todos); // Update state with set todos
    }
  };
  // Add a new todo to the 'todos' table in supabase
  const addTodo = async() => {
    const {data, error} = await supabase
      .from('todos')
      .insert([{title: newTodo, is_complete: false}]) // Insert into table with completion status defaulted to false
      .select()

      if (error) {
        console.log('Error:', error);
      } else {
        // Ensure `data` contains the correct structure
        console.log('New Todo Added:', data);
    
        // Update state with the new todo
        setTodos(prevTodos => [...prevTodos, ...data]);
    
        // Clear the input field
        setNewtodo('');
      }
  };

  return (
    <div className="App">
      <h1>To Do List</h1>
      <input 
        type="text" 
        value={newTodo} 
        onChange={(e) => {
          console.log(e.target.value);
          setNewtodo(e.target.value);
        }}
        placeholder="Add a new task"
        />
      <button onClick={addTodo}>Add</button>
      <ul>
        {/* Get all todos from the state and list them */}
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
