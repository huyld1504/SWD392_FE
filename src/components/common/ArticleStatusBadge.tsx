import type { ArticleStatus } from '@/types';

const STATUS_CONFIG: Record<ArticleStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  APPROVED: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

interface ArticleStatusBadgeProps {
  status: ArticleStatus;
}

export default function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
