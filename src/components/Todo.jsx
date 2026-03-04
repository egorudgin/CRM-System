import { useState } from 'react';

export default function ToDo({ todo, toggleTask, removeTask, changedTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.title);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleOnChange = (e) => {
    setEditedTask(e.target.value);
  };

  const saveTask = () => {
    setIsEditing(false);
    changedTask(todo.id, editedTask);
  };

  return (
    <div key={todo.id} className="item-todo">
      <div>
        <input type="checkbox" checked={todo.isDone} onChange={() => toggleTask(todo.id)} />
      </div>
      {isEditing ? (
        <input value={editedTask} type="text" onChange={handleOnChange} />
      ) : (
        <div className={todo.isDone ? 'item-text strike' : 'item-text'}>{todo.title}</div>
      )}

      {isEditing ? (
        <div>
          <button onClick={saveTask}>Save</button>
          <button onClick={toggleEditing}>Cancel</button>
        </div>
      ) : (
        <button onClick={toggleEditing}>Edit</button>
      )}
      <div className="delete" onClick={() => removeTask(todo.id)}>
        Х
      </div>
    </div>
  );
}
