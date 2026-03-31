import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import CheckBox from '../ui-kit/CheckBox.jsx';
import Button from '../ui-kit/Button.jsx';
import IconButton from '../ui-kit/IconButton.jsx';
import Input from '../ui-kit/Input.jsx';

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

    if (value.trim().length === 0) {
      setError('');
      return;
    }

    const errorMessage = validateTodoTitle(value);
    setError(errorMessage);
  };

  const handleSaveEdit = async () => {
    const errorMessage = validateTodoTitle(editedTitle);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const isSaved = await handleEditTodo(todo.id, editedTitle.trim());

    if (isSaved) {
      setIsEditing(false);
      setError('');
    }
  };

  return (
    <div className="item-todo">
      <div>
        <CheckBox
          checked={todo.isDone}
          onChange={() => handleToggleTodo(todo.id)}
          aria-label={todo.isDone ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
        />
      </div>

      <div className="todo-content">
        {isEditing ? (
          <>
            <Input value={editedTitle} type="text" onChange={handleTitleChange} />
            {error && <div className="input-error">{error}</div>}
          </>
        ) : (
          <div className={todo.isDone ? 'item-text strike' : 'item-text'}>{todo.title}</div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <Button className="todo-action-btn save-btn" onClick={handleSaveEdit} variant="ghost">
              Save
            </Button>
            <Button className="todo-action-btn cancel-btn" onClick={toggleEditing} variant="ghost">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <IconButton
              className="edit-btn"
              onClick={toggleEditing}
              variant="primary"
              aria-label="Редактировать задачу"
              title="Редактировать"
            >
              <svg viewBox="0 0 24 24" className="todo-icon-svg" aria-hidden="true">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l8.06-8.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.13 1.13 3.75 3.75 1.14-1.13z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>

            <IconButton
              className="delete-btn"
              onClick={() => handleDeleteTodo(todo.id)}
              variant="danger"
              aria-label="Удалить задачу"
              title="Удалить"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                delete
              </span>
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
}
