import { useState } from 'react';
import { useArticles, useApproveArticle, useRejectArticle } from '@/hooks/useArticles';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, FileText, Search, Filter } from 'lucide-react';
import ArticleStatusBadge from '@/components/common/ArticleStatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ArticleStatus } from '@/types';

export default function AdminArticlesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('PENDING');
  const [rejectModal, setRejectModal] = useState<{ id: number; title: string } | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useArticles({
    page: page,
    pageSize: 10,
    // status: statusFilter || undefined,
  });

  const { mutate: approveArticle, isPending: isApproving } = useApproveArticle();
  const { mutate: rejectArticle, isPending: isRejecting } = useRejectArticle();

  const handleReject = () => {
    if (!rejectModal || !rejectReason.trim()) return;
    rejectArticle(
      { id: rejectModal.id, reason: rejectReason },
      {
        onSuccess: () => {
          setRejectModal(null);
          setRejectReason('');
        },
      },
    );
  };

  const filterOptions: { value: ArticleStatus | ''; label: string }[] = [
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Từ chối' },
    { value: '', label: 'Tất cả' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
        <p className="text-sm text-gray-500 mt-1">Duyệt và quản lý bài viết từ giảng viên</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white mr-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
          </div>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${statusFilter === opt.value
                ? 'bg-teal-50 border-teal-300 text-teal-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải..." />
      ) : (data?.data?.length ?? 0) === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Không có bài viết nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Tiêu đề</th>
                <th className="text-left px-6 py-3 font-medium">Tác giả</th>
                <th className="text-left px-6 py-3 font-medium">Chủ đề</th>
                <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
                <th className="text-left px-6 py-3 font-medium">Ngày tạo</th>
                <th className="text-left px-6 py-3 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((article: any, idx) => (
                <tr
                  key={article.articleId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(page - 1) * 10 + idx + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs">
                    <span className="line-clamp-1">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.author?.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.topic?.name}
                  </td>
                  <td className="px-6 py-4">
                    <ArticleStatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/lecture/articles/${article.articleId}`)
                        }
                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      {article.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => approveArticle(article.articleId)}
                            disabled={isApproving}
                            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duyệt"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setRejectModal({
                                id: article.articleId,
                                title: article.title,
                              })
                            }
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Từ chối"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 rounded-b-xl px-6">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                Trước
              </button>
              <span className="text-sm text-gray-500">
                Trang {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                Tiếp
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Từ chối bài viết
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Bài viết: <strong>{rejectModal.title}</strong>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mt-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
            />
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isRejecting ? 'Đang xử lý...' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
