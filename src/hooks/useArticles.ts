import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleApi } from '@/api/articleApi';
import type { ArticleParams, Article } from '@/types';
import type { CreateArticleRequest, UpdateArticleRequest } from '@/api/articleApi';
import { toast } from 'sonner';

// ==================== QUERY KEYS ====================
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: ArticleParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
  myArticles: () => [...articleKeys.all, 'my'] as const,
  myList: (params: ArticleParams) => [...articleKeys.myArticles(), params] as const,
};

// ==================== QUERIES ====================

/** GET approved articles (student view) */
export const useArticles = (params: ArticleParams) =>
  useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () => articleApi.getAll(params),
    placeholderData: (prev) => prev,
  });

/** GET single article */
export const useArticle = (id: number) =>
  useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => articleApi.getById(id),
    enabled: !!id,
  });

/** GET my articles (lecture view) */
export const useMyArticles = (params: ArticleParams) =>
  useQuery({
    queryKey: articleKeys.myList(params),
    queryFn: () => articleApi.getMyArticles(params),
    placeholderData: (prev) => prev,
  });

// ==================== MUTATIONS ====================

/** CREATE article */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateArticleRequest) => articleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.myArticles() });
      toast.success('Tạo bài viết thành công! Đang chờ duyệt...');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Có lỗi xảy ra!';
      toast.error(message);
    },
  });
};

/** UPDATE article */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateArticleRequest }) =>
      articleApi.update(id, data),
    onSuccess: (updated: Article) => {
      queryClient.setQueryData(articleKeys.detail(updated.articleId), updated);
      queryClient.invalidateQueries({ queryKey: articleKeys.myArticles() });
      toast.success('Cập nhật bài viết thành công!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Có lỗi xảy ra!';
      toast.error(message);
    },
  });
};

/** DELETE article */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.myArticles() });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success('Xóa bài viết thành công!');
    },
    onError: () => toast.error('Xóa thất bại!'),
  });
};

/** APPROVE article (admin) */
export const useApproveArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleApi.approve,
    onSuccess: (updated: Article) => {
      queryClient.setQueryData(articleKeys.detail(updated.articleId), updated);
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success('Đã duyệt bài viết!');
    },
  });
};

/** REJECT article (admin) */
export const useRejectArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      articleApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.info('Đã từ chối bài viết.');
    },
  });
};


