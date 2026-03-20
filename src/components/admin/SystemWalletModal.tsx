import { useState } from 'react';
import { Modal, Tabs, Form, InputNumber, Button, Alert, message, Typography, Space } from 'antd';
import { useTopUpSystemWallet, useSystemTransactions } from '@/hooks/useWallets';
import TransactionTable from './TransactionTable';
import { ShopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SystemWalletModal({ visible, onClose }: Props) {
  const [form] = Form.useForm();
  const { mutate: topUp, isPending: isToppingUp } = useTopUpSystemWallet();
  const [txPage, setTxPage] = useState(1);

  // Fetch transactions
  const { data: txData, isLoading: isLoadingTx } = useSystemTransactions({
    page: txPage,
    size: 10,
    fromDate: null,
    toDate: null,
  });

  const transactions = txData?.data || [];
  const totalTx = txData?.totalItems || 0;

  const handleTopUp = (values: { amount: number }) => {
    topUp(values.amount, {
      onSuccess: () => {
        form.resetFields();
        message.success(`Đã nạp ${values.amount.toLocaleString()} BLUE vào ví hệ thống.`);
        // Note: Refreshing total balance might need refreshing page or invalidateQueries logic in hook
      },
    });
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Nạp tiền',
      children: (
        <div style={{ padding: '24px 0' }}>
            <Alert
                message="Lưu ý quan trọng"
                description="Hành động này sẽ thêm số dư vào ví hệ thống, cho phép hệ thống phân phát phần thưởng (FEEDING) cho người dùng."
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
            />
          
            <Form
                layout="vertical"
                form={form}
                onFinish={handleTopUp}
            >
                <Form.Item
                label="Số tiền (BLUE)"
                name="amount"
                rules={[
                    { required: true, message: 'Vui lòng nhập số tiền' },
                    { type: 'number', min: 1000, message: 'Tối thiểu 1,000 BLUE' },
                ]}
                >
                <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập số lượng BLUE cần nạp"
                    size="large"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    addonAfter="BLUE"
                />
                </Form.Item>

                <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={isToppingUp} icon={<CheckCircleOutlined />}>
                    Xác nhận nạp tiền
                </Button>
                </div>
            </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Lịch sử giao dịch',
      children: (
        <TransactionTable
          data={transactions}
          loading={isLoadingTx}
          pagination={{
            current: txData?.currentPage ? txData.currentPage + 1 : 1, // API 0-indexed? useSystemTransactions hook handles param conversion.
            pageSize: 10,
            total: totalTx,
            onChange: (page) => setTxPage(page),
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
           <ShopOutlined style={{ color: '#0d9488' }} />
           <Text strong style={{ fontSize: 18 }}>Quản lý Ví Hệ thống</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
}
