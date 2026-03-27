import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  useSemesters,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
  useRestoreSemester,
} from '@/hooks/useSemesters';
import type { Semester } from '@/types';
import {
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminSemestersPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Semester | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, isLoading } = useSemesters({ page, pageSize: 10, sort: 'startDate', direction: 'desc' });
  const { mutate: createSemester, isPending: creating } = useCreateSemester();
  const { mutate: updateSemester, isPending: updating } = useUpdateSemester();
  const { mutate: deleteSemester, isPending: deleting } = useDeleteSemester();
  const { mutate: restoreSemester, isPending: restoring } = useRestoreSemester();

  const items = data?.data ?? [];
  const totalItems = data?.totalItems ?? items.length;

  const columns: ColumnsType<Semester> = useMemo(() => [
    {
      title: '#',
      key: 'idx',
      width: 60,
      render: (_: unknown, __: Semester, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'Mã kỳ học',
      dataIndex: 'semesterCode',
      width: 140,
      render: (code: string) => <Tag color="processing" style={{ fontWeight: 700 }}>{code}</Tag>,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      width: 180,
      render: (d: string) => <Text>{dayjs(d).format('DD/MM/YYYY')}</Text>,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      width: 180,
      render: (d: string) => <Text>{dayjs(d).format('DD/MM/YYYY')}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 200,
      render: (d?: string) => d ? <Text type="secondary">{dayjs(d).format('HH:mm - DD/MM/YYYY')}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 220,
      render: (_: unknown, record: Semester) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(record);
              editForm.setFieldsValue({
                startDate: dayjs(record.startDate),
                endDate: dayjs(record.endDate),
              });
              setEditOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa kỳ học này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleting }}
            onConfirm={() => deleteSemester(record.semesterCode)}
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
          {record.deleted && (
            <Popconfirm
              title="Khôi phục kỳ học này?"
              okText="Khôi phục"
              cancelText="Hủy"
              okButtonProps={{ loading: restoring }}
              onConfirm={() => restoreSemester(record.semesterCode)}
            >
              <Button type="text" icon={<RollbackOutlined />}>
                Khôi phục
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ], [page, deleteSemester, deleting, restoreSemester, restoring, editForm]);

  const handleCreate = () => {
    createForm.validateFields().then((values) => {
      createSemester(
        {
          semesterCode: values.semesterCode.toUpperCase(),
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
        },
        {
          onSuccess: () => {
            createForm.resetFields();
            setCreateOpen(false);
            setPage(1);
          },
        },
      );
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    editForm.validateFields().then((values) => {
      updateSemester(
        {
          code: selected.semesterCode,
          payload: {
            startDate: values.startDate?.format('YYYY-MM-DD'),
            endDate: values.endDate?.format('YYYY-MM-DD'),
          },
        },
        {
          onSuccess: () => {
            setEditOpen(false);
            setSelected(null);
            editForm.resetFields();
          },
        },
      );
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Kỳ học</Title>
          <Text type="secondary">Tạo, chỉnh sửa và quản lý các mã kỳ học (SP26, SU26, FA26...).</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          Thêm kỳ học
        </Button>
      </div>

      <Card bordered style={{ borderRadius: 12 }}>
        <Table<Semester>
          loading={isLoading}
          dataSource={items}
          rowKey={(r) => r.semesterCode}
          columns={columns}
          pagination={{ current: page, pageSize: 10, total: totalItems, onChange: setPage, showSizeChanger: false }}
        />
      </Card>

      {/* Create modal */}
      <Modal
        title={<Space><CalendarOutlined /> <span>Thêm kỳ học</span></Space>}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreate}
        confirmLoading={creating}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical">
          <Form.Item label="Mã kỳ học" name="semesterCode" rules={[{ required: true, message: 'Nhập mã kỳ học, ví dụ SP26' }]}>
            <Input placeholder="SP26" maxLength={10} />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit modal */}
      <Modal
        title={<Space><EditOutlined /> <span>Chỉnh sửa kỳ học</span></Space>}
        open={editOpen}
        onCancel={() => { setEditOpen(false); setSelected(null); }}
        onOk={handleUpdate}
        confirmLoading={updating}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Mã kỳ học" >
            <Input value={selected?.semesterCode} disabled />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
