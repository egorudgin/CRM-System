import Tab from '..//ui-kit/Tab.js';
import type { TodosCount, TodoFilter } from '../types/typesTodo.js';

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
  return (
    <div>
      <Tab isActive={filteredTodos === 'all'} onClick={() => setFilteredTodos('all')}>
        Все ({todosCount.all})
      </Tab>

      <Tab isActive={filteredTodos === 'inWork'} onClick={() => setFilteredTodos('inWork')}>
        В работе ({todosCount.inWork})
      </Tab>

      <Tab isActive={filteredTodos === 'completed'} onClick={() => setFilteredTodos('completed')}>
        Сделано ({todosCount.completed})
      </Tab>
    </div>
  );
}
