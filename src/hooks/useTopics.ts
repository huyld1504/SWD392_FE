import { useQuery } from '@tanstack/react-query';
import { topicApi, subjectApi } from '@/api/topicApi';

export const topicKeys = {
  all: ['topics'] as const,
  list: () => [...topicKeys.all, 'list'] as const,
  bySubject: (subjectId: number) => [...topicKeys.all, 'subject', subjectId] as const,
};

export const subjectKeys = {
  all: ['subjects'] as const,
  list: () => [...subjectKeys.all, 'list'] as const,
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
