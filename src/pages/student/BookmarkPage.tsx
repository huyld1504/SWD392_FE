import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks, useRemoveBookmark, useRemoveAllBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button, Input, Pagination, Popconfirm, Skeleton, Empty } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
};

const PAGE_SIZE = 12;

export default function BookmarkPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data, isLoading } = useBookmarks({ page, pageSize: PAGE_SIZE, keyword });
  const bookmarks = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  const { mutate: removeBookmark, isPending: isRemoving } = useRemoveBookmark();
  const { mutate: removeAll, isPending: isRemovingAll } = useRemoveAllBookmarks();

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  if (isLoading && page === 1 && !keyword) return <LoadingSpinner text="Đang tải bookmarks..." />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="text-yellow-500" size={24} />
            Bài viết đã lưu
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} bài viết đã bookmark</p>
        </div>
        {total > 0 && (
          <Popconfirm
            title="Xóa tất cả bookmark?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa tất cả"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => removeAll()}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isRemovingAll}
            >
              Xóa tất cả
            </Button>
          </Popconfirm>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Tìm kiếm trong bookmark..."
          size="large"
          allowClear
          suffix={<SearchOutlined className="text-gray-400 cursor-pointer" onClick={handleSearch} />}
          onClear={() => { setKeyword(''); setPage(1); }}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <Empty
          image={<BookOpen className="mx-auto text-gray-300" size={48} />}
          description={
            keyword
              ? <span className="text-gray-500">Không tìm thấy bookmark nào với từ khóa "{keyword}"</span>
              : <span className="text-gray-500">Chưa có bookmark nào</span>
          }
        >
          {!keyword && (
            <Button type="primary" onClick={() => navigate('/student/articles')}
              style={{ background: '#0d9488', borderColor: '#0d9488' }}>
              Khám phá bài viết
            </Button>
          )}
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookmarks.map((article) => (
              <div
                key={article.articleId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group relative"
              >
                {/* Topic + Trash */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
                    {article.topicName}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBookmark(article.articleId); }}
                    disabled={isRemoving}
                    className="text-gray-300 hover:text-red-500 transition-colors bg-white rounded-full p-1"
                    title="Bỏ lưu"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-teal-600 transition-colors line-clamp-2 group-hover:text-teal-600"
                  onClick={() => navigate(`/student/articles/${article.articleId}`)}
                >
                  {article.title}
                </h3>

                {/* Preview */}
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {stripHtml(article.contentBody ?? '').slice(0, 150)}...
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 absolute bottom-5 w-[calc(100%-2.5rem)]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-teal-600">
                        {article.author?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="truncate max-w-[100px]">{article.author?.name}</span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(article.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
                <div className="h-10" />
              </div>
            ))}
          </div>

          {total > PAGE_SIZE && (
            <div className="flex justify-center mt-8 pb-8">
              <Pagination
                current={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
