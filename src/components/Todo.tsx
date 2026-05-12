import { useState } from 'react';
import { validateTodoTitle } from '../helpers/validateTodoTitle.js';
import { getTodos, editTodo, deleteTodo } from '../api/http.js';
import { Button, Input, Checkbox } from 'antd';
import type { TodosCount, TodoFilter, TodoTitle } from '../types/typesTodo.js';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

type TodoProps = {
  todo: TodoTitle;
  filteredTodos: TodoFilter;
  setTodos: React.Dispatch<React.SetStateAction<TodoTitle[]>>;
  setTodosCount: React.Dispatch<React.SetStateAction<TodosCount>>;
};

export default function Todo({ todo, filteredTodos, setTodos, setTodosCount }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [error, setError] = useState('');

  const toggleEditing = (): void => {
    setIsEditing(!isEditing);
    setEditedTitle(todo.title);
    setError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedTitle(value);

    if (value.trim().length === 0) {
      setError('');
      return;
    }

    const validatedError = validateTodoTitle(value);
    setError(validatedError);
  };

  const handleSaveEdit = async (): Promise<void> => {
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
        <Checkbox
          checked={todo.isDone}
          onChange={handleToggleTodo}
          aria-label={todo.isDone ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
        />
      </div>

      <div className="todo-content">
        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              type="text"
              onChange={handleTitleChange}
              status={error ? 'error' : ''}
              placeholder="Напишите задачу"
            />
            {error && <div className="input-error">{error}</div>}
          </>
        ) : (
          <div className={todo.isDone ? 'item-text strike' : 'item-text'}>{todo.title}</div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <Button onClick={handleSaveEdit} type="primary">
              Save
            </Button>
            <Button onClick={toggleEditing}>Cancel</Button>
          </>
        ) : (
          <>
            <Button
              icon={<FormOutlined />}
              onClick={toggleEditing}
              type="primary"
              size="large"
              aria-label="Редактировать задачу"
              title="Редактировать"
            ></Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteTodo}
              type="primary"
              danger
              size="large"
              aria-label="Удалить задачу"
              title="Удалить"
            ></Button>
          </>
        )}
      </div>
    </div>
  );
}
