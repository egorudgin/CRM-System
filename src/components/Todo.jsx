import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import { getTodos, editTodo, deleteTodo } from '../api/http.js';
import CheckBox from '../ui-kit/CheckBox.jsx';
import Button from '../ui-kit/Button.jsx';
import IconButton from '../ui-kit/IconButton.jsx';
import Input from '../ui-kit/Input.jsx';

export default function Todo({ todo, filteredTodos, setTodos, setTodosCount }) {
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

    const validatedError = validateTodoTitle(value);
    setError(validatedError);
  };

  const handleSaveEdit = async () => {
    const validatedError = validateTodoTitle(editedTitle);

    if (validatedError) {
      setError(validatedError);
      return;
    }

    try {
      const editedTask = await editTodo(todo.id, { title: editedTitle.trim() });

      if (!editedTask) {
        return;
      }

      setTodos((prev) =>
        prev.map((currentTodo) => (currentTodo.id === todo.id ? editedTask : currentTodo)),
      );
      setIsEditing(false);
      setError('');
    } catch (error) {
      alert('Ошибка при редактировании задачи!');
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await deleteTodo(todo.id);
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при удалении задачи!');
    }
  };

  const handleToggleTodo = async () => {
    const nextIsDone = !todo.isDone;

    try {
      await editTodo(todo.id, { isDone: nextIsDone });
      const response = await getTodos(filteredTodos);
      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при изменени статуса задачи!');
    }
  };

  return (
    <div className="item-todo">
      <div>
        <CheckBox
          checked={todo.isDone}
          onChange={handleToggleTodo}
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
              onClick={handleDeleteTodo}
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
