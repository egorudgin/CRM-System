import { useState, useEffect } from 'react';
import Todo from '../components/Todo.js';
import TodoForm from '../components/TodoForm.js';
import TodoFilters from '../components/TodoFilters.js';
import { getTodos } from '../api/http.js';
import type { TodoTitle, TodoFilter, TodosCount } from '../types/typesTodo.js';

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoTitle[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoFilter>('all');
  const [todosCount, setTodosCount] = useState<TodosCount>({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  useEffect(() => {
    async function fetchTodos(): Promise<void> {
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

    const intervalId = setInterval(() => {
      fetchTodos();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [filteredTodos]);

  return (
    <>
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
    </>
  );
}
