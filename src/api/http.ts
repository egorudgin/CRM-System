import axios from 'axios';

import type {
  TodoTitle,
  TodoFilter,
  GetTodosResponse,
  EditTodoChanges,
} from '../types/typesTodo.js';

export async function getTodos(filter: TodoFilter = 'all'): Promise<GetTodosResponse> {
  const response = await axios.get('https://easydev.club/api/v1/todos', {
    params: {
      filter,
    },
  });

  const resData = response.data;

  return {
    todos: resData.data,
    todosCount: resData.info,
  };
}

export async function createTodo(title: string): Promise<TodoTitle> {
  const response = await axios.post('https://easydev.club/api/v1/todos', {
    title,
    isDone: false,
  });

  return response.data;
}

export async function editTodo(id: number, changes: EditTodoChanges): Promise<TodoTitle> {
  const response = await axios.put(`https://easydev.club/api/v1/todos/${id}`, changes);

  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await axios.delete(`https://easydev.club/api/v1/todos/${id}`);
}
