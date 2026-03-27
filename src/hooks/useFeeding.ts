import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedingApi, type CreateFeedingRequest, type UpdateFeedingRequest } from '@/api/feedingApi';
import type { FeedingParams } from '@/types';
import { toast } from 'sonner';

export const feedingKeys = {
  all: ['feedings'] as const,
  list: (params: FeedingParams) => [...feedingKeys.all, 'list', params] as const,
  detail: (id: number) => [...feedingKeys.all, 'detail', id] as const,
};

/** GET paginated feeding periods */
export const useFeedings = (params: FeedingParams = {}) =>
  useQuery({
    queryKey: feedingKeys.list(params),
    queryFn: () => feedingApi.getAll(params),
    placeholderData: (prev) => prev,
  });

/** GET detailed info of a feeding period */
export const useFeedingDetail = (id: number, enabled: boolean = true) =>
  useQuery({
    queryKey: feedingKeys.detail(id),
    queryFn: () => feedingApi.getById(id),
    enabled,
  });

/** MUTATION: Create a new feeding period */
export const useCreateFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeedingRequest) => feedingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      toast.success('Đã tạo kỳ Feeding mới!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tạo kỳ Feeding!';
      toast.error(message);
    },
  });
};

/** MUTATION: Update a feeding period */
export const useUpdateFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ periodId, data }: { periodId: number; data: UpdateFeedingRequest }) => feedingApi.update(periodId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      queryClient.invalidateQueries({ queryKey: feedingKeys.detail(variables.periodId) });
      toast.success('Đã cập nhật kỳ Feeding!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể cập nhật kỳ Feeding!';
      toast.error(message);
    },
  });
};

/** MUTATION: Trigger feeding immediately */
export const useTriggerFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periodId: number) => feedingApi.triggerNow(periodId),
    onSuccess: (_, periodId) => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      queryClient.invalidateQueries({ queryKey: feedingKeys.detail(periodId) });
      toast.success('Đã kích hoạt phát Coin!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể trigger Feeding ngay lúc này!';
      toast.error(message);
    },
  });
};

/** MUTATION: Complete feeding period early */
export const useCompleteFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periodId: number) => feedingApi.complete(periodId),
    onSuccess: (_, periodId) => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      queryClient.invalidateQueries({ queryKey: feedingKeys.detail(periodId) });
      toast.success('Đã kết thúc kỳ Feeding!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể kết thúc kỳ Feeding!';
      toast.error(message);
    },
  });
};

/** MUTATION: Delete a feeding period */
export const useDeleteFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periodId: number) => feedingApi.delete(periodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      toast.success('Đã xóa kỳ Feeding!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể xóa kỳ Feeding!';
      toast.error(message);
    },
  });
};
