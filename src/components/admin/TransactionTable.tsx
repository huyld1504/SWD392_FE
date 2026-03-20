import { Table, Tag, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import type { Transaction } from '@/types';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SwapOutlined, 
  HeartOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  data: Transaction[];
  loading: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

export default function TransactionTable({ data, loading, pagination }: Props) {
  const columns: ColumnsType<Transaction> = [
    {
      title: 'Mã GD',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 80,
      render: (id) => <Text type="secondary" style={{ fontSize: 12 }}>#{id}</Text>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text strong>{format(new Date(date), 'dd/MM/yyyy')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{format(new Date(date), 'HH:mm:ss')}</Text>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 140,
      render: (type) => {
        let color = 'default';
        let icon = <SwapOutlined />;
        let text = type;

        switch (type) {
          case 'FEEDING':
            color = 'cyan';
            icon = <ThunderboltOutlined />;
            text = 'Nhận thưởng';
            break;
          case 'DONATE':
            color = 'volcano';
            icon = <HeartOutlined />;
            text = 'Donate';
            break;
          case 'RECEIVE_DONATE':
            color = 'magenta';
            icon = <HeartOutlined />;
            text = 'Nhận Donate';
            break;
          case 'CREDIT':
            color = 'green';
            icon = <ArrowUpOutlined />;
            text = 'Nạp tiền';
            break;
          case 'DEBIT':
            color = 'red';
            icon = <ArrowDownOutlined />;
            text = 'Rút tiền';
            break;
        }

        return <Tag icon={icon} color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Số tiền',
      key: 'amount',
      width: 140,
      align: 'right',
      render: (_, record) => {
        const isIn = record.direction === 'IN';
        return (
          <Text strong style={{ color: isIn ? '#16a34a' : '#dc2626' }}>
            {isIn ? '+' : '-'}{Math.abs(record.amount).toLocaleString()} {record.currency}
          </Text>
        );
      },
    },
    {
      title: 'Đối tác',
      key: 'counterparty',
      render: (_, record) => {
        const isIn = record.direction === 'IN';
        const partner = isIn ? record.sender : record.receiver;
        
        // Handling for system transactions where transactionType is FEEDING (System -> User) or CREDIT (User -> System?)
        // Actually, for System Wallet:
        // Top-up (CREDIT): System gets money. Partner is unknown/System itself? Or admin manually? The API creates a transaction.
        // FEEDING: System pays User. Partner is User.
        
        if (!partner && record.transactionType === 'FEEDING') {
             return <Text type="secondary">Hệ thống</Text>;
        }

        return partner ? (
          <Space direction="vertical" size={0}>
            <Text>{partner.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{partner.email}</Text>
          </Space>
        ) : (
          <Text type="secondary">System/Admin</Text>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="transactionId"
      loading={loading}
      pagination={pagination}
      size="small"
      scroll={{ x: 600 }}
    />
  );
}
