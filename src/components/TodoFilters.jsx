export default function TodoFilters({ filteredTodos, setFilteredTodos, todosCount }) {
  return (
    <div>
      <button
        className={filteredTodos === 'all' ? 'active-tab' : ''}
        onClick={() => setFilteredTodos('all')}
      >
        Все ({todosCount.all})
      </button>
      <button
        className={filteredTodos === 'inWork' ? 'active-tab' : ''}
        onClick={() => setFilteredTodos('inWork')}
      >
        В работе ({todosCount.inWork})
      </button>
      <button
        className={filteredTodos === 'completed' ? 'active-tab' : ''}
        onClick={() => setFilteredTodos('completed')}
      >
        Сделано ({todosCount.completed})
      </button>
    </div>
  );
}
