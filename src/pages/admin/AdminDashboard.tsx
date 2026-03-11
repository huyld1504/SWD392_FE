import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Row, Col, Card, Button, Table, Tag, Typography, Space,
  Modal, Input, Popconfirm,
} from 'antd';
import {
  PlusOutlined, ThunderboltOutlined, CheckOutlined, CloseOutlined,
  ClockCircleOutlined, PayCircleOutlined,
  UserAddOutlined, MessageOutlined, WarningOutlined,
} from '@ant-design/icons';
import { useArticles, useApproveArticle, useRejectArticle } from '@/hooks/useArticles';
import { useFeedings, useScheduleFeeding, useTriggerFeeding } from '@/hooks/useFeeding';
import { walletApi } from '@/api/walletApi';
import type { Article, FeedingPeriod, FeedingStatus } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// --- Feeding status config ---------------------------------------------------
const FEEDING_STATUS: Record<FeedingStatus, { label: string; bg: string; color: string }> = {
  COMPLETED: { label: 'COMPLETED', bg: '#d1fae5', color: '#065f46' },
  EXECUTING: { label: 'EXECUTING', bg: '#dbeafe', color: '#1d4ed8' },
  PENDING:   { label: 'PENDING',   bg: '#f1f5f9', color: '#475569' },
  FAILED:    { label: 'FAILED',    bg: '#fee2e2', color: '#b91c1c' },
};

