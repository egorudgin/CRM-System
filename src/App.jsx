import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

// тестовые страницы
function Home() {
  return <h2>Главная страница</h2>;
}

function About() {
  return <h2>Страница About</h2>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* меню */}
      <nav style={{ display: 'flex', gap: 10 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* маршруты */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div>
                <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>

              <h1>Vite + React</h1>

              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
              </div>
            </>
          }
        />

        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
