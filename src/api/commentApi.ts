import axiosInstance from './axiosInstance';
import type { ApiResponse, Comment, CommentParams, PaginationResponse } from '@/types';

// ==================== Request DTOs ====================

export interface CreateCommentRequest {
  articleId: number;
  parentId?: number | null;
  content: string;
  ratingStar?: number | null;
}

// ==================== API ====================

export const commentApi = {
  /**
   * GET /api/v1/comments/article/{articleId}
   * Public — không cần đăng nhập
   * Trả về paginated root comments (kèm replies bên trong)
   */
  getByArticle: async (
    articleId: number,
    params: CommentParams = {},
  ): Promise<PaginationResponse<Comment>> => {
    const { page = 0, size = 10, sort = 'createdAt', direction = 'desc' } = params;
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Comment>>>(
      `/api/v1/comments/article/${articleId}`,
      { params: { page, size, sort, direction } },
    );
    return res.data.data;
  },

  /**
   * POST /api/v1/comments
   * 🔒 JWT required
   *
   * Root comment: parentId = null, ratingStar = 1-5 (bắt buộc)
   * Reply:        parentId = rootId, ratingStar = null (bắt buộc null)
   */
  create: async (data: CreateCommentRequest): Promise<Comment> => {
    const res = await axiosInstance.post<ApiResponse<Comment>>(
      '/api/v1/comments',
      {
        articleId: data.articleId,
        parentId: data.parentId ?? null,
        content: data.content,
        ratingStar: data.ratingStar ?? null,
      },
    );
    return res.data.data;
  },

  /**
   * DELETE /api/v1/comments/{commentId}
   * 🔒 JWT required
   * User chỉ xóa comment của mình, Admin xóa tất cả
   * Cascade: xóa root → xóa hết replies
   */
  delete: async (commentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/comments/${commentId}`);
  },

  /**
   * PUT /api/v1/comments/pin/{commentId}
   * 🔒 Admin only
   * Chỉ pin root comment, 1 pin / article, auto-unpin comment cũ
   */
  pin: async (commentId: number): Promise<Comment> => {
    const res = await axiosInstance.put<ApiResponse<Comment>>(
      `/api/v1/comments/pin/${commentId}`,
    );
    return res.data.data;
  },
};
