import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle, useApproveArticle, useRejectArticle } from '@/hooks/useArticles';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button, Avatar, Typography, Space, Input, List, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ArticleContentRenderer from '@/components/common/ArticleContentRenderer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const APPROVE_LABEL = 'Duyệt bài viết';
const REJECT_LABEL = 'Từ chối';

export default function LectureArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading } = useArticle(articleId);
  const { data: comments } = useComments(articleId);
  const { mutate: createComment, isPending: isCommenting } = useCreateComment();
  const { mutate: approveArticle, isPending: isApproving } = useApproveArticle();
  const { mutate: rejectArticle, isPending: isRejecting } = useRejectArticle();

  const [commentContent, setCommentContent] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleCommentSubmit = () => {
    if (!commentContent.trim() || !articleId) return;
    createComment({ articleId, content: commentContent.trim() }, {
      onSuccess: () => setCommentContent(''),
    });
  };

  const handleApprove = () => {
    approveArticle(articleId, {
      onSuccess: () => navigate('/lecture/review'),
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectArticle(
      { id: articleId, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectReason('');
          navigate('/lecture/review');
        },
      },
    );
  };

  if (isLoading) return <LoadingSpinner fullScreen text="Đang tải bài viết..." />;

  if (!article) {
    return (
      <div className="text-center py-16">
        <Typography.Text className="text-gray-500 text-lg">Không tìm thấy bài viết</Typography.Text>
        <br />
        <Button type="link" onClick={() => navigate(-1)} className="mt-4 text-teal-600">
          ← Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full font-sans">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Back */}
        <Button
          type="text"
          onClick={() => navigate(-1)}
          icon={<span className="material-symbols-outlined text-xl">arrow_back</span>}
          className="flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-8 pl-0 hover:bg-transparent"
        >
          <span className="text-sm font-medium">Quay lại</span>
        </Button>

        {/* Approve / Reject banner — only if PENDING */}
        {article.status === 'PENDING' && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-amber-800 text-base mb-0.5">Bài viết đang chờ duyệt</p>
              <p className="text-amber-700 text-sm">Xem xét nội dung và đưa ra quyết định phê duyệt.</p>
            </div>
            <Space size={12} className="shrink-0">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={isApproving}
                onClick={handleApprove}
                style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700, borderRadius: 10, height: 40 }}
              >
                {APPROVE_LABEL}
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => setShowRejectModal(true)}
                style={{ fontWeight: 700, borderRadius: 10, height: 40 }}
              >
                {REJECT_LABEL}
              </Button>
            </Space>
          </div>
        )}

        {/* Article Layout */}
        <div className="flex items-start gap-10 flex-col lg:flex-row">
          {/* Main content */}
          <article className="flex-1 w-full min-w-0">
            {/* Topic badge */}
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-4 tracking-wider uppercase">
              {article.topicName || 'CHỦ ĐỀ'}
            </span>

            <Title level={1} className="!text-3xl md:!text-4xl !font-extrabold !leading-tight !text-slate-900 !mt-4 !mb-6">
              {article.title}
            </Title>

            {/* Author */}
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
              <Avatar
                size={48}
                src={article.author?.avatarUrl || `https://ui-avatars.com/api/?name=${article.author?.name || 'A'}`}
                className="border-2 border-slate-100"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Text strong className="text-slate-900 text-base">{article.author?.name || 'Tác giả ẩn danh'}</Text>
                  {article.author?.role === 'LECTURE' && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wide">
                      Giảng viên
                    </span>
                  )}
                </div>
                <Text className="text-sm text-slate-500 block mt-1">
                  Đăng {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: vi })}
                </Text>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none">
              {article.diagrams && article.diagrams.length > 0 && (
                <img alt="Thumbnail" className="w-full rounded-2xl shadow-sm mb-10 object-cover" src={article.diagrams[0].imageUrl} />
              )}
              
              <ArticleContentRenderer html={article.contentBody} className="break-words" />

              {article.diagrams && article.diagrams.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                  {article.diagrams.slice(1).map((diagram) => (
                    <img key={diagram.diagramId} src={diagram.imageUrl} alt={diagram.caption} className="w-full rounded-2xl shadow-sm object-cover" />
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <Title level={3} className="!text-xl !font-bold mb-6">Bình luận ({comments?.length || 0})</Title>
              <div className="flex gap-4 mb-8">
                <Avatar size={40} className="bg-teal-500 shrink-0">ME</Avatar>
                <div className="flex-1 flex flex-col items-end gap-2">
                  <Input.TextArea
                    rows={3}
                    placeholder="Viết bình luận..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="rounded-xl resize-none"
                  />
                  <Button
                    type="primary"
                    className="bg-teal-600 hover:bg-teal-500 font-semibold rounded-lg px-6"
                    onClick={handleCommentSubmit}
                    loading={isCommenting}
                    disabled={!commentContent.trim()}
                  >
                    Gửi bình luận
                  </Button>
                </div>
              </div>
              <List
                dataSource={comments || []}
                renderItem={(comment: any) => (
                  <List.Item className="border-b border-slate-100 py-6 last:border-0">
                    <div className="flex gap-4 w-full">
                      <Avatar
                        src={comment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user?.fullName || 'User'}`}
                        size={40}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Text strong className="text-sm">{comment.user?.fullName || 'Người dùng ẩn danh'}</Text>
                          <Text className="text-xs text-slate-400">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                          </Text>
                        </div>
                        <Paragraph className="text-sm text-slate-700 mb-0 leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </Paragraph>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </article>

          {/* Sidebar — Article info */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24 shadow-sm space-y-4">
              <Title level={5} className="!text-base !font-bold !mb-0 !mt-0">Thông tin bài viết</Title>
              <div className="space-y-3">
                <div>
                  <Text className="text-xs text-slate-400 uppercase font-bold">Trạng thái</Text>
                  <div className="mt-1">
                    {article.status === 'PENDING' && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Chờ duyệt</span>}
                    {article.status === 'APPROVED' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã duyệt</span>}
                    {article.status === 'REJECTED' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Từ chối</span>}
                  </div>
                </div>
                <div>
                  <Text className="text-xs text-slate-400 uppercase font-bold">Chủ đề</Text>
                  <p className="mt-1 text-sm text-slate-700 font-medium">{article.topicName}</p>
                </div>
                {article.subjectName && (
                  <div>
                    <Text className="text-xs text-slate-400 uppercase font-bold">Môn học</Text>
                    <p className="mt-1 text-sm text-slate-700 font-medium">{article.subjectName}</p>
                  </div>
                )}
                <div>
                  <Text className="text-xs text-slate-400 uppercase font-bold">Ngày tạo</Text>
                  <p className="mt-1 text-sm text-slate-700">{new Date(article.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {article.approvedBy && (
                  <div>
                    <Text className="text-xs text-slate-400 uppercase font-bold">Duyệt bởi</Text>
                    <p className="mt-1 text-sm text-slate-700">{article.approvedBy.name}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={showRejectModal}
        onCancel={() => { setShowRejectModal(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="Từ chối bài viết"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isRejecting, disabled: !rejectReason.trim() }}
        title="Từ chối bài viết"
        centered
      >
        <Text style={{ display: 'block', marginBottom: 12 }}>
          Bài viết: <strong>"{article.title}"</strong>
        </Text>
        <TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
          rows={4}
        />
      </Modal>
    </div>
  );
}
