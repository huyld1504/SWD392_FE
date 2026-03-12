import { useMyArticles } from '@/hooks/useArticles';
import { useAuthStore } from '@/stores/authStore';
import { FileText, Clock, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleStatusBadge from '@/components/common/ArticleStatusBadge';

export default function LectureDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: pendingData } = useMyArticles({ page: 1, pageSize: 1, status: 'PENDING' });
  const { data: approvedData } = useMyArticles({ page: 1, pageSize: 1, status: 'APPROVED' });
  const { data: rejectedData } = useMyArticles({ page: 1, pageSize: 1, status: 'REJECTED' });
  const { data: recentArticles, isLoading } = useMyArticles({ page: 1, pageSize: 5 });

  const stats = [
    {
      label: 'Chờ duyệt',
      value: pendingData?.totalItems || 0,
      icon: <Clock size={24} />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Đã duyệt',
      value: approvedData?.totalItems || 0,
      icon: <CheckCircle size={24} />,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Bị từ chối',
      value: rejectedData?.totalItems || 0,
      icon: <XCircle size={24} />,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Tổng bài viết',
      value: recentArticles?.totalItems || 0,
      icon: <FileText size={24} />,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {user?.fullName}! 📝
          </h1>
          <p className="text-gray-500 mt-1">Quản lý bài viết của bạn tại đây</p>
        </div>
        <Link
          to="/lecture/articles/new"
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <PlusCircle size={18} />
          Tạo bài viết
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bài viết gần đây</h2>
          <Link
            to="/lecture/articles"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentArticles?.data.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Bạn chưa có bài viết nào</p>
            <Link
              to="/lecture/articles/new"
              className="inline-block mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Tạo bài viết đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentArticles?.data.map((article: any) => {
              return (
                <Link
                  key={article.articleId}
                  to={`/lecture/articles/${article.articleId}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500">{article.topic?.name}</p>
                  </div>
                  <ArticleStatusBadge status={article.status} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
