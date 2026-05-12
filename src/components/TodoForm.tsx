import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import { getTodos, createTodo } from '../api/http.js';
import { Button, Input, Space } from 'antd';
import type { TodosCount, TodoFilter, TodoTitle } from '../types/typesTodo.js';

type TodoFormProps = {
  filteredTodos: TodoFilter;
  setTodos: React.Dispatch<React.SetStateAction<TodoTitle[]>>;
  setTodosCount: React.Dispatch<React.SetStateAction<TodosCount>>;
};

export default function TodoForm({ filteredTodos, setTodos, setTodosCount }: TodoFormProps) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserInput(value);

    if (value.trim().length === 0) {
      setError('');
      return;
    }

    const validatedError = validateTodoTitle(value);
    setError(validatedError);
  };

  const handleAddTodo = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validatedError = validateTodoTitle(userInput);

    if (validatedError) {
      setError(validatedError);
      return;
    }

    try {
      await createTodo(userInput.trim());
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
      setUserInput('');
      setError('');
    } catch (error) {
      alert('Ошибка при добавлении задачи!');
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={userInput}
          type="text"
          onChange={handleChange}
          status={error ? 'error' : ''}
          placeholder="Task to be done..."
          required
        />

        <Button className="add-button" type="primary" htmlType="submit">
          Add
        </Button>
      </Space.Compact>
      {error && <div className="input-error">{error}</div>}
    </form>
  );
}
