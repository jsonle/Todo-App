import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const TodoInput = ({ newTodo, setNewTodo, addTodo }) => (
  <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
    <TextField
      variant="outlined"
      placeholder="Add a new task"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      fullWidth
    />
    <Button variant="contained" color="primary" onClick={addTodo} sx={{ ml: 2 }}>
      Add
    </Button>
  </Box>
);

export default TodoInput;
