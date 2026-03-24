import { useState, useEffect } from 'react';
import ToDo from './components/Todo.jsx';
import ToDoForm from './components/ToDoForm.jsx';
import { getAll, edit, create, deleteTodo } from './api/http.js';

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

    try {
      await create(trimmed);
      const response = await getAll(page);
      setTodos(response.todos);
      setInfo(response.info);
    } catch (error) {
      alert('Ошибка при добавлении задачи!');
    }
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await getAll(page);
        setTodos(response.todos);
        setInfo(response.info);
      } catch (error) {
        alert(
          'Ошибка обновления списка задач. Проверьте интернет-соединение и перезагрузите страницу',
        );
      }
    }
    fetchTodos();
  }, [page]);

  const removeTask = async (id) => {
    try {
      await deleteTodo(id);
      const response = await getAll(page);
      setTodos(response.todos);
      setInfo(response.info);
    } catch (error) {
      alert('Ошибка при удалении задачи!');
    }
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
    try {
      const editedTask = await edit(id, { title: trimmed });
      if (!editedTask) return;
      setTodos((prev) => prev.map((todo) => (todo.id === id ? editedTask : todo)));
    } catch (error) {
      alert('Ошибка при редактировании задачи!');
    }
  };

  const handleToggle = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;
    const nextIsDone = !currentTodo.isDone;
    try {
      await edit(id, { isDone: nextIsDone });
      const response = await getAll(page);
      setTodos(response.todos);
      setInfo(response.info);
    } catch (error) {
      alert('Ошибка при изменени статуса задачи!');
    }
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
