import { useCallback } from 'react';
import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps } from 'antd';

import TodoPage from './pages/TodoPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';

const menuItems = [
  {
    key: '/',
    icon: <UnorderedListOutlined />,
    label: 'Список задач',
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Профиль',
  },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      navigate(key);
    },
    [navigate],
  );

  const selectedMenuKey = location.pathname === '/profile' ? '/profile' : '/';

  return (
    <Layout className="app-layout">
      <Layout.Sider
        className="app-sider"
        width={220}
        theme="light"
        breakpoint="md"
        collapsedWidth={0}
      >
        <Menu
          className="app-menu"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Layout.Sider>

      <Layout>
        <Layout.Content className="app-content">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<TodoPage />} />

              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
