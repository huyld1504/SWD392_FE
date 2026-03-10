import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  Wallet,
  WalletStatus,
  WalletAdminParams,
  WalletTransactionParams,
  Transaction,
  PaginationResponse,
} from '@/types';

// ==================== API CALLS ====================
export const walletApi = {
  /**
   * Create a new EARNED wallet (GOLD currency) for the current user.
   * Each user can only have one EARNED wallet.
   */
  createEarned: async (): Promise<Wallet> => {
    const res = await axiosInstance.post<ApiResponse<Wallet>>('/api/v1/wallets/earned');
    return res.data.data;
  },

  /**
   * Get all wallets of the currently authenticated user.
   */
  getMyWallets: async (): Promise<Wallet[]> => {
    const res = await axiosInstance.get<ApiResponse<Wallet[]>>('/api/v1/wallets/me');
    return res.data.data;
  },

  /**
   * Get all wallets with optional filtering.
   * Role: ADMIN only.
   */
  getAllWallets: async (params: WalletAdminParams = {}): Promise<PaginationResponse<Wallet>> => {
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Wallet>>>(
      '/api/v1/wallets',
      { params },
    );
    return res.data.data;
  },

  /**
   * Update wallet status (ACTIVE or LOCKED).
   * Role: ADMIN only.
   */
  updateStatus: async (walletId: number, status: WalletStatus): Promise<Wallet> => {
    const res = await axiosInstance.put<ApiResponse<Wallet>>(
      `/api/v1/wallets/${walletId}/status`,
      { status },
    );
    return res.data.data;
  },

  /**
   * Get all transactions of a specific wallet.
   * Only the wallet owner (or admin) can view.
   */
  getTransactions: async (
    walletId: number,
    params: WalletTransactionParams = {},
  ): Promise<PaginationResponse<Transaction>> => {
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Transaction>>>(
      `/api/v1/wallets/${walletId}/transactions`,
      { params },
    );
    return res.data.data;
  },
};
