import { useState } from 'react';

export default function Todo({ todo, handleToggleTodo, handleDeleteTodo, handleEditTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditedTitle(todo.title);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    handleEditTodo(todo.id, editedTitle);
  };

  return (
    <div key={todo.id} className="item-todo">
      <div>
        <input type="checkbox" checked={todo.isDone} onChange={() => handleToggleTodo(todo.id)} />
      </div>
      {isEditing ? (
        <input value={editedTitle} type="text" onChange={handleTitleChange} />
      ) : (
        <div className={todo.isDone ? 'item-text strike' : 'item-text'}>{todo.title}</div>
      )}

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
