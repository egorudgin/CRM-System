import { useState, useEffect } from 'react';
import ToDo from './components/Todo.jsx';
import ToDoForm from './components/ToDoForm.jsx';
import TodoService from './http.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState('all');
  const [info, setInfo] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  });

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

    await TodoService.create(trimmed);
    const response = await TodoService.getAll(page);
    setTodos(response.todos);
    setInfo(response.info);
  };

  useEffect(() => {
    async function fetchTodos() {
      const response = await TodoService.getAll(page);
      setTodos(response.todos);
      setInfo(response.info);
    }
    fetchTodos();
  }, [page]);

  const removeTask = async (id) => {
    await TodoService.delete(id);
    const response = await TodoService.getAll(page);
    setTodos(response.todos);
    setInfo(response.info);
  };

  const editTask = async (id, title) => {
    const currentTask = todos.find((todo) => todo.id === id);
    if (!currentTask) return;
    const trimmed = title.trim();
    if (trimmed.length < 2) {
      alert('Минимум 2 символа');
      return;
    }
    if (trimmed.length > 64) {
      alert('Максимум 64 символа');
      return;
    }
    const editedTask = await TodoService.edit(id, { title: trimmed });
    if (!editedTask) return;
    setTodos((prev) => prev.map((todo) => (todo.id === id ? editedTask : todo)));
  };

  const handleToggle = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;
    const nextIsDone = !currentTodo.isDone;
    await TodoService.edit(id, { isDone: nextIsDone });
    const response = await TodoService.getAll(page);
    setTodos(response.todos);
    setInfo(response.info);
  };

  return (
    <div className="App">
      <ToDoForm addTask={addTask} />
      <div>
        <button className={page === 'all' ? 'active-tab' : ''} onClick={() => setPage('all')}>
          Все ({info.all})
        </button>
        <button className={page === 'inWork' ? 'active-tab' : ''} onClick={() => setPage('inWork')}>
          В работе ({info.inWork})
        </button>
        <button
          className={page === 'completed' ? 'active-tab' : ''}
          onClick={() => setPage('completed')}
        >
          Сделано ({info.completed})
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
