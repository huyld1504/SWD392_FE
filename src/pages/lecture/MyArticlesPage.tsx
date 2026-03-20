import { useState } from 'react';
import { useMyArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Table, Button, Tag, Input, Modal, Typography, Space, Card, Tabs, Empty,
} from 'antd';
import {
  PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ArticleStatus, Article } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<ArticleStatus, { color: string; bg: string; dot: string; label: string }> = {
  APPROVED: { color: '#047857', bg: '#d1fae5', dot: '#10b981', label: 'Đã duyệt' },
  PENDING: { color: '#b45309', bg: '#fef3c7', dot: '#f59e0b', label: 'Chờ duyệt' },
  REJECTED: { color: '#b91c1c', bg: '#fee2e2', dot: '#ef4444', label: 'Từ chối' },
  DRAFT: { color: '#64748b', bg: '#f1f5f9', dot: '#94a3b8', label: 'Nháp' },
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 10px', borderRadius: 999,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function MyArticlesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | undefined>();
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const { data, isLoading } = useMyArticles({ page, pageSize: PAGE_SIZE, status: statusFilter, keyword });
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

  const articles = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  const pendingCount = articles.filter((a) => a.status === 'PENDING').length;

  const tabs = [
    { key: '', label: 'Tất cả' },
    { key: 'PENDING', label: <span>Chờ duyệt {pendingCount > 0 && <Tag color="default" style={{ marginLeft: 4, fontSize: 11 }}>{pendingCount}</Tag>}</span> },
    { key: 'APPROVED', label: 'Đã duyệt' },
    { key: 'REJECTED', label: 'Từ chối' },
  ];

  const columns: ColumnsType<Article> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (title: string, record: Article) => (
        <div>
          <Text
            strong
            style={{ color: '#1e293b', cursor: 'pointer', fontSize: 14 }}
            onClick={() => navigate(`/lecture/articles/${record.articleId}`)}
            className="hover:text-teal-600"
          >
            {title}
          </Text>
          {record.status === 'REJECTED' && (
            <div style={{ marginTop: 4, fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>●</span> Nội dung chưa đạt tiêu chuẩn học thuật
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'CHỦ ĐỀ',
      dataIndex: 'topicName',
      render: (v: string) => (
        <Tag style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontWeight: 500 }}>
          {v}
        </Tag>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (s: ArticleStatus) => <StatusBadge status={s} />,
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'createdAt',
      render: (d: string) => (
        <Text style={{ color: '#64748b', fontSize: 13 }}>
          {format(new Date(d), 'dd/MM/yyyy', { locale: vi })}
        </Text>
      ),
    },
    {
      title: <span style={{ float: 'right' }}>THAO TÁC</span>,
      key: 'actions',
      render: (_: unknown, record: Article) => (
        <Space size={4} style={{ justifyContent: 'flex-end', display: 'flex' }}>
          <Button
            type="text" size="small" icon={<EyeOutlined />}
            style={{ color: '#94a3b8' }}
            onClick={() => navigate(`/lecture/articles/${record.articleId}`)}
            title="Xem"
          />
          {record.status !== 'APPROVED' && (
            <Button
              type="text" size="small" icon={<EditOutlined />}
              style={{ color: '#94a3b8' }}
              onClick={() => navigate(`/lecture/articles/${record.articleId}/edit`)}
              title="Sửa"
            />
          )}
          {record.status === 'PENDING' && (
            <Button
              type="text" size="small" icon={<DeleteOutlined />}
              style={{ color: '#94a3b8' }}
              onClick={() => setDeleteTarget(record)}
              title="Xóa"
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>Bài viết của tôi</Title>
          <Text style={{ color: '#64748b' }}>Quản lý và theo dõi hiệu suất các bài viết chuyên môn của bạn.</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={() => { setKeyword(searchInput); setPage(1); }}
            onClear={() => { setKeyword(''); setPage(1); }}
            allowClear
            placeholder="Tìm kiếm tiêu đề bài viết..."
            prefix={<span style={{ color: '#94a3b8', fontSize: 14 }}>🔍</span>}
            style={{ width: 260, borderRadius: 8 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 700, height: 38 }}
            onClick={() => navigate('/lecture/articles/new')}
          >
            Tạo bài mới
          </Button>
        </div>
      </div>

      {/* Table card */}
      <Card
        style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 32 }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          activeKey={statusFilter ?? ''}
          onChange={(key) => { setStatusFilter((key as ArticleStatus) || undefined); setPage(1); }}
          style={{ padding: '0 24px' }}
          items={tabs.map((t) => ({ key: t.key, label: t.label }))}
        />

        <Table
          rowKey="articleId"
          columns={columns}
          dataSource={articles}
          loading={isLoading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={<FileTextOutlined style={{ fontSize: 48, color: '#cbd5e1' }} />}
                description={<Text style={{ color: '#94a3b8' }}>Không có bài viết nào</Text>}
              >
                <Button
                  type="primary"
                  style={{ background: '#0d9488', borderColor: '#0d9488' }}
                  onClick={() => navigate('/lecture/articles/new')}
                >
                  Tạo bài viết đầu tiên
                </Button>
              </Empty>
            ),
          }}
          style={{ borderTop: '1px solid #f1f5f9' }}
        />

        {/* Pagination footer */}
        <div style={{
          padding: '12px 24px', background: '#fafafa', borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0 0 12px 12px',
        }}>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>
            Hiển thị <strong style={{ color: '#374151' }}>{articles.length}</strong> / <strong style={{ color: '#374151' }}>{total}</strong> bài viết
          </Text>
          <div style={{ display: 'flex', gap: 4 }}>
            <Button size="small" disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ borderRadius: 6 }}>‹</Button>
            {Array.from({ length: data?.totalPages ?? 1 }, (_, i) => i + 1).slice(Math.max(0, page - 2), page + 1).map((p) => (
              <Button
                key={p} size="small"
                type={p === page ? 'primary' : 'default'}
                style={{ borderRadius: 6, ...(p === page ? { background: '#0d9488', borderColor: '#0d9488' } : {}) }}
                onClick={() => setPage(p)}
              >{p}</Button>
            ))}
            <Button size="small" disabled={page === (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)} style={{ borderRadius: 6 }}>›</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}


      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={() => {
          if (!deleteTarget) return;
          deleteArticle(deleteTarget.articleId, { onSuccess: () => setDeleteTarget(null) });
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeleting }}
        title="Xóa bài viết"
        centered
      >
        <Text>Bạn chắc chắn muốn xoá bài viết <strong>"{deleteTarget?.title}"</strong>? Hành động này không thể hoàn tác.</Text>
      </Modal>
    </div>
  );
}
