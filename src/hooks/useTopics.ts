import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  topicApi, subjectApi,
  type CreateTopicRequest, type UpdateTopicRequest,
  type CreateSubjectRequest, type UpdateSubjectRequest,
} from '@/api/topicApi';
import type { TopicParams, SubjectParams } from '@/types';
import { toast } from 'sonner';

export const topicKeys = {
  all: ['topics'] as const,
  list: () => [...topicKeys.all, 'list'] as const,
  paginated: (params: TopicParams) => [...topicKeys.all, 'paginated', params] as const,
  bySubject: (subjectId: number) => [...topicKeys.all, 'subject', subjectId] as const,
};

export const subjectKeys = {
  all: ['subjects'] as const,
  list: () => [...subjectKeys.all, 'list'] as const,
  paginated: (params: SubjectParams) => [...subjectKeys.all, 'paginated', params] as const,
};

/** GET all topics (large page for dropdowns) */
export const useTopics = () =>
  useQuery({
    queryKey: topicKeys.list(),
    queryFn: () => topicApi.getAll({ pageSize: 100 }),
    staleTime: 10 * 60 * 1000,
  });

/** GET topics filtered by subject */
export const useTopicsBySubject = (subjectId: number) =>
  useQuery({
    queryKey: topicKeys.bySubject(subjectId),
    queryFn: () => topicApi.getAll({ subjectId, pageSize: 100 }),
    enabled: !!subjectId,
  });

/** GET all subjects (large page for dropdowns) */
export const useSubjects = () =>
  useQuery({
    queryKey: subjectKeys.list(),
    queryFn: () => subjectApi.getAll({ pageSize: 100 }),
    staleTime: 10 * 60 * 1000,
  });

/** GET topics with pagination (admin) */
export const useTopicsPaginated = (params: TopicParams = {}) =>
  useQuery({
    queryKey: topicKeys.paginated(params),
    queryFn: () => topicApi.getAll(params),
    placeholderData: (prev) => prev,
  });

/** GET subjects with pagination (admin) */
export const useSubjectsPaginated = (params: SubjectParams = {}) =>
  useQuery({
    queryKey: subjectKeys.paginated(params),
    queryFn: () => subjectApi.getAll(params),
    placeholderData: (prev) => prev,
  });

// ── Subject mutations ───────────────────────────────────────────────────────

export const useCreateSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectRequest) => subjectApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
      toast.success('Tạo môn học thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo thất bại!';
      toast.error(msg);
    },
  });
};

export const useUpdateSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectRequest }) => subjectApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
      toast.success('Cập nhật môn học thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật thất bại!';
      toast.error(msg);
    },
  });
};

export const useDeleteSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
      toast.success('Đã xóa môn học!');
    },
    onError: () => toast.error('Xóa thất bại!'),
  });
};

export const useRestoreSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.restore,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
      toast.success('Đã khôi phục môn học!');
    },
    onError: () => toast.error('Khôi phục thất bại!'),
  });
};

// ── Topic mutations ─────────────────────────────────────────────────────────

export const useCreateTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTopicRequest) => topicApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: topicKeys.all });
      toast.success('Tạo chủ đề thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo thất bại!';
      toast.error(msg);
    },
  });
};

export const useUpdateTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTopicRequest }) => topicApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: topicKeys.all });
      toast.success('Cập nhật chủ đề thành công!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật thất bại!';
      toast.error(msg);
    },
  });
};

export const useDeleteTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: topicApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: topicKeys.all });
      toast.success('Đã xóa chủ đề!');
    },
    onError: () => toast.error('Xóa thất bại!'),
  });
};

export const useRestoreTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: topicApi.restore,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: topicKeys.all });
      toast.success('Đã khôi phục chủ đề!');
    },
    onError: () => toast.error('Khôi phục thất bại!'),
  });
};
