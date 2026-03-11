import { useState } from 'react';
import {
  Table, Button, Space, Select, Typography, Tag, Card, Row, Col, Popconfirm, Statistic,
} from 'antd';
import { LockOutlined, UnlockOutlined, WalletOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAllWallets, useUpdateWalletStatus } from '@/hooks/useWallets';
import type { Wallet, WalletStatus, WalletType } from '@/types';
import { CopyOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

export default function AdminWalletsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<WalletStatus | undefined>();
  const [typeFilter, setTypeFilter] = useState<WalletType | undefined>();

  const { data, isLoading } = useAllWallets({
    page: page - 1,
    size: 10,
    status: statusFilter,
    walletType: typeFilter,
  });
  const { mutate: updateStatus } = useUpdateWalletStatus();

  const wallets = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;

  const columns: ColumnsType<Wallet> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: Wallet, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'ID Ví',
      dataIndex: 'walletId',
      width: 120,
      render: (id: number) => (
        <Text code style={{ fontSize: 12 }}>WS-{id.toString().padStart(6, '0')}</Text>
      ),
    },
   {
  title: 'Tên',
  dataIndex: 'userInfo',
  width: 180,
  render: (userInfo: any) => (
    <Space direction="vertical" size={0}>
      <Text strong style={{ display: 'block' }}>{userInfo?.name || 'N/A'}</Text>
      <Text style={{ color: '#64748b', fontSize: 12 }}>ID: {userInfo?.userId}</Text>
    </Space>
  ),
},

// THÊM CỘT EMAIL MỚI (sau cột Tên)
{
  title: 'Email',
  dataIndex: 'userInfo',
  width: 220,
  render: (userInfo: any) => (
    <Text style={{ color: '#475569', fontSize: 13 }} 
          copyable={{ icon: [<CopyOutlined />] }}>
      {userInfo?.email || 'Chưa có'}
    </Text>
  ),
},
    {
      title: 'Loại ví',
      dataIndex: 'walletType',
      width: 110,
      render: (type: WalletType) => (
        <Tag style={{
          background: type === 'MAIN' ? 'rgba(13,148,136,0.1)' : '#f0fdf4',
          color: type === 'MAIN' ? '#0d9488' : '#16a34a',
          border: 'none', fontWeight: 700,
        }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      width: 140,
      sorter: (a: Wallet, b: Wallet) => a.balance - b.balance,
      render: (balance: number) => (
        <Space size={4}>
          <Text strong style={{ fontSize: 15, color: '#0d9488' }}>
            {balance.toLocaleString()}
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>💙 BLUE</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (status: WalletStatus) => (
        <Tag
          icon={status === 'ACTIVE' ? <UnlockOutlined /> : <LockOutlined />}
          color={status === 'ACTIVE' ? 'success' : 'error'}
          style={{ fontWeight: 600 }}
        >
          {status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    
    {
      title: 'Hành động',
      key: 'actions',
      width: 130,
      render: (_: unknown, record: Wallet) =>
        record.status === 'ACTIVE' ? (
          <Popconfirm
            title="Khóa ví này?"
            description="Người dùng sẽ không thể thực hiện giao dịch."
            onConfirm={() => updateStatus({ walletId: record.walletId, status: 'LOCKED' })}
            okText="Khóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<LockOutlined />}
              danger
              size="small"
              style={{ fontWeight: 600 }}
            >
              Khóa ví
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Mở khóa ví này?"
            onConfirm={() => updateStatus({ walletId: record.walletId, status: 'ACTIVE' })}
            okText="Mở khóa"
            cancelText="Hủy"
            okButtonProps={{ style: { background: '#0d9488', borderColor: '#0d9488' } }}
          >
            <Button
              type="text"
              icon={<UnlockOutlined />}
              size="small"
              style={{ color: '#0d9488', fontWeight: 600 }}
            >
              Mở khóa
            </Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 24, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Ví</Title>
          <Text style={{ color: '#64748b' }}>Xem và quản lý trạng thái ví của tất cả người dùng</Text>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{
              fontSize: 10, fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8,
            }}>
              Tổng số ví
            </Text>
            <Statistic
              value={totalItems}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#0f172a', fontWeight: 800, fontSize: 26 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{
              fontSize: 10, fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8,
            }}>
              Tổng BLUE (trang này)
            </Text>
            <Statistic
              value={wallets.reduce((s, w) => s + w.balance, 0)}
              suffix=" BLUE"
              valueStyle={{ color: '#0d9488', fontWeight: 800, fontSize: 26 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', borderLeft: '4px solid #f97316' }} styles={{ body: { padding: 20 } }}>
            <Text style={{
              fontSize: 10, fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8,
            }}>
              Ví bị khóa (trang này)
            </Text>
            <Statistic
              value={wallets.filter(w => w.status === 'LOCKED').length}
              valueStyle={{ color: '#f97316', fontWeight: 800, fontSize: 26 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <Row gutter={[16, 12]} align="middle" wrap>
          <Col>
            <Text strong>Lọc:</Text>
          </Col>
          <Col style={{ minWidth: 180 }}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Loại ví"
              allowClear
              value={typeFilter}
              onChange={(val) => { setTypeFilter(val); setPage(1); }}
            >
              <Select.Option value="MAIN">MAIN</Select.Option>
              <Select.Option value="EARNED">EARNED</Select.Option>
            </Select>
          </Col>
          <Col style={{ minWidth: 180 }}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Trạng thái"
              allowClear
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
            >
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="LOCKED">Bị khóa</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
        <Table<Wallet>
          dataSource={wallets}
          columns={columns}
          rowKey="walletId"
          loading={isLoading}
          pagination={{
            current: page,
            total: totalItems,
            pageSize: 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} ví`,
          }}
          locale={{ emptyText: 'Không có ví nào' }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
