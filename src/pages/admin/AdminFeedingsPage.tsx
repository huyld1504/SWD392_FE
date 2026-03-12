import { useState } from 'react';
import {
  Table, Button, Space, Select, Typography, Tag, Card, Row, Col,
  Popconfirm, Statistic, Modal,
} from 'antd';
import {
  ThunderboltOutlined, PlusOutlined, DeleteOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFeedings, useScheduleFeeding, useTriggerFeeding, useDeleteFeeding } from '@/hooks/useFeeding';
import type { FeedingPeriod, FeedingStatus } from '@/types';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<FeedingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  COMPLETED: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleOutlined /> },
  EXECUTING:  { label: 'Đang chạy',  color: 'processing', icon: <SyncOutlined spin /> },
  PENDING:    { label: 'Chờ thực hiện', color: 'default', icon: <ClockCircleOutlined /> },
  FAILED:     { label: 'Thất bại',   color: 'error', icon: <CloseCircleOutlined /> },
};

export default function AdminFeedingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FeedingStatus | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  const { data, isLoading } = useFeedings({ page: page - 1, size: 10, status: statusFilter });
  const { mutate: trigger, isPending: triggering } = useTriggerFeeding();
  const { mutate: schedule, isPending: scheduling } = useScheduleFeeding();
  const { mutate: deleteFeeding } = useDeleteFeeding();

  const items = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;

  const handleSchedule = () => {
    if (!scheduledAt) return;
    schedule(
      { scheduledAt: new Date(scheduledAt).toISOString() },
      { onSuccess: () => { setCreateOpen(false); setScheduledAt(''); } },
    );
  };

  const columns: ColumnsType<FeedingPeriod> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: FeedingPeriod, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 160,
      render: (status: FeedingStatus) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <Tag icon={cfg.icon} color={cfg.color} style={{ fontWeight: 600 }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Nguồn kích hoạt',
      dataIndex: 'triggerSource',
      width: 160,
      render: (src: string) => (
        <Tag style={{
          background: src === 'MANUAL_ADMIN' ? '#eff6ff' : '#f0fdf4',
          color: src === 'MANUAL_ADMIN' ? '#2563eb' : '#16a34a',
          border: 'none', fontWeight: 700,
        }}>
          {src === 'MANUAL_ADMIN' ? '🖐 Thủ công' : '🤖 Tự động'}
        </Tag>
      ),
    },
    {
      title: 'Lên lịch lúc',
      dataIndex: 'scheduledAt',
      width: 170,
      render: (d: string | undefined) => d
        ? <Text style={{ color: '#334155' }}>{format(new Date(d), 'HH:mm - dd/MM/yyyy', { locale: vi })}</Text>
        : <Text style={{ color: '#94a3b8' }}>—</Text>,
    },
    {
      title: 'Thực hiện lúc',
      dataIndex: 'executedAt',
      width: 170,
      render: (d: string | undefined) => d
        ? <Text style={{ color: '#334155' }}>{format(new Date(d), 'HH:mm - dd/MM/yyyy', { locale: vi })}</Text>
        : <Text style={{ color: '#94a3b8' }}>—</Text>,
    },
    {
      title: 'Học sinh',
      dataIndex: 'totalStudents',
      width: 100,
      render: (n: number | undefined) => (
        <Text strong>{n != null ? n.toLocaleString() : '—'}</Text>
      ),
    },
    {
      title: 'BLUE phân phối',
      dataIndex: 'totalCoinsDistributed',
      width: 150,
      render: (n: number | undefined) => n != null
        ? <Tag color="blue" style={{ fontWeight: 700 }}>{n.toLocaleString()} BLUE</Tag>
        : <Text style={{ color: '#94a3b8' }}>—</Text>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 90,
      render: (_: unknown, record: FeedingPeriod) =>
        record.status === 'PENDING' ? (
          <Popconfirm
            title="Xóa lịch feeding này?"
            onConfirm={() => deleteFeeding(record.periodId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        ) : null,
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
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Feedings</Title>
          <Text style={{ color: '#64748b' }}>Lên lịch và quản lý việc phân phối BLUE coins cho học sinh</Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateOpen(true)}
            style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 600 }}
          >
            Tạo lịch mới
          </Button>
          <Popconfirm
            title="Kích hoạt Feeding ngay?"
            description="Hệ thống sẽ phân phối BLUE coins cho tất cả học sinh ngay lập tức."
            onConfirm={() => trigger()}
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

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: 'Tổng cộng',   value: totalItems,                                      color: '#0f172a' },
          { label: 'Hoàn thành',  value: items.filter(f => f.status === 'COMPLETED').length, color: '#10b981' },
          { label: 'Đang chờ',    value: items.filter(f => f.status === 'PENDING').length,   color: '#f59e0b' },
          { label: 'Thất bại',    value: items.filter(f => f.status === 'FAILED').length,    color: '#ef4444' },
        ].map((stat) => (
          <Col xs={12} sm={6} key={stat.label}>
            <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 20 } }}>
              <Text style={{
                fontSize: 10, fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8,
              }}>
                {stat.label}
              </Text>
              <Statistic value={stat.value} valueStyle={{ color: stat.color, fontWeight: 800, fontSize: 26 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filter */}
      <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Lọc trạng thái:</Text>
          </Col>
          <Col style={{ minWidth: 220 }}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Tất cả trạng thái"
              allowClear
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
            >
              <Select.Option value="PENDING">Chờ thực hiện</Select.Option>
              <Select.Option value="EXECUTING">Đang chạy</Select.Option>
              <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
              <Select.Option value="FAILED">Thất bại</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
        <Table<FeedingPeriod>
          dataSource={items}
          columns={columns}
          rowKey="periodId"
          loading={isLoading}
          pagination={{
            current: page,
            total: totalItems,
            pageSize: 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} feeding`,
          }}
          locale={{ emptyText: 'Không có feeding nào' }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Create Feeding Modal */}
      <Modal
        open={createOpen}
        title="Tạo lịch Feeding mới"
        onCancel={() => { setCreateOpen(false); setScheduledAt(''); }}
        onOk={handleSchedule}
        okText="Tạo lịch"
        cancelText="Hủy"
        confirmLoading={scheduling}
        okButtonProps={{ disabled: !scheduledAt, style: { background: '#0d9488', borderColor: '#0d9488' } }}
      >
        <div style={{ marginBottom: 8, marginTop: 16 }}>
          <Text strong>
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
