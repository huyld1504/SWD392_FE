import axiosInstance from './axiosInstance';
import type { ApiResponse, FeedingPeriod, FeedingParams, PaginationResponse } from '@/types';

// ==================== REQUEST TYPES ====================
export interface ScheduleFeedingRequest {
  scheduledAt: string; // ISO datetime e.g. "2026-04-01T08:00:00"
}

// ==================== API CALLS ====================
export const feedingApi = {
  /**
   * Create a PENDING feeding period scheduled for a future date.
   * Role: ADMIN only.
   */
  schedule: async (data: ScheduleFeedingRequest): Promise<FeedingPeriod> => {
    const res = await axiosInstance.post<ApiResponse<FeedingPeriod>>(
      '/api/v1/feedings/schedule',
      data,
    );
    return res.data.data;
  },

  /**
   * Immediately execute a feeding reset for all active students (once per month).
   * Role: ADMIN only.
   */
  triggerNow: async (): Promise<FeedingPeriod> => {
    const res = await axiosInstance.post<ApiResponse<FeedingPeriod>>('/api/v1/feedings/trigger');
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
   * Get detailed info of a feeding period (including students sorted by earned balance).
   * Role: ADMIN only.
   */
  getById: async (periodId: number): Promise<FeedingPeriod> => {
    const res = await axiosInstance.get<ApiResponse<FeedingPeriod>>(
      `/api/v1/feedings/${periodId}`,
    );
    return res.data.data;
  },

  /**
   * Update the scheduledAt date of a PENDING feeding period.
   * Role: ADMIN only.
   */
  updateSchedule: async (periodId: number, data: ScheduleFeedingRequest): Promise<FeedingPeriod> => {
    const res = await axiosInstance.put<ApiResponse<FeedingPeriod>>(
      `/api/v1/feedings/${periodId}`,
      data,
    );
    return res.data.data;
  },

  /**
   * Delete a PENDING feeding period. Only PENDING periods can be deleted.
   * Role: ADMIN only.
   */
  delete: async (periodId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/feedings/${periodId}`);
  },
};
