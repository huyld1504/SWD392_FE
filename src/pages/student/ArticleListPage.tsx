import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useTopics, useTopicsBySubject, useSubjects } from '@/hooks/useTopics';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Input, Select, Pagination, Skeleton, Empty, Avatar, Button } from 'antd'; // ← Bỏ Option
import { HeartFilled, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Article } from '@/types';

const GRADIENTS = [
  'from-teal-400 to-emerald-500',
  'from-blue-400 to-cyan-500',
  'from-purple-400 to-pink-500',
  'from-orange-400 to-amber-500',
  'from-rose-400 to-red-500',
];

const estimateReadTime = (content: string) =>
  Math.max(1, Math.round((content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length ?? 0) / 200));
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
};

function ArticleCard({ article }: { article: Article }) {
  const navigate = useNavigate();
  const thumbnail = article.diagrams?.[0]?.imageUrl;
  const gradient = GRADIENTS[article.articleId % GRADIENTS.length];
  const readTime = estimateReadTime(article.contentBody ?? '');

  return (
    <article
      className="group cursor-pointer flex gap-3 hover:bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-teal-200 transition-all"
      onClick={() => navigate(`/student/articles/${article.articleId}`)}
    >
      {/* Hình vuông nhỏ trái - 56x56px */}
      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 min-w-0">
        {/* Topic + Thời gian */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-px bg-teal-100 text-teal-700 text-xs font-bold uppercase rounded tracking-wide">
            {article.topicName}
          </span>

        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
          {article.title}
        </h3>

        {/* Description DÀI */}
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-3">

          {stripHtml(article.contentBody ?? '').slice(0, 160)}...
        </p>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <Avatar
              size={28}
              src={article.author?.avatarUrl}
              style={{ backgroundColor: '#059669' }}
              className="flex-shrink-0"
            >
              {article.author?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {article.author?.name}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(article.createdAt), "dd 'Th' MM", { locale: vi })}
              </div>
              {article.author?.role === 'LECTURE' && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-full mt-1 inline-block">
                  Giảng viên
                </span>
              )}
            </div>
          </div>


        </div>
      </div>
    </article>
  );
}


const PAGE_SIZE = 8;

export default function ArticleListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [topicId, setTopicId] = useState<number | undefined>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');

  const { data: subjectsPage } = useSubjects();
  const subjects = subjectsPage?.data ?? [];

  const { data: topicsPage } = useTopicsBySubject(subjectId!);
  const { data: allTopicsPage } = useTopics();
  const topics = subjectId ? (topicsPage?.data ?? []) : (allTopicsPage?.data ?? []);

  const { data, isLoading } = useArticles({
    keyword,
    page,
    pageSize: PAGE_SIZE,
    status: 'APPROVED',
    topicId,
    sort: 'createdAt',
    direction,
  });

  const articles = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Title + Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900">Danh sách bài viết</h2>
          <Link to="/student/my-articles/new">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #065f46 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                height: 44,
                paddingInline: 24,
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
              }}
            >
              Tạo bài viết
            </Button>
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
          {/* Search */}
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Tìm kiếm tiêu đề</p>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              placeholder="Tìm kiếm tiêu đề bài viết..."
              style={{ width: '100%' }}
              size="large"
              allowClear
              onClear={() => {
                setKeyword('');
                setPage(1);
              }}
            />
          </div>

          {/* <div style={{ flex: '0 1 280px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Môn học</p>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Chọn môn học"
              allowClear
              value={subjectId}
              onChange={(val) => {
                setSubjectId(val);
                setTopicId(undefined);
                setPage(1);
              }}
            >
              {subjects.map((s) => (
                <Select.Option key={s.subjectId} value={s.subjectId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </div> */}


          {/* Topic */}
          <div style={{ flex: '0 1 280px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Chủ đề</p>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Chọn chủ đề"
              allowClear
              value={topicId}
              onChange={(val) => {
                setTopicId(val);
                setPage(1);
              }}
            >
              {topics.map((t) => (
                <Select.Option key={t.topicId} value={t.topicId}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Sort */}
          <div style={{ flex: '0 1 200px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Thứ tự</p>
            <Select
              style={{ width: '100%' }}
              size="large"
              value={direction}
              onChange={(val) => {
                setDirection(val);
                setPage(1);
              }}
            >
              <Select.Option value="desc">Mới nhất</Select.Option>
              <Select.Option value="asc">Cũ nhất</Select.Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 flex gap-6">
              <Skeleton.Image active style={{ width: 224, height: 160, borderRadius: 12 }} />
              <div className="flex-1">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="text-slate-500">Không tìm thấy bài viết nào</span>}
          className="py-16"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-12">
            {articles.map((article) => (
              <ArticleCard key={article.articleId} article={article} />
            ))}
          </div>

          {total > PAGE_SIZE && (
            <div className="flex justify-center pb-12">
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
