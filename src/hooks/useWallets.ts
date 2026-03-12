import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/api/walletApi';
import type { WalletAdminParams, WalletStatus } from '@/types';
import { toast } from 'sonner';

export const walletKeys = {
  all: ['wallets'] as const,
  myWallets: () => [...walletKeys.all, 'my'] as const,
  transactions: (walletId: number) => [...walletKeys.all, 'transactions', walletId] as const,
  admin: (params: WalletAdminParams) => [...walletKeys.all, 'admin', params] as const,
};

/** GET all wallets of current user */
export const useMyWallets = () =>
  useQuery({
    queryKey: walletKeys.myWallets(),
    queryFn: walletApi.getMyWallets,
  });

/** GET transactions of a specific wallet */
export const useTransactions = (walletId: number, params = {}) =>
  useQuery({
    queryKey: [...walletKeys.transactions(walletId), params],
    queryFn: () => walletApi.getTransactions(walletId, params),
    enabled: !!walletId,
  });

/** GET all wallets (admin) */
export const useAllWallets = (params: WalletAdminParams = {}) =>
  useQuery({
    queryKey: walletKeys.admin(params),
    queryFn: () => walletApi.getAllWallets(params),
    placeholderData: (prev) => prev,
  });

/** PATCH wallet status (admin) */
export const useUpdateWalletStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, status }: { walletId: number; status: WalletStatus }) =>
      walletApi.updateStatus(walletId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.all });
      toast.success('Cập nhật trạng thái ví thành công!');
    },
    onError: () => toast.error('Không thể cập nhật trạng thái ví!'),
  });
};
