import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { getTodos, editTodo, deleteTodo } from '../api/http.js';
import { Button, Input, Checkbox, Form } from 'antd';
import type { TodosCount, TodoFilter, TodoTitle } from '../types/typesTodo.js';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

type TodoProps = {
  todo: TodoTitle;
  filteredTodos: TodoFilter;
  setTodos: Dispatch<SetStateAction<TodoTitle[]>>;
  setTodosCount: Dispatch<SetStateAction<TodosCount>>;
};

type FieldType = {
  title: string;
};

export default function Todo({ todo, filteredTodos, setTodos, setTodosCount }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<FieldType>();

  const handleStartEditing = (): void => {
    form.setFieldsValue({
      title: todo.title,
    });

    setIsEditing(true);
  };

  const handleCancelEditing = (): void => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSaveEdit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();

      const editedTask = await editTodo(todo.id, {
        title: values.title.trim(),
      });

      setTodos((prev) =>
        prev.map((currentTodo) => (currentTodo.id === todo.id ? editedTask : currentTodo)),
      );

      form.resetFields();
      setIsEditing(false);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'errorFields' in error) {
        return;
      }

      alert('Ошибка при редактировании задачи!');
    }
  };

  const handleDeleteTodo = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id);

      const response = await getTodos(filteredTodos);

      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при удалении задачи!');
    }
  };

  const handleToggleTodo = async (): Promise<void> => {
    const nextIsDone = !todo.isDone;

    try {
      await editTodo(todo.id, { isDone: nextIsDone });

      const response = await getTodos(filteredTodos);

      setTodos(response.todos);
      setTodosCount(response.todosCount);
    } catch (error) {
      alert('Ошибка при изменении статуса задачи!');
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
          <Form form={form} component={false}>
            <Form.Item<FieldType>
              name="title"
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: 'Введите свою задачу!',
                },
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }

                    const trimmedTitle = value.trim();

                    if (trimmedTitle.length < 2) {
                      return Promise.reject(new Error('Минимум 2 символа'));
                    }

                    if (trimmedTitle.length > 64) {
                      return Promise.reject(new Error('Максимум 64 символа'));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Напишите задачу" onPressEnter={handleSaveEdit} />
            </Form.Item>
          </Form>
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
            <Button onClick={handleCancelEditing}>Cancel</Button>
          </>
        ) : (
          <>
            <Button
              icon={<FormOutlined />}
              onClick={handleStartEditing}
              type="primary"
              size="large"
              aria-label="Редактировать задачу"
              title="Редактировать"
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteTodo}
              type="primary"
              danger
              size="large"
              aria-label="Удалить задачу"
              title="Удалить"
            />
          </>
        )}
      </div>
    </div>
  );
}
