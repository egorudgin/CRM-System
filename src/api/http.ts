import axios from 'axios';

import type {
  TodoTitle,
  TodoFilter,
  GetTodosResponse,
  EditTodoChanges,
  TodosCount,
} from '../types/typesTodo';

type GetTodosApiResponse = {
  data: TodoTitle[];
  info: TodosCount;
};

const api = axios.create({
  baseURL: 'https://easydev.club/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getTodos(filter: TodoFilter = 'all'): Promise<GetTodosResponse> {
  const response = await api.get<GetTodosApiResponse>('/todos', {
    params: {
      filter,
    },
  });

  return {
    todos: response.data.data,
    todosCount: response.data.info,
  };
}

export async function createTodo(title: string): Promise<TodoTitle> {
  const response = await api.post<TodoTitle>('/todos', {
    title,
    isDone: false,
  });

  return response.data;
}

export async function editTodo(id: number, changes: EditTodoChanges): Promise<TodoTitle> {
  const response = await api.put<TodoTitle>(`/todos/${id}`, changes);

  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
