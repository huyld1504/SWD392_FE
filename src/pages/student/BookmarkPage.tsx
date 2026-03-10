import { useBookmarks, useToggleBookmark } from '@/hooks/useArticles';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BookmarkPage() {
  const navigate = useNavigate();
  const { data: bookmarks, isLoading } = useBookmarks();
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();

  if (isLoading) return <LoadingSpinner text="Đang tải bookmarks..." />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bookmark className="text-yellow-500" size={24} />
          Bài viết đã lưu
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookmarks?.length || 0} bài viết đã bookmark
        </p>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Chưa có bookmark nào</p>
          <p className="text-gray-400 text-sm mt-1">
            Hãy bookmark những bài viết bạn muốn đọc lại sau
          </p>
          <button
            onClick={() => navigate('/student/articles')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
          >
            Khám phá bài viết
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarks.map((article) => (
            <div
              key={article.articleId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group relative"
            >
              {/* Topic + Trash */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
                  {article.topic?.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(article.articleId);
                  }}
                  disabled={isPending}
                  className="text-gray-300 hover:text-red-500 transition-colors bg-white rounded-full p-1"
                  title="Bỏ lưu"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-teal-600 transition-colors line-clamp-2 group-hover:text-teal-600"
                onClick={() =>
                  navigate(`/student/articles/${article.articleId}`)
                }
              >
                {article.title}
              </h3>

              {/* Preview */}
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                {article.contentBody?.replace(/<[^>]*>/g, '').slice(0, 150)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 absolute bottom-5 w-[calc(100%-2.5rem)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-teal-600">
                      {article.author?.fullName?.charAt(0)}
                    </span>
                  </div>
                  <span className="truncate max-w-[100px]">{article.author?.fullName}</span>
                </div>
                <span>
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
              <div className="h-10"></div> {/* spacer for absolute footer */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
