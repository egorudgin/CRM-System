import { getTodos, createTodo } from '../api/http.js';
import { Button, Input, Space, Form } from 'antd';
import type { TodosCount, TodoFilter, TodoTitle } from '../types/typesTodo.js';

type TodoFormProps = {
  filteredTodos: TodoFilter;
  setTodos: React.Dispatch<React.SetStateAction<TodoTitle[]>>;
  setTodosCount: React.Dispatch<React.SetStateAction<TodosCount>>;
};

type FieldType = {
  title: string;
};

export default function TodoForm({ filteredTodos, setTodos, setTodosCount }: TodoFormProps) {
  const [form] = Form.useForm<FieldType>();

  const handleAddTodo = async (values: FieldType): Promise<void> => {
    try {
      await createTodo(values.title.trim());

      const response = await getTodos(filteredTodos);

      setTodos(response.todos);
      setTodosCount(response.todosCount);

      form.resetFields();
    } catch (error) {
      alert('Ошибка при добавлении задачи!');
    }
  };

  return (
    <Form form={form} onFinish={handleAddTodo}>
      <Space.Compact style={{ width: '100%' }}>
        <Form.Item<FieldType>
          name="title"
          style={{ flex: 1, marginBottom: 0 }}
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
                const trimmedTitle = value.trim() || '';

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
          <Input placeholder="Task to be done..." />
        </Form.Item>

        <Button className="add-button" type="primary" htmlType="submit">
          Add
        </Button>
      </Space.Compact>
    </Form>
  );
}
