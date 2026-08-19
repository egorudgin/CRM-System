import { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Empty, List, message, Typography } from 'antd';

import Todo from '../components/Todo.tsx';
import TodoForm from '../components/TodoForm.tsx';
import TodoFilters from '../components/TodoFilters.tsx';
import { getTodos } from '../api/http.ts';

import type { Todo as TodoType, TodoFilter, TodoInfo } from '../types/typesTodo.ts';

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoFilter>('all');

  const [todosCount, setTodosCount] = useState<TodoInfo>({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  const refreshTodos = useCallback(async (): Promise<void> => {
    try {
      const response = await getTodos(filteredTodos);

      setTodos(response.data);

      if (response.info) {
        setTodosCount(response.info);
      }
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

      <ConfigProvider
        theme={{
          components: {
            List: {
              itemPadding: '0',
            },
          },
        }}
      >
        <List
          className="todo-list"
          split={false}
          dataSource={todos}
          locale={{
            emptyText: <Empty description="В этом разделе пока нет задач" />,
          }}
          renderItem={(todo) => (
            <List.Item>
              <Todo
                id={todo.id}
                title={todo.title}
                isDone={todo.isDone}
                onTodosChanged={refreshTodos}
              />
            </List.Item>
          )}
        />
      </ConfigProvider>
    </>
  );
}
