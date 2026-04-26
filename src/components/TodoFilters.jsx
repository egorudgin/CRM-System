import Tab from '../ui-kit/Tab.jsx';

export default function TodoFilters({ filteredTodos, setFilteredTodos, todosCount }) {
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
