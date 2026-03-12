import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmarkApi';
import { articleKeys } from '@/hooks/useArticles';
import type { BookmarkParams } from '@/types';
import { toast } from 'sonner';

// ==================== QUERY KEYS ====================
export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (params: BookmarkParams) => [...bookmarkKeys.lists(), params] as const,
};

// ==================== QUERIES ====================

/** GET paginated bookmarks for current user */
export const useBookmarks = (params: BookmarkParams = {}) =>
  useQuery({
    queryKey: bookmarkKeys.list(params),
    queryFn: () => bookmarkApi.getAll(params),
    placeholderData: (prev) => prev,
  });

// ==================== MUTATIONS ====================

/** ADD bookmark */
export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarkApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.details() });
      toast.success('Đã lưu bài viết!');
    },
    onError: () => toast.error('Lưu thất bại, vui lòng thử lại!'),
  });
};

/** REMOVE single bookmark */
export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarkApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.details() });
      toast.success('Đã bỏ lưu bài viết!');
    },
    onError: () => toast.error('Xóa thất bại, vui lòng thử lại!'),
  });
};

/** REMOVE multiple bookmarks */
export const useRemoveBookmarks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarkApi.removeMultiple,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      toast.success('Đã xóa các bookmark đã chọn!');
    },
    onError: () => toast.error('Xóa thất bại, vui lòng thử lại!'),
  });
};

/** REMOVE all bookmarks */
export const useRemoveAllBookmarks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarkApi.removeAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      toast.success('Đã xóa tất cả bookmark!');
    },
    onError: () => toast.error('Xóa thất bại, vui lòng thử lại!'),
  });
};
