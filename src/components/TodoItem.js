import React from 'react';
import { ListItem, Checkbox, IconButton, TextField, Box, ListItemText, Button, TableCell, TableRow } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';

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
<TableRow key={todo.id}>
    <TableCell align="center">
      <Checkbox
        checked={todo.is_complete}
        onChange={() => toggleComplete(todo.id, todo.is_complete)}
      />
    </TableCell>
    <TableCell align="left">
      {editId === todo.id ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          autoFocus
        />
      ) : (
        <span>{todo.title}</span>
      )}
    </TableCell>
    <TableCell align="center">
      {todo.is_complete ? 'Completed' : 'Incomplete'}
    </TableCell>
    <TableCell align="right">
      {editId === todo.id ? (
        <Box sx={{ display: 'flex'}}>
          <IconButton onClick={() => { updateTodo(todo.id, editTitle); setEditId(null); }}>
            <Save />
          </IconButton>
          <IconButton onClick={() => setEditId(null)}>
            <Cancel />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex'}}>
          <IconButton onClick={() => { setEditId(todo.id); setEditTitle(todo.title); }}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => removeTodo(todo.id)}>
            <Delete />
          </IconButton>
        </Box>
      )}
    </TableCell>
  </TableRow>
);

export default TodoItem;
