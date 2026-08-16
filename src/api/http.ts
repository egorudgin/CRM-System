import axios from 'axios';

import type { MetaResponse, Todo, TodoFilter, TodoInfo, TodoRequest } from '../types/typesTodo.ts';

const api = axios.create({
  baseURL: 'https://easydev.club/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getTodos(filter: TodoFilter = 'all'): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: {
      filter,
    },
  });

  return response.data;
}

export async function createTodo(todo: TodoRequest): Promise<Todo> {
  const response = await api.post<Todo>('/todos', todo);

  return response.data;
}

export async function editTodo(id: number, changes: TodoRequest): Promise<Todo> {
  const response = await api.put<Todo>(`/todos/${id}`, changes);

  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
