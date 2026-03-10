import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppSidebar from './Sidebar';
import AppHeader from './Header';
import { useUIStore } from '@/stores/uiStore';

const { Content } = Layout;

export default function MainLayout() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout
        style={{
          marginLeft: isSidebarOpen ? 256 : 80,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <AppHeader />
        <Content
          style={{
            padding: 32,
            background: '#f6f8f8',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
