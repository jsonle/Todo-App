import React, {useState, useEffect} from 'react';
import { supabase } from './supabaseclient';
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Switch
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]); // State to hold list of todos that are fetched from supabase db
  const [newTodo, setNewtodo] = useState(''); // State to hold new todos being added
  const [editId, setEditId] = useState(null); // State holding the ID of todo item being edited. Lets us make sure we're editing the correct item
  const [editTitle, setEditTitle] = useState(''); // State to hold title of todo being edited
  const [showCompleted, setShowCompleted] = useState(true); // State for wanting to show or hide completed tasks

  // fetch todos whenever component is mounted
  useEffect(() => {
    fetchTodos();
  }, [])

  const filteredTodos = todos.filter(todo => showCompleted || !todo.is_complete);

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

  // Handler for toggling whether we want to show or hide completed tasks
  const handleToggleChange = () => {
    console.log(showCompleted)
    setShowCompleted(!showCompleted);
  };

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
    <Container maxWidth="sm">
      <Box sx={{ padding: '20px' }}>
        <h1>To Do List</h1>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Add a new task"
            value={newTodo}
            onChange={(e) => setNewtodo(e.target.value)}
          />
          <Button onClick={addTodo} variant="contained" sx={{ marginLeft: '10px' }}>
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Switch
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            color="primary"
          />
          <span style={{ marginLeft: '10px' }}>Show Completed</span>
        </Box>
        <List>
          {filteredTodos.map((todo) => (
            <ListItem key={todo.id} disablePadding>
              <Checkbox
                checked={todo.is_complete}
                onChange={() => toggleComplete(todo.id, todo.is_complete)}
                sx={{ marginRight: '10px' }}
              />
              {editId === todo.id ? (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => updateTodo(todo.id, editTitle)}
                    autoFocus
                    sx={{ flexGrow: 1 }}
                  />
                  <Button onClick={() => updateTodo(todo.id, editTitle)}>Save</Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ListItemText
                    primary={todo.title}
                    sx={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}
                  />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <IconButton onClick={() => { setEditId(todo.id); setEditTitle(todo.title); }}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => removeTodo(todo.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
