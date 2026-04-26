import { useState, useEffect } from 'react';
import Todo from './components/Todo.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoFilters from './components/TodoFilters.jsx';
import { getTodos } from './api/http.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState('all');
  const [todosCount, setTodosCount] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  });

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

  return (
    <div className="App">
      <TodoForm filteredTodos={filteredTodos} setTodos={setTodos} setTodosCount={setTodosCount} />

      <TodoFilters
        filteredTodos={filteredTodos}
        setFilteredTodos={setFilteredTodos}
        todosCount={todosCount}
      />

      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            todo={todo}
            filteredTodos={filteredTodos}
            setTodos={setTodos}
            setTodosCount={setTodosCount}
          />
        );
      })}
    </div>
  );
}
