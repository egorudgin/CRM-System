import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import type { TodoFilter, TodosCount } from '../types/typesTodo.js';

type TodoFiltersProps = {
  filteredTodos: TodoFilter;
  setFilteredTodos: React.Dispatch<React.SetStateAction<TodoFilter>>;
  todosCount: TodosCount;
};

export default function TodoFilters({
  filteredTodos,
  setFilteredTodos,
  todosCount,
}: TodoFiltersProps) {
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Все (${todosCount.all})`,
    },
    {
      key: 'inWork',
      label: `В работе (${todosCount.inWork})`,
    },
    {
      key: 'completed',
      label: `Сделано (${todosCount.completed})`,
    },
  ];

  return (
    <Tabs
      activeKey={filteredTodos}
      items={items}
      onChange={(key) => setFilteredTodos(key as TodoFilter)}
    />
  );
}
