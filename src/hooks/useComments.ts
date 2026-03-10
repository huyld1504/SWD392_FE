import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/api/commentApi';
import type { CreateCommentRequest } from '@/api/commentApi';
import { articleKeys } from './useArticles';
import { toast } from 'sonner';

export const commentKeys = {
  all: ['comments'] as const,
  byArticle: (articleId: number) => [...commentKeys.all, 'article', articleId] as const,
};

/** GET comments for article */
export const useComments = (articleId: number) =>
  useQuery({
    queryKey: commentKeys.byArticle(articleId),
    queryFn: () => commentApi.getByArticle(articleId),
    enabled: !!articleId,
  });

/** CREATE comment */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentApi.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byArticle(variables.articleId),
      });
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.articleId),
      });
      toast.success('Bình luận thành công!');
    },
    onError: () => toast.error('Không thể bình luận!'),
  });
};

/** DELETE comment */
export const useDeleteComment = (articleId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byArticle(articleId),
      });
      toast.success('Đã xóa bình luận!');
    },
  });
};
