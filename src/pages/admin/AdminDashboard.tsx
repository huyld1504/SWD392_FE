import { BarChart3, FileText, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';

export default function AdminDashboard() {
  const { data: pendingData } = useArticles({ page: 1, pageSize: 1, status: 'PENDING' });
  const { data: approvedData } = useArticles({ page: 1, pageSize: 1, status: 'APPROVED' });
  const { data: rejectedData } = useArticles({ page: 1, pageSize: 1, status: 'REJECTED' });

  const stats = [
    {
      label: 'Chờ duyệt',
      value: pendingData?.total ?? '-',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Đã duyệt',
      value: approvedData?.total ?? '-',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Đã từ chối',
      value: rejectedData?.total ?? '-',
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Tổng bài viết',
      value:
        pendingData && approvedData && rejectedData
          ? (pendingData.total + approvedData.total + rejectedData.total)
          : '-',
      icon: FileText,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hệ thống StudyShare</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${s.color}`}>
                <s.icon size={20} />
              </div>
              <BarChart3 size={16} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} />
          Hành động nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/articles"
            className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/50 transition-colors group"
          >
            <FileText className="text-teal-600 mb-2" size={24} />
            <p className="font-medium text-gray-800 group-hover:text-teal-700">
              Duyệt bài viết
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {pendingData?.total ?? 0} bài đang chờ duyệt
            </p>
          </a>
          <div className="p-4 border border-gray-200 rounded-xl text-gray-400">
            <Users className="mb-2" size={24} />
            <p className="font-medium">Quản lý người dùng</p>
            <p className="text-sm mt-1">Coming soon</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-xl text-gray-400">
            <BarChart3 className="mb-2" size={24} />
            <p className="font-medium">Thống kê</p>
            <p className="text-sm mt-1">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
