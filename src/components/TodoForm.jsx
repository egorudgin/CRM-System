import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import { getTodos, createTodo } from '../api/http.js';
import Input from '../ui-kit/Input.jsx';
import Button from '../ui-kit/Button.jsx';

export default function TodoForm({ filteredTodos, setTodos, setTodosCount }) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.trim().length === 0) {
      setError('');
      return;
    }

    const validatedError = validateTodoTitle(value);
    setError(validatedError);
  };

  const handleAddTodo = async (e) => {
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
      <Input
        className="input-task"
        value={userInput}
        type="text"
        onChange={handleChange}
        placeholder="Task to be done..."
        required
      />

      {error && <div className="input-error">{error}</div>}

      <Button className="add-button" type="submit" variant="primary">
        Add
      </Button>
    </form>
  );
}