function FeedingStatusBadge({ status }: { status: FeedingStatus }) {
  const cfg = FEEDING_STATUS[status];
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
      background: cfg.bg, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {cfg.label}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // -- Article counts ---------------------------------------------------------
  const { data: pendingPage, isLoading: pendingLoading } = useArticles({
    page: 1, pageSize: 5, status: 'PENDING', sort: 'createdAt', direction: 'desc',
  });
  const { data: approvedPage } = useArticles({ page: 1, pageSize: 1, status: 'APPROVED' });
  const { data: rejectedPage } = useArticles({ page: 1, pageSize: 1, status: 'REJECTED' });
  const totalArticles =
    (pendingPage?.totalItems ?? 0) + (approvedPage?.totalItems ?? 0) + (rejectedPage?.totalItems ?? 0);

  // -- Wallet counts ----------------------------------------------------------
  const { data: activeWallets } = useQuery({
    queryKey: ['wallets', 'active'],
    queryFn: () => walletApi.getAllWallets({ status: 'ACTIVE', size: 1, page: 0 }),
  });
  const { data: lockedWallets } = useQuery({
    queryKey: ['wallets', 'locked'],
    queryFn: () => walletApi.getAllWallets({ status: 'LOCKED', size: 1, page: 0 }),
  });

  // -- Recent feedings --------------------------------------------------------
  const { data: feedingsPage } = useFeedings({ size: 3, page: 0 });
  const recentFeedings: FeedingPeriod[] = feedingsPage?.data ?? [];

  // -- Mutations --------------------------------------------------------------
  const { mutate: approve } = useApproveArticle();
  const { mutate: reject, isPending: rejecting } = useRejectArticle();
  const { mutate: scheduleFeed, isPending: scheduling } = useScheduleFeeding();
  const { mutate: triggerNow, isPending: triggering } = useTriggerFeeding();

  // -- Local state ------------------------------------------------------------
  const [rejectTarget, setRejectTarget] = useState<Article | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [createFeedOpen, setCreateFeedOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // -- Handlers ---------------------------------------------------------------
  const handleReject = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    reject(
      { id: rejectTarget.articleId, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setRejectReason('');
        },
      },
    );
  };

  const handleScheduleFeed = () => {
    if (!scheduledAt) return;
    scheduleFeed(
      { scheduledAt: new Date(scheduledAt).toISOString() },
      { onSuccess: () => { setCreateFeedOpen(false); setScheduledAt(''); } },
    );
  };

  // -- Table columns ----------------------------------------------------------
  const columns: ColumnsType<Article> = [
    {
      title: <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>TIÊU ĐỀ</span>,
      dataIndex: 'title',
      render: (title: string) => (
        <Text
          strong
          style={{ cursor: 'pointer', color: '#0f172a' }}
          onClick={() => navigate('/admin/articles')}
        >
          {title}
        </Text>
      ),
    },
    {
      title: <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>TÁC GIẢ</span>,
      dataIndex: ['author', 'name'],
      width: 140,
      render: (name: string) => <Text style={{ color: '#64748b' }}>{name}</Text>,
    },
    {
      title: <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>CHỦ ĐỀ</span>,
      dataIndex: 'topicName',
      width: 120,
      render: (name: string) => (
        <Tag style={{
          background: 'rgba(13,150,139,0.1)', color: '#0d968b',
          border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 10, textTransform: 'uppercase',
        }}>
          {name}
        </Tag>
      ),
    },
    {
      title: <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>NGÀY GỬI</span>,
      dataIndex: 'createdAt',
      width: 110,
      render: (d: string) => (
        <Text style={{ color: '#64748b', fontStyle: 'italic', fontSize: 13 }}>
          {format(new Date(d), 'dd/MM/yyyy', { locale: vi })}
        </Text>
      ),
    },
    {
      title: <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', float: 'right' }}>THAO TÁC</span>,
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Article) => (
        <Space style={{ justifyContent: 'flex-end', width: '100%', display: 'flex' }}>
          <Popconfirm
            title="Duyệt bài viết này?"
            onConfirm={() => approve(record.articleId)}
            okText="Duyệt"
            cancelText="Hủy"
            okButtonProps={{ style: { background: '#0d968b', borderColor: '#0d968b' } }}
          >
            <button
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckOutlined />
            </button>
          </Popconfirm>
          <button
            onClick={() => { setRejectTarget(record); setRejectReason(''); }}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CloseOutlined />
          </button>
        </Space>
      ),
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: 26 }}>Tổng quan hệ thống</Title>
          <Text style={{ color: '#64748b', fontSize: 14 }}>Chào mừng trở lại, đây là những gì đang diễn ra hôm nay.</Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateFeedOpen(true)}
            style={{ background: '#0d968b', borderColor: '#0d968b', borderRadius: 8, fontWeight: 600 }}
          >
            Tạo Feeding mới
          </Button>
          <Popconfirm
            title="Kích hoạt Feeding ngay?"
            description="Hệ thống sẽ phân phối BLUE coins cho tất cả học sinh ngay lập tức."
            onConfirm={() => triggerNow()}
            okText="Trigger"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<ThunderboltOutlined />}
              size="large"
              loading={triggering}
              style={{ background: '#f97316', borderColor: '#f97316', color: '#fff', borderRadius: 8, fontWeight: 600 }}
            >
              Trigger ngay
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* Stats grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {/* Total articles */}
        <Col xs={12} sm={8} lg={4}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Tổng bài viết</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{totalArticles.toLocaleString()}</div>
            <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 8, display: 'block' }}>Cập nhật vừa xong</Text>
          </Card>
        </Col>
        {/* Pending */}
        <Col xs={12} sm={8} lg={4}>
          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}
            styles={{ body: { padding: 20 } }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#f59e0b' }} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              background: '#fef3c7', color: '#b45309',
              fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
            }}>Mới</span>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Chờ duyệt</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b' }}>{pendingPage?.totalItems ?? 0}</div>
          </Card>
        </Col>
        {/* Approved */}
        <Col xs={12} sm={8} lg={4}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Đã duyệt</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981' }}>{(approvedPage?.totalItems ?? 0).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginTop: 4 }}>↑ 12%</div>
          </Card>
        </Col>
        {/* Rejected */}
        <Col xs={12} sm={8} lg={4}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Từ chối</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f43f5e' }}>{rejectedPage?.totalItems ?? 0}</div>
          </Card>
        </Col>
        {/* Active wallets */}
        <Col xs={12} sm={8} lg={4}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Tổng ví hoạt động</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{(activeWallets?.totalItems ?? 0).toLocaleString()}</div>
          </Card>
        </Col>
        {/* Locked wallets */}
        <Col xs={12} sm={8} lg={4}>
          <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0', borderLeft: '4px solid #f97316' }} styles={{ body: { padding: 20 } }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Ví bị khóa</Text>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{lockedWallets?.totalItems ?? 0}</div>
            <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700, marginTop: 4 }}>⚠ Cần kiểm tra</div>
          </Card>
        </Col>
      </Row>

      {/* Main content: pending table + feeding sidebar */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Pending articles table */}
        <Col xs={24} xl={16}>
          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
            styles={{ body: { padding: 0 } }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <ClockCircleOutlined style={{ color: '#0d968b' }} />
                  <span style={{ fontWeight: 700 }}>Bài viết chờ duyệt</span>
                </Space>
                <Button type="link" style={{ color: '#0d968b', fontWeight: 600, padding: 0, fontSize: 12 }} onClick={() => navigate('/admin/articles')}>
                  Xem tất cả
                </Button>
              </div>
            }
          >
            <Table<Article>
              dataSource={pendingPage?.data ?? []}
              columns={columns}
              rowKey="articleId"
              loading={pendingLoading}
              pagination={false}
              size="middle"
              locale={{ emptyText: 'Không có bài viết chờ duyệt' }}
            />
          </Card>
        </Col>

        {/* Recent feedings */}
        <Col xs={24} xl={8}>
          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#0d968b' }} />
                <span style={{ fontWeight: 700 }}>Feeding gần đây</span>
              </Space>
            }
          >
            <div style={{ padding: '12px 16px', flex: 1 }}>
              {recentFeedings.length === 0 ? (
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>Chưa có dữ liệu feeding.</Text>
              ) : (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {recentFeedings.map((f) => (
                    <div
                      key={f.periodId}
                      style={{
                        padding: 16, borderRadius: 12, border: '1px solid #f1f5f9',
                        background: '#fafafa', opacity: f.status === 'PENDING' ? 0.75 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <FeedingStatusBadge status={f.status} />
                        <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                          {f.status === 'EXECUTING'
                            ? 'Đang chạy...'
                            : f.executedAt
                              ? format(new Date(f.executedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })
                              : f.scheduledAt
                                ? format(new Date(f.scheduledAt), 'HH:mm - dd/MM/yyyy', { locale: vi })
                                : '--'}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Trigger Source</Text>
                          <Text style={{ fontWeight: 700, fontSize: 13 }}>{f.triggerSource}</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Học sinh</Text>
                          <Text style={{ fontWeight: 700, fontSize: 13 }}>
                            {f.totalStudents != null ? `${f.totalStudents.toLocaleString()} users` : '-- users'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </Space>
              )}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <Button type="link" style={{ color: '#64748b', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quản lý lịch Feeding →
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom quick-info bar */}
      <Row gutter={[16, 16]}>
        {[
          {
            icon: <PayCircleOutlined style={{ color: '#0d968b', fontSize: 20 }} />,
            bg: 'rgba(13,150,139,0.1)',
            label: 'BLUE Coins cấp hôm nay',
            value: recentFeedings
              .filter((f) => f.status === 'COMPLETED' && f.totalCoinsDistributed)
              .reduce((sum, f) => sum + (f.totalCoinsDistributed ?? 0), 0)
              .toLocaleString() || '--',
          },
          {
            icon: <UserAddOutlined style={{ color: '#d97706', fontSize: 20 }} />,
            bg: '#fef3c7',
            label: 'Thành viên mới',
            value: '--',
          },
          {
            icon: <MessageOutlined style={{ color: '#2563eb', fontSize: 20 }} />,
            bg: '#dbeafe',
            label: 'Bình luận mới',
            value: '--',
          },
          {
            icon: <WarningOutlined style={{ color: '#dc2626', fontSize: 20 }} />,
            bg: '#fee2e2',
            label: 'Báo cáo vi phạm',
            value: '--',
            valueColor: '#dc2626',
          },
        ].map((item) => (
          <Col xs={12} md={6} key={item.label}>
            <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 16 } }}>
              <Space size={16}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{item.label}</Text>
                  <Text strong style={{ fontSize: 18, color: item.valueColor }}>{item.value}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Reject modal */}
      <Modal
        open={!!rejectTarget}
        title="Từ chối bài viết"
        onCancel={() => { setRejectTarget(null); setRejectReason(''); }}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: rejecting, disabled: !rejectReason.trim() }}
      >
        <Text style={{ display: 'block', marginBottom: 12, color: '#64748b' }}>
          Bài viết: <strong>{rejectTarget?.title}</strong>
        </Text>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          maxLength={500}
          showCount
        />
      </Modal>

      {/* Create feeding modal */}
      <Modal
        open={createFeedOpen}
        title="Tạo lịch Feeding mới"
        onCancel={() => { setCreateFeedOpen(false); setScheduledAt(''); }}
        onOk={handleScheduleFeed}
        okText="Tạo lịch"
        cancelText="Hủy"
        okButtonProps={{
          loading: scheduling,
          disabled: !scheduledAt,
          style: { background: '#0d968b', borderColor: '#0d968b' },
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 600 }}>
            Thời gian thực hiện <span style={{ color: '#ef4444' }}>*</span>
          </Text>
        </div>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          style={{
            width: '100%', padding: '8px 12px',
            border: '1px solid #d9d9d9', borderRadius: 8,
            fontSize: 14, outline: 'none',
          }}
        />
        <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, display: 'block' }}>
          Hệ thống sẽ tự động phân phối BLUE coins cho toàn bộ học sinh vào thời điểm này.
        </Text>
      </Modal>
    </div>
  );
}
