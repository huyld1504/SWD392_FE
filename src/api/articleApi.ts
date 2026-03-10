import axiosInstance from './axiosInstance';
import type { ApiResponse, Article, ArticleParams, PaginationResponse } from '@/types';

// ==================== REQUEST TYPES ====================
export interface CreateArticleRequest {
  title: string;
  contentBody: string;
  topicId: number;
}

export interface UpdateArticleRequest {
  title?: string;
  contentBody?: string;
  topicId?: number;
}

// ==================== API CALLS ====================
export const articleApi = {
  // GET all approved articles (public / student)
 getAll: async (params: ArticleParams): Promise<PaginationResponse<Article>> => {
  const { page = 1, pageSize, keyword, sort, direction, ...rest } = params;
  const res = await axiosInstance.get<ApiResponse<PaginationResponse<Article>>>(
    '/api/v1/articles',
    {
      params: {
        ...rest,
        page: page - 1,   
        size: pageSize,
        keyword,
        sort,
        direction,
      },
    },
  );
  return res.data.data;
},

  // GET article by ID
  getById: async (id: number): Promise<Article> => {
    const res = await axiosInstance.get<ApiResponse<Article>>(`/api/v1/articles/${id}`);
    return res.data.data;
  },

  // GET my articles (lecture)
  // getMyArticles: async (params: ArticleParams): Promise<PaginationResponse<Article>> => {
  //   const res = await axiosInstance.get<ApiResponse<PaginationResponse<Article>>>(
  //     '/api/v1/articles/my',
  //     { params },
  //   );
  //   return res.data.data;
  // },

  // POST create article (lecture)
  create: async (data: CreateArticleRequest): Promise<Article> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('contentBody', data.contentBody);
    formData.append('topicId', data.topicId.toString());

    const res = await axiosInstance.post<ApiResponse<Article>>('/api/v1/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  // PUT update article (lecture, only PENDING)
  update: async (id: number, data: UpdateArticleRequest): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}`,
      data,
    );
    return res.data.data;
  },

  // DELETE article (lecture, only PENDING)
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/articles/${id}`);
  },

  // PUT restore article (admin)
  restore: async (id: number): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/restore`,
    );
    return res.data.data;
  },

  // PATCH approve article (admin)
  approve: async (id: number): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/approve`,
    );
    return res.data.data;
  },

  // PATCH reject article (admin)
  reject: async (id: number, reason: string): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/reject`,
      { reason },
    );
    return res.data.data;
  },

  // POST toggle bookmark (student)
  toggleBookmark: async (id: number): Promise<void> => {
    await axiosInstance.post(`/api/v1/articles/${id}/bookmark`);
  },

  // GET bookmarked articles (student)
  getBookmarks: async (): Promise<Article[]> => {
    const res = await axiosInstance.get<ApiResponse<Article[]>>(
      '/api/v1/articles/bookmarks',
    );
    return res.data.data;
  },
};
