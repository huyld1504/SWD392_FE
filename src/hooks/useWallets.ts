import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/api/walletApi';

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
