import { memo, useState } from 'react';
import { Button, Checkbox, Form, Input, message, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

import { deleteTodo, editTodo } from '../api/http.ts';
import { MAX_TODO_TITLE_LENGTH, MIN_TODO_TITLE_LENGTH } from '../helpers/constants.ts';

type TodoProps = {
  id: number;
  title: string;
  isDone: boolean;
  onTodosChanged: () => Promise<void>;
};

type FieldType = {
  title: string;
};

function Todo({ id, title, isDone, onTodosChanged }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm<FieldType>();

  const handleStartEditing = (): void => {
    form.setFieldsValue({
      title,
    });

    setIsEditing(true);
  };

  const handleCancelEditing = (): void => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSaveEdit = async (values: FieldType): Promise<void> => {
    setIsLoading(true);

    try {
      await editTodo(id, {
        title: values.title.trim(),
      });

      await onTodosChanged();

      form.resetFields();
      setIsEditing(false);

      message.success('Задача изменена');
    } catch {
      message.error('Не удалось изменить задачу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await deleteTodo(id);
      await onTodosChanged();

      message.success('Задача удалена');
    } catch {
      message.error('Не удалось удалить задачу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await editTodo(id, {
        isDone: !isDone,
      });

      await onTodosChanged();
    } catch {
      message.error('Не удалось изменить статус задачи');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="item-todo">
      <Checkbox
        checked={isDone}
        disabled={isLoading}
        onChange={() => {
          void handleToggleTodo();
        }}
        aria-label={isDone ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
      />

      {isEditing ? (
        <Form<FieldType>
          form={form}
          className="edit-form"
          onFinish={handleSaveEdit}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="title"
            style={{ flex: 1, marginBottom: 0 }}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Введите задачу',
              },
              {
                min: MIN_TODO_TITLE_LENGTH,
                message: `Введите минимум ${MIN_TODO_TITLE_LENGTH} символа`,
              },
              {
                max: MAX_TODO_TITLE_LENGTH,
                message: `Введите максимум ${MAX_TODO_TITLE_LENGTH} символа`,
              },
            ]}
          >
            <Input autoFocus placeholder="Введите название задачи" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Сохранить
            </Button>

            <Button htmlType="button" onClick={handleCancelEditing} disabled={isLoading}>
              Отмена
            </Button>
          </Space>
        </Form>
      ) : (
        <>
          <div className="todo-content">
            <Typography.Text delete={isDone} {...(isDone ? { type: 'secondary' as const } : {})}>
              {title}
            </Typography.Text>
          </div>

          <div className="todo-actions">
            <Button
              icon={<FormOutlined />}
              onClick={handleStartEditing}
              type="primary"
              aria-label="Редактировать задачу"
              title="Редактировать"
            />

            <Popconfirm
              title="Удалить задачу?"
              description="Отменить это действие будет нельзя"
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{
                danger: true,
              }}
              onConfirm={handleDeleteTodo}
            >
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                loading={isLoading}
                aria-label="Удалить задачу"
                title="Удалить"
              />
            </Popconfirm>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Todo);
