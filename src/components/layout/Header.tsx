import { Layout, Input, Badge, Avatar, Dropdown, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  HeartFilled,
  LogoutOutlined,
  UserOutlined,
  GoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMyWallets } from '@/hooks/useWallets';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data: wallets } = useMyWallets();
  const mainWallet = wallets?.find((w) => w.walletType === 'MAIN');
  const earnedWallet = wallets?.find((w) => w.walletType === 'EARNED');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Admin';
      case 'LECTURE': return 'Giảng viên';
      default: return 'Sinh viên';
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'name',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.fullName}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: 64,
      }}
    >
      {/* Search */}


      {/* Right side */}
      <Space size={20} align="center">
        {/* BLUE balance — STUDENT only */}
        {user?.role === 'STUDENT' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#f0fdfb',
              border: '1px solid #99f6e4',
              borderRadius: 999,
              padding: '5px 14px',
            }}
          >
            <HeartFilled style={{ color: '#0d9488', fontSize: 12 }} />
            <Text style={{ color: '#0d9488', fontWeight: 700, fontSize: 12 }}>
              {mainWallet?.balance ?? 0} BLUE
            </Text>
          </div>
        )}

        {/* GOLD balance — LECTURE only */}
        {user?.role === 'LECTURE' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#fefce8',
              border: '1px solid #fde68a',
              borderRadius: 999,
              padding: '5px 14px',
            }}
          >
            <GoldOutlined style={{ color: '#d97706', fontSize: 12 }} />
            <Text style={{ color: '#d97706', fontWeight: 700, fontSize: 12 }}>
              {earnedWallet?.balance ?? 0} GOLD
            </Text>
          </div>
        )}

        {/* Notifications */}


        {/* User avatar + dropdown */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space
            size={10}
            style={{
              cursor: 'pointer',
              borderLeft: '1px solid #e2e8f0',
              paddingLeft: 16,
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: '14px' }}>
                {getRoleLabel()}
              </div>
            </div>
            <Avatar
              src={user?.avatarUrl}
              icon={!user?.avatarUrl && <UserOutlined />}
              style={{ background: '#ccfbf1', color: '#0d9488' }}
              size={36}
            />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
