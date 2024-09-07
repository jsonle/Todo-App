import React, {useState, useEffect} from 'react';
import { supabase } from './supabaseclient';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]); // State to hold list of todos that are fetched from supabase db
  const [newTodo, setNewtodo] = useState(''); // State to hold new todos being added
  const [editId, setEditId] = useState(null); // State holding the ID of todo item being edited. Lets us make sure we're editing the correct item
  const [editTitle, setEditTitle] = useState(''); // State to hold title of todo being edited

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
        // Update state with the new todo
        setTodos(prevTodos => [...prevTodos, ...data]);
    
        // Clear the input field
        setNewtodo('');
      }
  };

  // Update the todo being edited 
  const updateTodo = async(id, editedTitle) => {
    const {data, error} = await supabase
      .from('todos')
      .update({'title': editedTitle})
      .eq('id', id)
      .select()

    if (error) {
      console.log(error);
    } else {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: editedTitle } : todo
        )
      );
      setEditId(null); // Exit edit mode after saving
    }
  }

  // Remove a todo from list and supabase table
  const removeTodo = async(id) => {
    const {error} = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.log(error); // Log error if there is one
    } else {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // Update current state to remove deleted todo
    }
  }

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
          <li key={todo.id}>
            {/* If the todo is being edited, render as an input. Otherwise render as a view item */}
            {editId === todo.id ? (
              <>
                <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => updateTodo(todo.id, editTitle)} // Save on blur (clicking outside the input)
                autoFocus // Automatically focus on the input field
                />
                <button onClick={() => updateTodo(todo.id, editTitle)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.title}</span>
                <button onClick={() => {setEditId(todo.id); setEditTitle(todo.title)}}>Edit</button>
                <button onClick={() => removeTodo(todo.id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
