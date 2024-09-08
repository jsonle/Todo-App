import React from 'react';
import { List, Box } from '@mui/material';
import TodoItem from '../components/TodoItem';

const TodoList = ({ todos, editId, setEditId, editTitle, setEditTitle, updateTodo, removeTodo, toggleComplete }) => (
  <Box>
    <List>
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
    </List>
  </Box>
);

export default TodoList;
