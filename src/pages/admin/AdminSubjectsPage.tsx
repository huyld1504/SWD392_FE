import { useState } from 'react';
import {
  Table, Button, Space, Input, Modal, Form, Popconfirm, Typography, Tag, Card, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useSubjectsPaginated,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
  useRestoreSubject,
} from '@/hooks/useTopics';
import type { Subject } from '@/types';

const { Title, Text } = Typography;

export default function AdminSubjectsPage() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useSubjectsPaginated({ page, pageSize: 10, keyword });
  const { mutate: createSubject, isPending: creating } = useCreateSubject();
  const { mutate: updateSubject, isPending: updating } = useUpdateSubject();
  const { mutate: deleteSubject } = useDeleteSubject();
  const { mutate: restoreSubject } = useRestoreSubject();

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Subject) => {
    setEditTarget(record);
    form.setFieldsValue({
      subjectCode: record.subjectCode,
      name: record.name,
      description: record.description ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editTarget) {
      updateSubject(
        { id: editTarget.subjectId, data: values },
        { onSuccess: () => { setModalOpen(false); form.resetFields(); } },
      );
    } else {
      createSubject(values, {
        onSuccess: () => { setModalOpen(false); form.resetFields(); },
      });
    }
  };

  const columns: ColumnsType<Subject> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: Subject, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      width: 130,
      render: (code: string) => (
        <Tag style={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{code}</Tag>
      ),
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (desc: string | undefined) => (
        <Text style={{ color: '#64748b' }}>{desc || '—'}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      width: 110,
      render: (deleted: boolean | undefined) =>
        deleted ? <Tag color="error">Đã xóa</Tag> : <Tag color="success">Hoạt động</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Subject) => (
        <Space>
          {!record.deleted && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              style={{ color: '#0d9488' }}
            />
          )}
          {record.deleted ? (
            <Popconfirm
              title="Khôi phục môn học này?"
              onConfirm={() => restoreSubject(record.subjectId)}
              okText="Khôi phục"
              cancelText="Hủy"
              okButtonProps={{ style: { background: '#0d9488', borderColor: '#0d9488' } }}
            >
              <Button type="text" icon={<UndoOutlined />} style={{ color: '#0d9488' }} />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Xóa môn học này?"
              description="Hành động này sẽ ẩn môn học khỏi hệ thống."
              onConfirm={() => deleteSubject(record.subjectId)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 24, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Môn học</Title>
          <Text style={{ color: '#64748b' }}>Thêm, sửa, xóa các môn học trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 600 }}
        >
          Thêm môn học
        </Button>
      </div>

      {/* Search */}
      <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm theo tên môn học..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => { setKeyword(searchInput); setPage(1); }}
              allowClear
              onClear={() => { setKeyword(''); setSearchInput(''); setPage(1); }}
              size="large"
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              onClick={() => { setKeyword(searchInput); setPage(1); }}
              style={{ background: '#0d9488', borderColor: '#0d9488' }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
        <Table<Subject>
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="subjectId"
          loading={isLoading}
          pagination={{
            current: page,
            total: data?.totalItems ?? 0,
            pageSize: 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} môn học`,
          }}
          locale={{ emptyText: 'Không có môn học nào' }}
        />
      </Card>

      {/* Modal Create / Edit */}
      <Modal
        open={modalOpen}
        title={editTarget ? 'Sửa môn học' : 'Thêm môn học mới'}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        okText={editTarget ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={creating || updating}
        okButtonProps={{ style: { background: '#0d9488', borderColor: '#0d9488' } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="subjectCode"
            label="Mã môn học"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn học' }]}
          >
            <Input placeholder="VD: CS101" size="large" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input placeholder="VD: Lập trình cơ bản" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về môn học..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
