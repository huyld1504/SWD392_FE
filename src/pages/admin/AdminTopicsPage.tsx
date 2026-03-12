import { useState } from 'react';
import {
  Table, Button, Space, Input, Select, Modal, Form, Popconfirm, Typography, Tag, Card, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useTopicsPaginated,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  useSubjects,
} from '@/hooks/useTopics';
import type { Topic } from '@/types';

const { Title, Text } = Typography;

export default function AdminTopicsPage() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Topic | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useTopicsPaginated({ page, pageSize: 10, keyword, subjectId: filterSubjectId });
  const { data: subjectsPage } = useSubjects();
  const subjects = subjectsPage?.data ?? [];

  const { mutate: createTopic, isPending: creating } = useCreateTopic();
  const { mutate: updateTopic, isPending: updating } = useUpdateTopic();
  const { mutate: deleteTopic } = useDeleteTopic();

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Topic) => {
    setEditTarget(record);
    form.setFieldsValue({
      name: record.name,
      subjectId: record.subjectId,
      description: record.description ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editTarget) {
      updateTopic(
        { id: editTarget.topicId, data: values },
        { onSuccess: () => { setModalOpen(false); form.resetFields(); } },
      );
    } else {
      createTopic(values, {
        onSuccess: () => { setModalOpen(false); form.resetFields(); },
      });
    }
  };

  const columns: ColumnsType<Topic> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: Topic, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectName',
      width: 200,
      render: (subjectName: string) => (
        <Tag style={{
          background: 'rgba(13,148,136,0.1)', color: '#0d9488',
          border: 'none', borderRadius: 6, fontWeight: 700,
        }}>
          {subjectName}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (desc: string | undefined) => (
        <Text style={{ color: '#64748b' }}>{desc || '—'}</Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: Topic) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ color: '#0d9488' }}
          />
          <Popconfirm
            title="Xóa chủ đề này?"
            description="Hành động này sẽ ẩn chủ đề khỏi hệ thống."
            onConfirm={() => deleteTopic(record.topicId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
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
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Chủ đề</Title>
          <Text style={{ color: '#64748b' }}>Thêm, sửa, xóa các chủ đề trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 600 }}
        >
          Thêm chủ đề
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <Row gutter={[16, 12]} align="middle" wrap>
          <Col flex="auto" style={{ minWidth: 200 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm theo tên chủ đề..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => { setKeyword(searchInput); setPage(1); }}
              allowClear
              onClear={() => { setKeyword(''); setSearchInput(''); setPage(1); }}
              size="large"
            />
          </Col>
          <Col style={{ minWidth: 220 }}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Lọc theo môn học"
              allowClear
              value={filterSubjectId}
              onChange={(val) => { setFilterSubjectId(val); setPage(1); }}
            >
              {subjects.map((s) => (
                <Select.Option key={s.subjectId} value={s.subjectId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
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
        <Table<Topic>
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="topicId"
          loading={isLoading}
          pagination={{
            current: page,
            total: data?.totalItems ?? 0,
            pageSize: 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} chủ đề`,
          }}
          locale={{ emptyText: 'Không có chủ đề nào' }}
        />
      </Card>

      {/* Modal Create / Edit */}
      <Modal
        open={modalOpen}
        title={editTarget ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
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
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học" size="large">
              {subjects.map((s) => (
                <Select.Option key={s.subjectId} value={s.subjectId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên chủ đề"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề' }]}
          >
            <Input placeholder="VD: Lập trình hướng đối tượng" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về chủ đề..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
