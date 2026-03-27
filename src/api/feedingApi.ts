import axiosInstance from './axiosInstance';
import type { ApiResponse, FeedingPeriod, FeedingParams, PaginationResponse, FeedingPeriodDetail } from '@/types';

// ==================== REQUEST TYPES ====================
export interface CreateFeedingRequest {
  semesterCode: string;
  grantAmount: number;
}

export interface UpdateFeedingRequest {
  grantAmount: number;
}

// ==================== API CALLS ====================
export const feedingApi = {
  /**
   * Create a new feeding period.
   * Role: ADMIN only.
   */
  create: async (data: CreateFeedingRequest): Promise<FeedingPeriod> => {
    const res = await axiosInstance.post<ApiResponse<FeedingPeriod>>(
      '/api/v1/feedings',
      data,
    );
    return res.data.data;
  },

  /**
   * Manually trigger coin feeding for an ACTIVE period.
   * Role: ADMIN only.
   */
  triggerNow: async (periodId: number): Promise<FeedingPeriod> => {
    const res = await axiosInstance.post<ApiResponse<FeedingPeriod>>(`/api/v1/feedings/${periodId}/trigger`);
    return res.data.data;
  },

  /**
   * Complete early an ACTIVE feeding period.
   * Role: ADMIN only.
   */
  complete: async (periodId: number): Promise<FeedingPeriod> => {
    const res = await axiosInstance.put<ApiResponse<FeedingPeriod>>(`/api/v1/feedings/${periodId}/complete`);
    return res.data.data;
  },

  /**
   * Get paginated list of feeding periods with optional filters.
   * Role: ADMIN only.
   */
  getAll: async (params: FeedingParams = {}): Promise<PaginationResponse<FeedingPeriod>> => {
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<FeedingPeriod>>>(
      '/api/v1/feedings',
      { params },
    );
    return res.data.data;
  },

  /**
   * Get detailed info of a feeding period.
   * Role: ADMIN only.
   */
  getById: async (periodId: number): Promise<FeedingPeriodDetail> => {
    const res = await axiosInstance.get<ApiResponse<FeedingPeriodDetail>>(
      `/api/v1/feedings/${periodId}`,
    );
    return res.data.data;
  },

  /**
   * Update an ACTIVE feeding period grant amount.
   * Role: ADMIN only.
   */
  update: async (periodId: number, data: UpdateFeedingRequest): Promise<FeedingPeriod> => {
    const res = await axiosInstance.put<ApiResponse<FeedingPeriod>>(
      `/api/v1/feedings/${periodId}`,
      data,
    );
    return res.data.data;
  },

  /**
   * Delete/Cancel a feeding period.
   * Role: ADMIN only.
   */
  delete: async (periodId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/feedings/${periodId}`);
  },
};
