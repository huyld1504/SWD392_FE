import axiosInstance from './axiosInstance';
import type { ApiResponse, Donation, DonationParams, PaginationResponse } from '@/types';

// ==================== REQUEST TYPES ====================
export interface DonateRequest {
  articleId: number;
  /** 1–10 BLUE coins per transaction */
  amount: number;
}

// ==================== API CALLS ====================
export const donationApi = {
  /**
   * Donate BLUE coins (1–10) to an article's author.
   * Article must be APPROVED. Cannot donate to own article.
   * Role: STUDENT
   */
  donate: async (data: DonateRequest): Promise<Donation> => {
    const res = await axiosInstance.post<ApiResponse<Donation>>('/api/v1/donations', data);
    return res.data.data;
  },

  /**
   * Get all donations for a specific article with optional date range.
   * Roles: STUDENT, LECTURE, ADMIN
   */
  getByArticle: async (
    articleId: number,
    params: DonationParams = {},
  ): Promise<PaginationResponse<Donation>> => {
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Donation>>>(
      `/api/v1/donations/article/${articleId}`,
      { params },
    );
    return res.data.data;
  },

  /**
   * Get all donations sent by the current user.
   * Roles: STUDENT, LECTURE
   */
  getMyHistory: async (params: DonationParams = {}): Promise<PaginationResponse<Donation>> => {
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Donation>>>(
      '/api/v1/donations/me',
      { params },
    );
    return res.data.data;
  },
};
