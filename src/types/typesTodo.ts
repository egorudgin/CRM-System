export type TodoTitle = {
  id: number;
  title: string;
  isDone: boolean;
};

export type TodoFilter = 'all' | 'inWork' | 'completed';

export type TodosCount = {
  all: number;
  completed: number;
  inWork: number;
};

export type GetTodosResponse = {
  todos: TodoTitle[];
  todosCount: TodosCount;
};

export type EditTodoChanges = {
  title?: string;
  isDone?: boolean;
};
