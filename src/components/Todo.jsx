import { useState } from 'react';

export default function Todo({ todo, handleToggleTodo, handleDeleteTodo, handleEditTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [error, setError] = useState('');

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditedTitle(todo.title);
    setError('');
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setEditedTitle(value);
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

  const handleSaveEdit = async () => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle.length < 2) {
      setError('Минимум 2 символа');
      return;
    }
    if (trimmedTitle.length > 64) {
      setError('Максимум 64 символа');
      return;
    }
    const isSaved = await handleEditTodo(todo.id, trimmedTitle);
    if (isSaved) {
      setIsEditing(false);
      setError('');
    }
  };

  return (
    <div className="item-todo">
      <div>
        <input type="checkbox" checked={todo.isDone} onChange={() => handleToggleTodo(todo.id)} />
      </div>

      <div style={{ flex: 1 }}>
        {isEditing ? (
          <>
            <input value={editedTitle} type="text" onChange={handleTitleChange} />
            {error && <div className="input-error">{error}</div>}
          </>
        ) : (
          <div className={todo.isDone ? 'item-text strike' : 'item-text'}>{todo.title}</div>
        )}
      </div>

      {isEditing ? (
        <div>
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={toggleEditing}>Cancel</button>
        </div>
      ) : (
        <button onClick={toggleEditing}>Edit</button>
      )}

      <div className="delete" onClick={() => handleDeleteTodo(todo.id)}>
        Х
      </div>
    </div>
  );
}
