import { memo, useState } from 'react';
import { Button, Form, Input, message, Space } from 'antd';

import { createTodo } from '../api/http.js';

type TodoFormProps = {
  onTodosChanged: () => Promise<void>;
};

type FieldType = {
  title: string;
};

function TodoForm({ onTodosChanged }: TodoFormProps) {
  const [form] = Form.useForm<FieldType>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTodo = async (values: FieldType): Promise<void> => {
    setIsSubmitting(true);

    try {
      await createTodo(values.title.trim());
      await onTodosChanged();

      form.resetFields();
      message.success('Задача добавлена');
    } catch {
      message.error('Не удалось добавить задачу');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<FieldType>
      form={form}
      className="todo-create-form"
      onFinish={handleAddTodo}
      autoComplete="off"
    >
      <Space.Compact style={{ width: '100%' }}>
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
          <Input placeholder="Введите новую задачу" />
        </Form.Item>

        <Button className="add-button" type="primary" htmlType="submit" loading={isSubmitting}>
          Добавить
        </Button>
      </Space.Compact>
    </Form>
  );
}

export default memo(TodoForm);
