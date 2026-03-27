import { useState } from 'react';

export default function TodoForm({ handleAddTodo }) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      setError('');
      return;
    }
    if (trimmedValue.length < 2) {
      setError('Минимум 2 символа');
      return;
    }
    if (trimmedValue.length > 64) {
      setError('Максимум 64 символа');
      return;
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput.length < 2) {
      setError('Минимум 2 символа');
      return;
    }
    if (trimmedUserInput.length > 64) {
      setError('Максимум 64 символа');
      return;
    }
    const isCreated = await handleAddTodo(trimmedUserInput);
    if (isCreated) {
      setUserInput('');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input-task"
        value={userInput}
        type="text"
        onChange={handleChange}
        placeholder="Task to be done..."
        required
      />
      {error && <div className="input-error">{error}</div>}
      <button className="add-button">Add</button>
    </form>
  );
}
