import { useState } from 'react';
import { useMyArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useUIStore } from '@/stores/uiStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import ArticleStatusBadge from '@/components/common/ArticleStatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ArticleStatus } from '@/types';

export default function MyArticlesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const { openModal, closeModal, modal } = useUIStore();

  const { data, isLoading } = useMyArticles({
    page,
    pageSize: 10,
    status: statusFilter || undefined,
  });
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

  const handleDelete = () => {
    const article = modal.data as { articleId: number } | undefined;
    if (!article) return;
    deleteArticle(article.articleId, {
      onSuccess: () => closeModal(),
    });
  };

  const filterOptions: { value: ArticleStatus | ''; label: string }[] = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Từ chối' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài viết của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.total || 0} bài viết</p>
        </div>
        <button
          onClick={() => navigate('/lecture/articles/new')}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Tạo bài viết
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setStatusFilter(opt.value);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${statusFilter === opt.value
              ? 'bg-teal-600 text-white border-teal-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải bài viết..." />
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Không có bài viết nào</p>
          <button
            onClick={() => navigate('/lecture/articles/new')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
          >
            Tạo bài viết đầu tiên
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Tiêu đề</th>
                <th className="text-left px-6 py-3 font-medium">Chủ đề</th>
                <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
                <th className="text-left px-6 py-3 font-medium">Ngày tạo</th>
                <th className="text-left px-6 py-3 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.items?.map((article: any, idx: number) => (
                <tr key={article.articleId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(page - 1) * 10 + idx + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs">
                    <span className="line-clamp-1">{article.title}</span>
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
                            onClick={() =>
                              navigate(
                                `/lecture/articles/${article.articleId}/edit`,
                              )
                            }
                            className="p-1.5 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openModal('DELETE', article)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
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
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
              >
                ← Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.type === 'DELETE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xóa bài viết</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn
              tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
