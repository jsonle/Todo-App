import React from 'react';
import { List, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import TodoItem from '../components/TodoItem';

const TodoList = ({ todos, editId, setEditId, editTitle, setEditTitle, updateTodo, removeTodo, toggleComplete }) => (
  <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto' }}>
    <Table sx={{minWidth: '600'}}>
        <TableHead>
            <TableRow>
            <TableCell align="center" sx={{ width: '20%', padding: '16px' }}>Mark as Complete</TableCell>
            <TableCell align="left" sx={{ width: '75%', padding: '16px' }}>Task</TableCell>
            <TableCell align="center" sx={{ width: '20%', padding: '16px' }}>Status</TableCell>
            <TableCell align="center" sx={{ width: '10%', padding: '16px' }}>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {todos.map((todo, index) => (
                <TodoItem
                key={todo.id}
                todo={todo}
                editId={editId}
                setEditId={setEditId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                updateTodo={updateTodo}
                removeTodo={removeTodo}
                toggleComplete={toggleComplete}
                />
            ))}
        </TableBody>
    </Table>
  </TableContainer>
);

export default TodoList;
