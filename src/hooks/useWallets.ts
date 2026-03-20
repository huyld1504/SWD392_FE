import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { walletApi } from '@/api/walletApi';
import type { WalletAdminParams, WalletStatus } from '@/types';
import { toast } from 'sonner';

export const walletKeys = {
  all: ['wallets'] as const,
  myWallets: () => [...walletKeys.all, 'my'] as const,
  transactions: (walletId: number) => [...walletKeys.all, 'transactions', walletId] as const,
  admin: (params: WalletAdminParams) => [...walletKeys.all, 'admin', params] as const,
  systemTransactions: (params: any) => [...walletKeys.all, 'system-transactions', params] as const,
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
        walletApi.updateStatus(walletId, status).then(() => {
          qc.invalidateQueries({ queryKey: walletKeys.all });
          toast.success('Cập nhật trạng thái ví thành công!');
        }),
      onError: () => toast.error('Không thể cập nhật trạng thái ví!'),
    });
  };

  /** TOP UP System Wallet (admin) */
  export const useTopUpSystemWallet = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (amount: number) => walletApi.topUpSystemWallet(amount),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: walletKeys.all });
        toast.success('Hệ thống đã được nạp tiền thành công!');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Không thể nạp tiền vào ví hệ thống!');
      },
    });
  };

  /** GET System Wallet Transactions (admin) */
  export const useSystemTransactions = (params: any = {}) =>
    useQuery({
      queryKey: walletKeys.systemTransactions(params),
      queryFn: () => walletApi.getSystemTransactions(params),
      placeholderData: (prev) => prev,
    });

  export const useCreateEarnedWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletApi.createEarned,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.myWallets() });
      toast.success('Tạo ví EARNED thành công!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tạo ví EARNED!';
      toast.error(message);
    },
  });
};
