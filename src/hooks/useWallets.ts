import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/api/walletApi';
import { toast } from 'sonner';

export const walletKeys = {
  all: ['wallets'] as const,
  myWallets: () => [...walletKeys.all, 'my'] as const,
  transactions: (walletId: number) => [...walletKeys.all, 'transactions', walletId] as const,
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

/** CREATE earned wallet (GOLD) */
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
