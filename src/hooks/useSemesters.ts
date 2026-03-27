import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { semesterApi, type CreateSemesterRequest, type UpdateSemesterRequest } from '@/api/semesterApi';
import type { SemesterLeaderboardEntry, SemesterParams } from '@/types';
import { toast } from 'sonner';

export const semesterKeys = {
  all: ['semesters'] as const,
  list: (params: SemesterParams = {}) => [...semesterKeys.all, 'list', params] as const,
  leaderboard: (semesterCode: string | undefined) => [...semesterKeys.all, 'leaderboard', semesterCode] as const,
};

export const useSemesters = (params: SemesterParams = {}) =>
  useQuery({
    queryKey: semesterKeys.list(params),
    queryFn: () => semesterApi.getAll(params),
    placeholderData: (prev) => prev,
  });

export const useSemesterLeaderboard = (semesterCode?: string) =>
  useQuery<SemesterLeaderboardEntry[]>({
    queryKey: semesterKeys.leaderboard(semesterCode),
    queryFn: () => {
      if (!semesterCode) throw new Error('semesterCode is required');
      return semesterApi.getLeaderboard(semesterCode);
    },
    enabled: Boolean(semesterCode),
  });

export const useCreateSemester = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSemesterRequest) => semesterApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: semesterKeys.all });
      toast.success('Tạo kỳ học thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo kỳ học thất bại!';
      toast.error(msg);
    },
  });
};

export const useUpdateSemester = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: UpdateSemesterRequest }) => semesterApi.update(code, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: semesterKeys.all });
      toast.success('Cập nhật kỳ học thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật kỳ học thất bại!';
      toast.error(msg);
    },
  });
};

export const useDeleteSemester = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: semesterApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: semesterKeys.all });
      toast.success('Đã xóa kỳ học!');
    },
    onError: () => toast.error('Xóa kỳ học thất bại!'),
  });
};

export const useRestoreSemester = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: semesterApi.restore,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: semesterKeys.all });
      toast.success('Đã khôi phục kỳ học!');
    },
    onError: () => toast.error('Khôi phục thất bại!'),
  });
};
