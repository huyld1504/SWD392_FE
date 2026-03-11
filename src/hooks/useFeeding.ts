import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedingApi, type ScheduleFeedingRequest } from '@/api/feedingApi';
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

/** MUTATION: Schedule a new feeding period */
export const useScheduleFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleFeedingRequest) => feedingApi.schedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      toast.success('Đã tạo lịch Feeding mới!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tạo lịch Feeding!';
      toast.error(message);
    },
  });
};

/** MUTATION: Trigger feeding immediately */
export const useTriggerFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: feedingApi.triggerNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      toast.success('Đã kích hoạt Feeding thành công!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể trigger Feeding ngay lúc này!';
      toast.error(message);
    },
  });
};

/** MUTATION: Delete a PENDING feeding period */
export const useDeleteFeeding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: feedingApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all });
      toast.success('Đã xóa lịch Feeding!');
    },
    onError: () => toast.error('Không thể xóa Feeding!'),
  });
};
