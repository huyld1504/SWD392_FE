import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/api/commentApi';
import type { CreateCommentRequest } from '@/api/commentApi';
import type { CommentParams } from '@/types';
import { articleKeys } from './useArticles';
import { toast } from 'sonner';

export const commentKeys = {
  all: ['comments'] as const,
  byArticle: (articleId: number, params?: CommentParams) =>
    [...commentKeys.all, 'article', articleId, params ?? {}] as const,
};

/** GET paginated comments for article */
export const useComments = (articleId: number, params: CommentParams = {}) =>
  useQuery({
    queryKey: commentKeys.byArticle(articleId, params),
    queryFn: () => commentApi.getByArticle(articleId, params),
    enabled: !!articleId,
  });

/** CREATE comment (root or reply) */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentApi.create(data),
    onSuccess: (_data, variables) => {
      // Invalidate all pages of comments for this article
      queryClient.invalidateQueries({
        queryKey: [...commentKeys.all, 'article', variables.articleId],
      });
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.articleId),
      });
      toast.success('Bình luận thành công!');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Không thể bình luận!';
      toast.error(msg);
    },
  });
};

/** DELETE comment */
export const useDeleteComment = (articleId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...commentKeys.all, 'article', articleId],
      });
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(articleId),
      });
      toast.success('Đã xóa bình luận!');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Không thể xóa bình luận!';
      toast.error(msg);
    },
  });
};

/** PIN comment (Admin only) */
export const usePinComment = (articleId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.pin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...commentKeys.all, 'article', articleId],
      });
      toast.success('Đã ghim bình luận!');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Không thể ghim bình luận!';
      toast.error(msg);
    },
  });
};
