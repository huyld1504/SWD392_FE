import { useState, useEffect } from 'react';
import { Modal, Spin, Typography, Space } from 'antd';
import { useTransactions } from '@/hooks/useWallets';
import TransactionTable from './TransactionTable';
import { WalletOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Transaction } from '@/types';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  walletId: number | null;
}

export default function UserWalletTransactionsModal({ visible, onClose, walletId }: Props) {
  const [page, setPage] = useState(1);
  
  // Only fetch if walletId is present
  const { data: txData, isLoading: isLoadingTx } = useTransactions(
    walletId ?? 0,
    { 
        page: page, 
        size: 10,
        enabled: !!walletId 
    }
  );

  const transactions = txData?.data || [];
  const totalTx = txData?.totalItems || 0;

  // Reset page when wallet changes
  useEffect(() => {
    if (visible && walletId) {
        setPage(1);
    }
  }, [walletId, visible]);

  return (
    <Modal
      title={
        <Space>
           <WalletOutlined style={{ color: '#0d9488' }} />
           <Text strong style={{ fontSize: 16 }}>Lịch sử giao dịch (ID: {walletId})</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
    >
        {isLoadingTx && !transactions.length ? (
             <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : (
             <TransactionTable
                data={transactions}
                loading={isLoadingTx}
                pagination={{
                    current: page,
                    pageSize: 10,
                    total: totalTx,
                    onChange: (p) => setPage(p),
                }}
             />
        )}
    </Modal>
  );
}
