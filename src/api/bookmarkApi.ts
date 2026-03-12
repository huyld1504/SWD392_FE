import axiosInstance from './axiosInstance';
import type { ApiResponse, Article, BookmarkParams, PaginationResponse } from '@/types';

export const bookmarkApi = {
  /** POST /api/bookmarks/{articleId} — Add bookmark */
  add: async (articleId: number): Promise<void> => {
    await axiosInstance.post(`/api/bookmarks/${articleId}`);
  },

  /** GET /api/bookmarks?keyword=&page=0&size=10 — Get my bookmarks (paginated) */
  getAll: async (params: BookmarkParams = {}): Promise<PaginationResponse<Article>> => {
    const { page = 1, pageSize = 10, keyword } = params;
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Article>>>(
      '/api/bookmarks',
      { params: { keyword: keyword || undefined, page: page - 1, size: pageSize } },
    );
    return res.data.data;
  },

  /** DELETE /api/bookmarks/{articleId} — Remove single bookmark */
  remove: async (articleId: number): Promise<void> => {
    await axiosInstance.delete(`/api/bookmarks/${articleId}`);
  },

  /** DELETE /api/bookmarks — Remove multiple bookmarks */
  removeMultiple: async (articleIds: number[]): Promise<void> => {
    await axiosInstance.delete('/api/bookmarks', { data: { articleIds } });
  },

  /** DELETE /api/bookmarks/all — Remove all bookmarks */
  removeAll: async (): Promise<void> => {
    await axiosInstance.delete('/api/bookmarks/all');
  },
};
