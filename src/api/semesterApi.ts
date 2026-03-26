import axiosInstance from './axiosInstance';
import type { ApiResponse, PaginationResponse, Semester, SemesterLeaderboardEntry, SemesterParams } from '@/types';

export interface CreateSemesterRequest {
  semesterCode: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSemesterRequest {
  startDate?: string;
  endDate?: string;
}

interface SemesterLeaderboardApiItem {
  rank?: number;
  totalDonationReceived?: number;
  donationCount?: number;
  approvedArticleCount?: number;
  student: {
    userId: number;
    name?: string;
    fullName?: string;
    email: string;
    avatarUrl?: string | null;
  };
}

const toApiParams = (params: SemesterParams = {}) => {
  const { page = 1, pageSize, keyword, sort, direction, ...rest } = params;
  return { ...rest, page: page - 1, size: pageSize, keyword, sort, direction };
};

export const semesterApi = {
  getAll: async (params: SemesterParams = {}): Promise<PaginationResponse<Semester>> => {
    const res = await axiosInstance.get('/api/v1/semesters', { params: toApiParams(params) });
    const data = res.data?.data;
    if (Array.isArray(data)) return { data, totalItems: data.length, totalPages: 1, currentPage: 0, pageSize: data.length };
    return data;
  },

  getByCode: async (semesterCode: string): Promise<Semester> => {
    const res = await axiosInstance.get<ApiResponse<Semester>>(`/api/v1/semesters/${semesterCode}`);
    return res.data.data;
  },

  getLeaderboard: async (semesterCode: string): Promise<SemesterLeaderboardEntry[]> => {
    const res = await axiosInstance.get<ApiResponse<SemesterLeaderboardApiItem[]>>(
      `/api/v1/semesters/${semesterCode}/leaderboard`,
    );
    const items = res.data.data ?? [];
    return items.map((item, idx): SemesterLeaderboardEntry => {
      const fullName = item.student.fullName ?? item.student.name ?? 'Ẩn danh';
      const totalReceived = item.totalDonationReceived ?? 0;
      return {
        userId: item.student.userId,
        fullName,
        email: item.student.email,
        avatarUrl: item.student.avatarUrl ?? null,
        totalReceived,
        donationCount: item.donationCount,
        approvedArticleCount: item.approvedArticleCount,
        rank: item.rank ?? idx + 1,
      };
    });
  },

  create: async (payload: CreateSemesterRequest): Promise<Semester> => {
    const res = await axiosInstance.post<ApiResponse<Semester>>('/api/v1/semesters', payload);
    return res.data.data;
  },

  update: async (semesterCode: string, payload: UpdateSemesterRequest): Promise<Semester> => {
    const res = await axiosInstance.put<ApiResponse<Semester>>(`/api/v1/semesters/${semesterCode}`, payload);
    return res.data.data;
  },

  delete: async (semesterCode: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/semesters/${semesterCode}`);
  },

  restore: async (semesterCode: string): Promise<Semester> => {
    const res = await axiosInstance.put<ApiResponse<Semester>>(`/api/v1/semesters/${semesterCode}/restore`);
    return res.data.data;
  },
};
