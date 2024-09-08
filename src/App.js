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
      .select('*') // Select all columns
      .order('position', {ascending: true});

    if (error) {
      console.log(error); // Log the error if there is one
    } else {
      setTodos(todos); // Update state with set todos
    }
  };

  // Add a new todo to the 'todos' table in supabase
  const addTodo = async() => {
    const maxPosition = await fetchMaxPosition(); // Fetch current position number of latest task added. This helps maintain order of list of tasks

    const {data, error} = await supabase
      .from('todos')
      .insert([{title: newTodo, is_complete: false, position: maxPosition + 1}]) // Insert into table with completion status defaulted to false, and position number to the last + 1
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

  // Helper function to fetch the current maximum position
  const fetchMaxPosition = async () => {
    const { data: currentTodos, error } = await supabase
      .from('todos')
      .select('position')
      .order('position', { ascending: true });

    if (error) {
      console.log('Error fetching current todos:', error);
      return null;
    }

    return currentTodos.length ? Math.max(...currentTodos.map(todo => todo.position)) : 0;
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

  // Handler for toggling whether a task is complete/incomplete
  const toggleComplete = async(id, completeStatus) => {
    const {error} = await supabase
      .from('todos')
      .update({'is_complete': !completeStatus})
      .eq('id', id)

      if (error) {
        console.log(error);
      } else {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === id ? {...todo, is_complete: !completeStatus} : todo
          )
        )
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
        {todos.map((todo, index) => (
          <li key={todo.id}>
            {/* If the todo is being edited, render as an input. Otherwise render as a view item */}
            {editId === todo.id ? (
              <>
                {index + 1}.
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleComplete(todo.id, todo.is_complete)}
                  title="Mark as complete/incomplete" // Tooltip for the checkbox
                />
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
                {index + 1}.
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => toggleComplete(todo.id, todo.is_complete)}
                  title="Mark as complete/incomplete" // Tooltip for the checkbox
                />
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
