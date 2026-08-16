import { memo, useCallback, useMemo } from 'react';
import { Tabs } from 'antd';

import type { TodoFilter, TodoInfo } from '../types/typesTodo.ts';

type TodoFiltersProps = {
  filteredTodos: TodoFilter;
  todosCount: TodoInfo;
  onFilterChange: (filter: TodoFilter) => void;
};

function TodoFilters({ filteredTodos, todosCount, onFilterChange }: TodoFiltersProps) {
  const items = useMemo(
    () => [
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
    ],
    [todosCount.all, todosCount.completed, todosCount.inWork],
  );

  const handleFilterChange = useCallback(
    (key: string): void => {
      onFilterChange(key as TodoFilter);
    },
    [onFilterChange],
  );

  return (
    <Tabs
      className="todo-filters"
      activeKey={filteredTodos}
      items={items}
      onChange={handleFilterChange}
    />
  );
}

export default memo(TodoFilters);
