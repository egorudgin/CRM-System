import { useCallback, useEffect, useState } from 'react';
import { Empty, List, message, Typography } from 'antd';

import Todo from '../components/Todo.js';
import TodoForm from '../components/TodoForm.js';
import TodoFilters from '../components/TodoFilters.js';
import { getTodos } from '../api/http.js';

import type { TodoFilter, TodosCount, TodoTitle } from '../types/typesTodo.js';

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoTitle[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoFilter>('all');

  const [todosCount, setTodosCount] = useState<TodosCount>({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  const refreshTodos = useCallback(async (): Promise<void> => {
    try {
      const response = await getTodos(filteredTodos);

      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch {
      message.error({
        content: 'Не удалось загрузить задачи. Проверьте интернет-соединение',
        key: 'todos-loading-error',
      });
    }
  }, [filteredTodos]);

  const handleFilterChange = useCallback((filter: TodoFilter): void => {
    setFilteredTodos(filter);
  }, []);

  useEffect(() => {
    void refreshTodos();

    const intervalId = window.setInterval(() => {
      void refreshTodos();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshTodos]);

  return (
    <>
      <Typography.Title level={1}>Список задач</Typography.Title>

      <TodoForm onTodosChanged={refreshTodos} />

      <TodoFilters
        filteredTodos={filteredTodos}
        todosCount={todosCount}
        onFilterChange={handleFilterChange}
      />

      <List
        className="todo-list"
        dataSource={todos}
        locale={{
          emptyText: <Empty description="В этом разделе пока нет задач" />,
        }}
        renderItem={(todo) => (
          <List.Item className="todo-list-item">
            <Todo
              id={todo.id}
              title={todo.title}
              isDone={todo.isDone}
              onTodosChanged={refreshTodos}
            />
          </List.Item>
        )}
      />
    </>
  );
}
