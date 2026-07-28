import { memo, useState } from 'react';
import { Button, Checkbox, Form, Input, message, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

import { deleteTodo, editTodo } from '../api/http.js';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

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
    setIsSaving(true);

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
      setIsSaving(false);
    }
  };

  const handleDeleteTodo = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      await deleteTodo(id);
      await onTodosChanged();

      message.success('Задача удалена');
    } catch {
      message.error('Не удалось удалить задачу');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleTodo = async (): Promise<void> => {
    setIsToggling(true);

    try {
      await editTodo(id, {
        isDone: !isDone,
      });

      await onTodosChanged();
    } catch {
      message.error('Не удалось изменить статус задачи');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="item-todo">
      <Checkbox
        checked={isDone}
        disabled={isToggling}
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
                validator(_, value) {
                  const trimmedTitle = value?.trim() ?? '';

                  if (!trimmedTitle) {
                    return Promise.resolve();
                  }

                  if (trimmedTitle.length < 2) {
                    return Promise.reject(new Error('Введите минимум 2 символа'));
                  }

                  if (trimmedTitle.length > 64) {
                    return Promise.reject(new Error('Введите максимум 64 символа'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input autoFocus placeholder="Введите название задачи" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={isSaving}>
              Сохранить
            </Button>

            <Button htmlType="button" onClick={handleCancelEditing} disabled={isSaving}>
              Отмена
            </Button>
          </Space>
        </Form>
      ) : (
        <>
          <div className="todo-content">
            <Typography.Text delete={isDone} type={isDone ? 'secondary' : undefined}>
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
                loading={isDeleting}
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
