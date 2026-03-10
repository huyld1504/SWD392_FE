import axiosInstance from './axiosInstance';
import type { ApiResponse, Topic, Subject, TopicParams, SubjectParams, PaginationResponse } from '@/types';

// ==================== REQUEST TYPES ====================
export interface CreateTopicRequest {
  subjectId: number;
  name: string;
  description?: string;
}

export interface UpdateTopicRequest {
  subjectId?: number;
  name?: string;
  description?: string;
}

export interface CreateSubjectRequest {
  subjectCode: string;
  name: string;
  description?: string;
}

export interface UpdateSubjectRequest {
  subjectCode?: string;
  name?: string;
  description?: string;
}

// ==================== HELPER ====================
const toApiParams = (params: TopicParams | SubjectParams) => {
  const { page = 1, pageSize, keyword, sort, direction, ...rest } = params as TopicParams;
  return { ...rest, page: page - 1, size: pageSize, keyword, sort, direction };
};

// ==================== TOPIC API ====================
export const topicApi = {
  getAll: async (params: TopicParams = {}): Promise<PaginationResponse<Topic>> => {
    const res = await axiosInstance.get('/api/v1/topics', { params: toApiParams(params) });
    const data = res.data?.data;
    // Fallback: if the response is a raw array (legacy), wrap it
    if (Array.isArray(data)) return { data, totalItems: data.length, totalPages: 1, currentPage: 0, pageSize: data.length };
    return data;
  },

  getById: async (id: number): Promise<Topic> => {
    const res = await axiosInstance.get<ApiResponse<Topic>>(`/api/v1/topics/${id}`);
    return res.data.data;
  },

  create: async (data: CreateTopicRequest): Promise<Topic> => {
    const res = await axiosInstance.post<ApiResponse<Topic>>('/api/v1/topics', data);
    return res.data.data;
  },

  update: async (id: number, data: UpdateTopicRequest): Promise<Topic> => {
    const res = await axiosInstance.put<ApiResponse<Topic>>(`/api/v1/topics/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/topics/${id}`);
  },

  restore: async (id: number): Promise<Topic> => {
    const res = await axiosInstance.put<ApiResponse<Topic>>(`/api/v1/topics/${id}/restore`);
    return res.data.data;
  },
};

// ==================== SUBJECT API ====================
export const subjectApi = {
  getAll: async (params: SubjectParams = {}): Promise<PaginationResponse<Subject>> => {
    const res = await axiosInstance.get('/api/v1/subjects', { params: toApiParams(params) });
    const data = res.data?.data;
    if (Array.isArray(data)) return { data, totalItems: data.length, totalPages: 1, currentPage: 0, pageSize: data.length };
    return data;
  },

  getById: async (id: number): Promise<Subject> => {
    const res = await axiosInstance.get<ApiResponse<Subject>>(`/api/v1/subjects/${id}`);
    return res.data.data;
  },

  create: async (data: CreateSubjectRequest): Promise<Subject> => {
    const res = await axiosInstance.post<ApiResponse<Subject>>('/api/v1/subjects', data);
    return res.data.data;
  },

  update: async (id: number, data: UpdateSubjectRequest): Promise<Subject> => {
    const res = await axiosInstance.put<ApiResponse<Subject>>(`/api/v1/subjects/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/subjects/${id}`);
  },

  restore: async (id: number): Promise<Subject> => {
    const res = await axiosInstance.put<ApiResponse<Subject>>(`/api/v1/subjects/${id}/restore`);
    return res.data.data;
  },
};
