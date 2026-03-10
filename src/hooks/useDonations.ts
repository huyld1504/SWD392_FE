import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationApi, type DonateRequest } from '@/api/donationApi';
import type { DonationParams } from '@/types';
import { walletKeys } from './useWallets';
import { toast } from 'sonner';

export const donationKeys = {
  all: ['donations'] as const,
  byArticle: (articleId: number) => [...donationKeys.all, 'article', articleId] as const,
  myHistory: () => [...donationKeys.all, 'myHistory'] as const,
};

/** GET all donations for a specific article */
export const useArticleDonations = (articleId: number, params: DonationParams = {}) =>
  useQuery({
    queryKey: [...donationKeys.byArticle(articleId), params],
    queryFn: () => donationApi.getByArticle(articleId, params),
    enabled: !!articleId,
  });

/** MUTATION: Donate to author */
export const useDonate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DonateRequest) => donationApi.donate(data),
    onSuccess: (_, variables) => {
      // Invalidate donations for the article
      queryClient.invalidateQueries({ queryKey: donationKeys.byArticle(variables.articleId) });
      // Invalidate user's wallet to reflect new balance
      queryClient.invalidateQueries({ queryKey: walletKeys.myWallets() });
      toast.success('Đã ủng hộ tác giả thành công! Cảm ơn bạn 💙');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Có lỗi xảy ra khi ủng hộ!';
      toast.error(message);
    },
  });
};
