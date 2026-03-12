import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import {
  DashboardOutlined,
  FileTextOutlined,
  BookOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  HeartOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  WalletOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const makeItem = (label: React.ReactNode, key: string, icon: React.ReactNode): MenuItem => ({
  key,
  icon,
  label,
});

const studentItems: MenuItem[] = [
  makeItem(<Link to="/student/dashboard">Dashboard</Link>, '/student/dashboard', <DashboardOutlined />),
  makeItem(<Link to="/student/articles">Bài viết</Link>, '/student/articles', <BookOutlined />),
  makeItem(<Link to="/student/bookmarks">Bài đã lưu</Link>, '/student/bookmarks', <SaveOutlined />),
  makeItem(<Link to="/student/wallet">Lịch sử donate</Link>, '/student/wallet ', <HistoryOutlined />),
  makeItem(<Link to="/student/my-articles">Bài viết của tôi</Link>, '/student/my-articles', <HeartOutlined />),
];

const lectureItems: MenuItem[] = [
  makeItem(<Link to="/lecture/dashboard">Dashboard</Link>, '/lecture/dashboard', <DashboardOutlined />),
  makeItem(<Link to="/lecture/articles">Bài viết của tôi</Link>, '/lecture/articles', <FileTextOutlined />),
  makeItem(<Link to="/lecture/articles/new">Tạo bài viết</Link>, '/lecture/articles/new', <PlusCircleOutlined />),
  makeItem(<Link to="/lecture/review">Duyệt bài viết</Link>, '/lecture/review', <CheckCircleOutlined />),
  makeItem(<Link to="/lecture/all-articles">Tất cả bài viết</Link>, '/lecture/all-articles', <BookOutlined />),
  makeItem(<Link to="/lecture/wallet">Ví của tôi</Link>, '/lecture/wallet', <WalletOutlined />),
  makeItem(<Link to="/lecture/leaderboard">Bảng xếp hạng</Link>, '/lecture/leaderboard', <TrophyOutlined />),
];

const adminItems: MenuItem[] = [
  makeItem(<Link to="/admin/dashboard">Dashboard</Link>, '/admin/dashboard', <DashboardOutlined />),
  makeItem(<Link to="/admin/articles">Quản lý bài viết</Link>, '/admin/articles', <FileTextOutlined />),
  makeItem(<Link to="/admin/subjects">Môn học</Link>, '/admin/subjects', <AppstoreOutlined />),
];

const bottomItems: MenuItem[] = [
  makeItem(<Link to="/settings">Cài đặt</Link>, '/settings', <SettingOutlined />),
];

export default function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const getNavItems = (): MenuItem[] => {
    switch (user?.role) {
      case 'LECTURE': return lectureItems;
      case 'ADMIN': return adminItems;
      default: return studentItems;
    }
  };

  return (
    <Sider
      collapsed={!isSidebarOpen}
      collapsedWidth={80}
      width={256}
      style={{
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <div
          onClick={toggleSidebar}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: isSidebarOpen ? '0 20px' : '0',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            borderBottom: '1px solid #e2e8f0',
            gap: 12,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#0d9488',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            E
          </div>
          {isSidebarOpen && (
            <Text strong style={{ fontSize: 18, color: '#0d9488', whiteSpace: 'nowrap' }}>
              EduShare
            </Text>
          )}
        </div>

        {/* Main Nav */}
        <div style={{ flex: 1, overflow: 'hidden auto' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getNavItems()}
            inlineCollapsed={!isSidebarOpen}
            style={{
              borderRight: 'none',
              paddingTop: 8,
            }}
          />
        </div>

        {/* Settings at bottom */}
        <div style={{ borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={bottomItems}
            inlineCollapsed={!isSidebarOpen}
            style={{ borderRight: 'none' }}
          />
        </div>
      </div>
    </Sider>
  );
}
