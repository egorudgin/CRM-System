import { Routes, Route, NavLink } from 'react-router-dom';
import TodoPage from './pages/TodoPage.js';
import ProfilePage from './pages/ProfilePage.js';

export default function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Список задач
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Профиль
          </NavLink>
        </nav>
      </aside>

      <main className="App">
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}
