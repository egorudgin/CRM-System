import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import Input from '../ui-kit/Input.jsx';
import Button from '../ui-kit/Button.jsx';

export default function TodoForm({ handleAddTodo }) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.trim().length === 0) {
      setError('');
      return;
    }

    const errorMessage = validateTodoTitle(value);
    setError(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateTodoTitle(userInput);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const isCreated = await handleAddTodo(userInput.trim());

    if (isCreated) {
      setUserInput('');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
