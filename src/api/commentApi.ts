import axiosInstance from './axiosInstance';
import type { ApiResponse, Comment } from '@/types';

export interface CreateCommentRequest {
  content: string;
  articleId: number;
}

export const commentApi = {
  getByArticle: async (articleId: number): Promise<Comment[]> => {
    const res = await axiosInstance.get<ApiResponse<Comment[]>>(
      `/api/v1/articles/${articleId}/comments`,
    );
    return res.data.data;
  },

  create: async (data: CreateCommentRequest): Promise<Comment> => {
    const res = await axiosInstance.post<ApiResponse<Comment>>(
      `/api/v1/articles/${data.articleId}/comments`,
      { content: data.content },
    );
    return res.data.data;
  },

  delete: async (commentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/comments/${commentId}`);
  },
};
