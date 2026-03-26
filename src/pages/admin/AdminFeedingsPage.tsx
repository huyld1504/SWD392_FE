import { useState } from 'react';
import {
  Table, Button, Space, Select, Typography, Tag, Card, Row, Col,
  Popconfirm, Input, Modal, Form, InputNumber, Statistic, Spin, Empty
} from 'antd';
import {
  ThunderboltOutlined, PlusOutlined, DeleteOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined,EyeOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useFeedings,
  useCreateFeeding,
  useTriggerFeeding,
  useDeleteFeeding,
  useCompleteFeeding,
  useUpdateFeeding,
  useFeedingDetail
} from '@/hooks/useFeeding';
import { useSemesters } from '@/hooks/useSemesters';
import type { FeedingPeriod, FeedingStatus } from '@/types';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<FeedingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  COMPLETED: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleOutlined /> },
  ACTIVE:    { label: 'Đang hoạt động', color: 'processing', icon: <ClockCircleOutlined /> },
  CANCELLED: { label: 'Đã hủy',   color: 'error', icon: <CloseCircleOutlined /> },
};

export default function AdminFeedingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FeedingStatus | undefined>();
  const [semesterCodeFilter, setSemesterCodeFilter] = useState<string>('');
  
  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  
  // Update Modal
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<FeedingPeriod | null>(null);
  const [updateForm] = Form.useForm();

  // Detail Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const { data, isLoading } = useFeedings({ 
    page: page - 1, 
    size: 10, 
    status: statusFilter,
    semesterCode: semesterCodeFilter || undefined
  });
  
  const { mutate: createFeeding, isPending: creating } = useCreateFeeding();
  const { mutate: updateFeeding, isPending: updating } = useUpdateFeeding();
  const { mutate: triggerFeeding } = useTriggerFeeding();
  const { mutate: completeFeeding } = useCompleteFeeding();
  const { mutate: deleteFeeding } = useDeleteFeeding();

  const { data: semesters, isLoading: semestersLoading } = useSemesters({ pageSize: 100 });

  const { data: detailData, isLoading: detailLoading } = useFeedingDetail(
    selectedDetailId!,
    !!selectedDetailId
  );

  const items = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;

  const handleCreate = () => {
    createForm.validateFields().then(values => {
      createFeeding(values, {
        onSuccess: () => {
          setCreateOpen(false);
          createForm.resetFields();
        }
      });
    });
  };

  const handleUpdate = () => {
    if (!selectedPeriod) return;
    updateForm.validateFields().then(values => {
      updateFeeding({ periodId: selectedPeriod.periodId, data: values }, {
        onSuccess: () => {
          setUpdateOpen(false);
          updateForm.resetFields();
          setSelectedPeriod(null);
        }
      });
    });
  };

  const columns: ColumnsType<FeedingPeriod> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: FeedingPeriod, idx: number) => (page - 1) * 10 + idx + 1,
    },
    {
      title: 'Mã kỳ học',
      dataIndex: 'semesterCode',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 160,
      render: (status: FeedingStatus) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <Tag icon={cfg?.icon} color={cfg?.color} style={{ fontWeight: 600 }}>
            {cfg?.label || status}
          </Tag>
        );
      },
    },
    {
      title: 'Số coin cấp phát',
      dataIndex: 'grantAmount',
      width: 150,
      render: (amount: number) => <Text strong>{amount} BLUE</Text>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 170,
      render: (d: string | undefined) => d
        ? <Text style={{ color: '#334155' }}>{format(new Date(d), 'HH:mm - dd/MM/yyyy', { locale: vi })}</Text>
        : <Text style={{ color: '#94a3b8' }}>—</Text>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 250,
      render: (_: unknown, record: FeedingPeriod) =>
        record.status === 'ACTIVE' ? (
          <Space>
            <Button
               type="text"
               icon={<EyeOutlined />}
               title="Xem chi tiết"
               onClick={() => {
                 setSelectedDetailId(record.periodId);
                 setDetailOpen(true);
               }}
            />

            <Button 
               type="text" 
               icon={<EditOutlined />} 
               title="Chỉnh sửa lượng coin cấp"
               onClick={() => {
                 setSelectedPeriod(record);
                 updateForm.setFieldsValue({ grantAmount: record.grantAmount });
                 setUpdateOpen(true);
               }} 
            />
            <Popconfirm
              title="Kích hoạt phát coin?"
              description="Hệ thống sẽ cấp phát coin cho các học sinh."
              onConfirm={() => triggerFeeding(record.periodId)}
              okText="Trigger"
              cancelText="Hủy"
            >
              <Button type="text" icon={<ThunderboltOutlined />} title="Trigger thủ công" style={{ color: '#f97316' }} />
            </Popconfirm>
            <Popconfirm
              title="Chốt kỳ này?"
              description="Kỳ này sẽ được đánh dấu là HOÀN THÀNH."
              onConfirm={() => completeFeeding(record.periodId)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="text" icon={<CheckCircleOutlined />} title="Kết thúc sớm" style={{ color: '#10b981' }} />
            </Popconfirm>
            <Popconfirm
              title="Hủy kỳ này?"
              onConfirm={() => deleteFeeding(record.periodId)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" icon={<DeleteOutlined />} title="Hủy bỏ" danger />
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 24, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Feedings</Title>
          <Text style={{ color: '#64748b' }}>Quản lý việc phân phối BLUE coins theo các kỳ học</Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateOpen(true)}
            style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 600 }}
          >
            Tạo kỳ mới
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Lọc trạng thái:</Text>
          </Col>
          <Col style={{ minWidth: 200 }}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Tất cả trạng thái"
              allowClear
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
            >
              <Select.Option value="ACTIVE">Đang hoạt động</Select.Option> 
              <Select.Option value="COMPLETED">Hoàn thành</Select.Option>     
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>        
            </Select>
          </Col>
          <Col>
            <Text strong>Kỳ học:</Text>
          </Col>
          <Col style={{ minWidth: 200 }}>
             <Input 
               placeholder="VD: SP26" 
               size="large"
               value={semesterCodeFilter}
               onChange={(e) => { setSemesterCodeFilter(e.target.value); setPage(1); }}
             />
          </Col>
        </Row>
      </Card>

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
            showTotal: (total) => `Tổng ${total} kỳ`,
          }}
          locale={{ emptyText: 'Không có thông tin' }}
          scroll={{ x: 900 }}
        />
      </Card>

      
      {/* Detail Modal */}
      <Modal
        title={`Chi tiết kỳ cấp phát (${detailData?.semesterCode || ''})`}
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setSelectedDetailId(null);
        }}
        footer={null}
        width={900}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}><Spin size="large" /></div>
        ) : detailData ? (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                  <Statistic title="Trạng thái" value={STATUS_CONFIG[detailData.status]?.label || detailData.status} valueStyle={{ color: STATUS_CONFIG[detailData.status]?.color, fontSize: 16, fontWeight: 'bold' }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                  <Statistic title="Kỳ học" value={detailData.semesterName || detailData.semesterCode} valueStyle={{ fontSize: 16, fontWeight: 'bold' }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                 <Statistic title="Mức cấp phát" value={detailData.grantAmount} suffix="BLUE" />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                  <Statistic 
                    title="Deficit (Thiếu hụt)" 
                    value={detailData.stats?.deficit ?? 0} 
                    valueStyle={{ color: (detailData.stats?.deficit ?? 0) > 0 ? '#ef4444' : '#10b981' }} 
                    suffix="BLUE" 
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                  <Statistic title="Số dư hệ thống" value={detailData.stats?.systemWalletBalance ?? 0} valueStyle={{ color: '#10b981' }} suffix="BLUE" />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', height: 120, display: 'flex', alignItems: 'center' }}>
                  <Statistic title="Người dùng chưa nhận (Pending)" value={detailData.stats?.pendingUsers ?? 0} valueStyle={{ color: '#f59e0b' }} />
                </Card>
              </Col>
            </Row>

            <Card title="Danh sách người dùng đã nhận coin (Received Users)" size="small">
              <Table
                size="small"
                dataSource={detailData.users || []}
                rowKey="feedingId"
                pagination={{ pageSize: 5 }}
                columns={[
                  { title: 'ID', dataIndex: ['user', 'userId'], width: 60 },
                  { title: 'Tên', dataIndex: ['user', 'name'], width: 200, render: (name, record) => (
                      <Space>
                        {record.user.avatarUrl ? <img src={record.user.avatarUrl} alt="avatar" style={{width: 24, height: 24, borderRadius: '50%'}} /> : null}
                        <Text strong>{name}</Text>
                      </Space>
                  ) },
                  { title: 'Email', dataIndex: ['user', 'email'] },
                  { title: 'Đã nhận', dataIndex: 'amountReceived', render: (amt) => <Text strong style={{ color: '#10b981' }}>+{amt} BLUE</Text> },
                  { title: 'Thời gian', dataIndex: 'fedAt', render: (d) => d ? format(new Date(d), 'HH:mm - dd/MM/yyyy', { locale: vi }) : '—' },
                ]}
              />
            </Card>
          </Space>
        ) : (
          <Empty description="Không có dữ liệu chi tiết" />
        )}
      </Modal>


      <Modal
        open={createOpen}
        title="Tạo kỳ Feeding mới"
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        onOk={handleCreate}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={creating}
        okButtonProps={{ style: { background: '#0d9488', borderColor: '#0d9488' } }}
      >
        <Form form={createForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item 
             label="Mã kỳ học" 
             name="semesterCode" 
             rules={[
               { required: true, message: 'Vui lòng chọn mã kỳ học!' },
               { pattern: /^(SP|SU|FA)\d{2}$/, message: 'Định dạng mã kỳ học không hợp lệ (VD: SP26, SU26, FA26)' }
             ]}
          >
             <Select
               showSearch
               placeholder="Chọn kỳ học"
               loading={semestersLoading}
               optionFilterProp="label"
               options={(semesters?.data ?? []).map((s) => ({
                 value: s.semesterCode,
                 label: `${s.semesterCode} (${format(new Date(s.startDate), 'dd/MM/yyyy')} - ${format(new Date(s.endDate), 'dd/MM/yyyy')})`,
               }))}
               filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
             />
          </Form.Item>
          <Form.Item 
             label="Số lượng Coin cấp phát (BLUE)" 
             name="grantAmount"
             rules={[{ required: true, message: 'Vui lòng nhập số coin!' }]}
          >
             <InputNumber min={1} style={{ width: '100%' }} placeholder="VD: 100" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={updateOpen}
        title="Cập nhật kỳ Feeding"
        onCancel={() => { setUpdateOpen(false); updateForm.resetFields(); setSelectedPeriod(null); }}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updating}
        okButtonProps={{ style: { background: '#0d9488', borderColor: '#0d9488' } }}
      >
        <Form form={updateForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item 
             label="Số lượng Coin (BLUE) mới" 
             name="grantAmount"
             rules={[{ required: true, message: 'Vui lòng nhập số coin!' }]}
          >
             <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

