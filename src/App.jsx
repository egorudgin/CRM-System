import { useState, useEffect } from 'react';
import Todo from './components/Todo.jsx';
import TodoForm from './components/TodoForm.jsx';
import { getTodos, editTodo, createTodo, deleteTodo } from './api/http.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState('all');
  const [todosCount, setTodosCount] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  const handleAddTodo = async (userInput) => {
    try {
      await createTodo(userInput);
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
      return true;
    } catch (error) {
      alert('Ошибка при добавлении задачи!');
      return false;
    }
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await getTodos(filteredTodos);
        setTodos(response.todos);
        setTodosCount(response.todosCount);
      } catch (error) {
        alert(
          'Ошибка обновления списка задач. Проверьте интернет-соединение и перезагрузите страницу',
        );
      }
    }
    fetchTodos();
  }, [filteredTodos]);

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при удалении задачи!');
    }
  };

  const handleEditTodo = async (id, title) => {
    const currentTask = todos.find((todo) => todo.id === id);
    if (!currentTask) return false;

    try {
      const editedTask = await editTodo(id, { title });
      if (!editedTask) return false;
      setTodos((prev) => prev.map((todo) => (todo.id === id ? editedTask : todo)));
      return true;
    } catch (error) {
      alert('Ошибка при редактировании задачи!');
      return false;
    }
  };

  const handleToggleTodo = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;
    const nextIsDone = !currentTodo.isDone;
    try {
      await editTodo(id, { isDone: nextIsDone });
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при изменени статуса задачи!');
    }
  };

  return (
    <div className="App">
      <TodoForm handleAddTodo={handleAddTodo} />
      <div>
        <button
          className={filteredTodos === 'all' ? 'active-tab' : ''}
          onClick={() => setFilteredTodos('all')}
        >
          Все ({todosCount.all})
        </button>
        <button
          className={filteredTodos === 'inWork' ? 'active-tab' : ''}
          onClick={() => setFilteredTodos('inWork')}
        >
          В работе ({todosCount.inWork})
        </button>
        <button
          className={filteredTodos === 'completed' ? 'active-tab' : ''}
          onClick={() => setFilteredTodos('completed')}
        >
          Сделано ({todosCount.completed})
        </button>
      </div>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            todo={todo}
            handleToggleTodo={handleToggleTodo}
            handleEditTodo={handleEditTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        );
      })}
    </div>
  );
}
