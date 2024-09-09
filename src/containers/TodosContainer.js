import React, { useState, useEffect } from 'react';
import TodoInput from '../components/TodoInput';
import TodoList from './TodoList';
import ToggleSwitch from '../components/ToggleSwitch';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import { supabase } from '../supabaseClient';

const TodosContainer = () => {
  const [todos, setTodos] = useState([]); // State to hold list of todos that are fetched from supabase db
  const [newTodo, setNewTodo] = useState(''); // State to hold new todos being added
  const [editId, setEditId] = useState(null); // State holding the ID of todo item being edited. Lets us make sure we're editing the correct item
  const [editTitle, setEditTitle] = useState(''); // State to hold title of todo being edited
  const [showCompleted, setShowCompleted] = useState(true); // State for wanting to show or hide completed tasks
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // fetch todos whenever component is mounted
  useEffect(() => {
    fetchTodos();
  }, [])

  // Handles filtering Todos by whether they are completed or not
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
        setSnackbarMessage('Failed to add task');
        setSnackbarSeverity('error');
      } else {
        // Update state with the new todo
        setTodos(prevTodos => [...prevTodos, ...data]);
    
        // Clear the input field
        setNewTodo('');

        setSnackbarMessage('Task added successfully');
        setSnackbarSeverity('success');
      }
    setSnackbarOpen(true);
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
      setSnackbarMessage('Failed to save task');
      setSnackbarSeverity('error');
    } else {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: editedTitle } : todo
        )
      );
      setEditId(null); // Exit edit mode after saving
      setSnackbarMessage('Task updated successfully');
      setSnackbarSeverity('success');
    }
    setSnackbarOpen(true);
  }

  // Handler for toggling whether a task is complete/incomplete
  const toggleComplete = async(id, completeStatus) => {
    const {error} = await supabase
      .from('todos')
      .update({'is_complete': !completeStatus})
      .eq('id', id)

      if (error) {
        console.log(error); // Log the error if there is one
        setSnackbarMessage('Failed to toggle task status');
        setSnackbarSeverity('error');
      } else {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === id ? {...todo, is_complete: !completeStatus} : todo
          )
        )
        setSnackbarMessage('Task status updated successfully');
        setSnackbarSeverity('success');
      }
      setSnackbarOpen(true);
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
      setSnackbarMessage('Failed to delete task');
      setSnackbarSeverity('error');
    } else {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // Update current state to remove deleted todo
      setSnackbarMessage('Task deleted successfully');
      setSnackbarSeverity('success');
    }
    setSnackbarOpen(true);
  }

  // Handles closing SnackBar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

    return (
        <Container maxWidth="sm">
        <Box textAlign="center" mb={{ xs: 2, sm: 4 }}>
          <Typography sx={{marginBottom: '10px'}} variant="h4" component="h1" align="center">
            To Do List
          </Typography>
          <TodoInput newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
          <ToggleSwitch showCompleted={showCompleted} handleToggleChange={handleToggleChange} />
          <TodoList
            todos={filteredTodos}
            editId={editId}
            setEditId={setEditId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
            toggleComplete={toggleComplete}
          />
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
}

export default TodosContainer;