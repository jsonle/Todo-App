import React from 'react';
import { ListItem, Checkbox, IconButton, TextField, Box, ListItemText, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TodoItem = ({
  todo,
  editId,
  setEditId,
  editTitle,
  setEditTitle,
  updateTodo,
  removeTodo,
  toggleComplete,
}) => (
  <ListItem>
    <Checkbox
      checked={todo.is_complete}
      onChange={() => toggleComplete(todo.id, todo.is_complete)}
      title="Mark as complete/incomplete"
      sx={{marginRight: '10px'}}
    />
    {editId === todo.id ? (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          variant="outlined"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => updateTodo(todo.id, editTitle)}
          autoFocus
        />
        <Box sx={{marginLeft: 'auto'}}>
            <Button onClick={() => updateTodo(todo.id, editTitle)}>Save</Button>
            <Button onClick={() => setEditId(null)}>Cancel</Button>
        </Box>
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
);

export default TodoItem;
