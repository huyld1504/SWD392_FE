import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks, useRemoveBookmark, useRemoveBookmarks, useRemoveAllBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button, Input, Pagination, Popconfirm, Skeleton, Empty, Checkbox, Tag } from 'antd';
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  const { data, isLoading } = useBookmarks({ page, pageSize: PAGE_SIZE, keyword });
  const bookmarks = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  const { mutateAsync: removeBookmark, isPending: isRemoving } = useRemoveBookmark();
  const { mutateAsync: removeBookmarks, isPending: isRemovingMany } = useRemoveBookmarks();
  const { mutate: removeAll, isPending: isRemovingAll } = useRemoveAllBookmarks();

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const toggleSelect = (articleId: number, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, articleId] : prev.filter((id) => id !== articleId)));
  };

  const selectAll = (checked: boolean) => {
    if (checked) setSelectedIds(bookmarks.map((b) => b.articleId));
    else setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length === 1) {
      await removeBookmark(selectedIds[0]);
    } else {
      await removeBookmarks(selectedIds);
    }
    setSelectedIds([]);
    setBulkMode(false);
  };

  if (isLoading && page === 1 && !keyword) return <LoadingSpinner text="Đang tải bookmarks..." />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="text-yellow-500" size={24} />
            Bài viết đã lưu
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} bài viết đã bookmark</p>
        </div>
        <div className="flex items-center gap-10 flex-wrap">
          {total > 1 && (
            <Button
              danger
              ghost={!bulkMode}
              onClick={() => {
                setBulkMode((prev) => {
                  const next = !prev;
                  if (!next) setSelectedIds([]);
                  return next;
                });
              }}
            >
              Xóa nhiều
            </Button>
          )}

          {bulkMode && total > 1 && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < bookmarks.length}
                  checked={selectedIds.length === bookmarks.length && bookmarks.length > 0}
                  onChange={(e) => selectAll(e.target.checked)}
                >
                  Chọn tất cả ({selectedIds.length}/{bookmarks.length})
                </Checkbox>
                {selectedIds.length > 0 && (
                  <Tag color="teal">Đã chọn {selectedIds.length}</Tag>
                )}
              </div>

              {selectedIds.length > 0 && (
                <Popconfirm
                  title={selectedIds.length === 1 ? 'Xóa bookmark này?' : `Xóa ${selectedIds.length} bookmark?`}
                  okText={selectedIds.length === 1 ? 'Xóa' : 'Xóa đã chọn'}
                  okButtonProps={{ danger: true }}
                  cancelText="Hủy"
                  onConfirm={handleDeleteSelected}
                >
                  <Button danger icon={<DeleteOutlined />} loading={selectedIds.length === 1 ? isRemoving : isRemovingMany}>
                    {selectedIds.length === 1 ? 'Xóa' : 'Xóa đã chọn'}
                  </Button>
                </Popconfirm>
              )}

              <Popconfirm
                title="Xóa tất cả bookmark?"
                description="Hành động này không thể hoàn tác."
                okText="Xóa tất cả"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
                onConfirm={() => { removeAll(); setSelectedIds([]); setBulkMode(false); }}
              >
                <Button danger icon={<DeleteOutlined />} loading={isRemovingAll}>
                  Xóa tất cả
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
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
          <div className="grid grid-cols-1 gap-4 mb-12">
            {bookmarks.map((article) => (
              <article
                key={article.articleId}
                className="group cursor-pointer flex gap-3 hover:bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-teal-200 transition-all"
                onClick={() => {
                  if (bulkMode) {
                    const isChecked = selectedIds.includes(article.articleId);
                    toggleSelect(article.articleId, !isChecked);
                  } else {
                    navigate(`/student/articles/${article.articleId}`);
                  }
                }}
              >
                {bulkMode && (
                  <Checkbox
                    checked={selectedIds.includes(article.articleId)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(article.articleId, e.target.checked); }}
                    className="mt-2"
                  />
                )}

                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-teal-50 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 opacity-70 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-black">
                    {article.title?.charAt(0)?.toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-px bg-teal-100 text-teal-700 text-xs font-bold uppercase rounded tracking-wide">
                      {article.topicName}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-3">
                    {stripHtml(article.contentBody ?? '').slice(0, 160)}...
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-teal-700">
                          {article.author?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {article.author?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: vi })}
                        </div>
                      </div>
                    </div>

                    <Popconfirm
                      title="Bỏ lưu bài viết này?"
                      okText="Xóa"
                      okButtonProps={{ danger: true }}
                      cancelText="Hủy"
                      onConfirm={async (e) => {
                        e?.stopPropagation();
                        await removeBookmark(article.articleId);
                        setSelectedIds((prev) => prev.filter((id) => id !== article.articleId));
                      }}
                    >
                      <Button
                        danger
                        size="small"
                        icon={<Trash2 size={14} />}
                        onClick={(e) => e.stopPropagation()}
                        loading={isRemoving}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </article>
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
