import { useState, useEffect } from 'react';
import ToDo from './components/Todo.jsx';
import ToDoForm from './components/ToDoForm.jsx';
import axios from 'axios';
import TodoService from './http.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState('all');

  const addTask = async (userInput) => {
    const trimmed = userInput.trim();
    if (trimmed.length < 2) {
      alert('Минимум 2 символа');
      return;
    }
    if (trimmed.length > 64) {
      alert('Максимум 64 символа');
      return;
    }

    const newItem = await TodoService.create(trimmed);
    setTodos([...todos, newItem]);
  };

  useEffect(() => {
    async function fetchTodos() {
      const toggleTodosPages = await TodoService.getAll(page);
      setTodos(toggleTodosPages);
    }
    fetchTodos();
  }, [page]);

  const removeTask = async (id) => {
    const deleteTask = await TodoService.delete(id);
    if (!deleteTask) return;
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  const editTask = async (id, title) => {
    const currentTask = todos.find((todo) => todo.id === id);
    if (!currentTask) return;
    const editedTask = await TodoService.edit(id, { title });
    if (!editedTask) return;
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, editedTask } : { ...todo })));
  };

  const handleToggle = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;
    const nextIsDone = !currentTodo.isDone;
    const editToggle = await TodoService.edit(id, { isDone: nextIsDone });
    if (!editToggle) return;
    setTodos(todos.map((todo) => (todo.id === id ? editToggle : todo)));
  };

  return (
    <div className="App">
      <ToDoForm addTask={addTask} />
      <div>
        <button className={page === 'all' ? 'active-tab' : ''} onClick={() => setPage('all')}>
          Все ({todos.length})
        </button>
        <button className={page === 'inWork' ? 'active-tab' : ''} onClick={() => setPage('inWork')}>
          В работе ({todos.filter((todo) => todo.isDone === false).length})
        </button>
        <button
          className={page === 'completed' ? 'active-tab' : ''}
          onClick={() => setPage('completed')}
        >
          Сделано ({todos.filter((todo) => todo.isDone === true).length})
        </button>
      </div>
      {todos.map((todo) => {
        return (
          <ToDo
            key={todo.id}
            todo={todo}
            toggleTask={handleToggle}
            changedTask={editTask}
            removeTask={removeTask}
          />
        );
      })}
    </div>
  );
}
