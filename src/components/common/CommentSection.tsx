import { useState, useCallback } from 'react';
import { Button, Avatar, Typography, Input, Rate, Modal, Pagination, Tooltip } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useComments, useCreateComment, useDeleteComment, usePinComment } from '@/hooks/useComments';
import { useAuthStore } from '@/stores/authStore';
import type { Comment } from '@/types';

const { Title, Text, Paragraph } = Typography;

const MAX_REPLIES = 10;

// ──────────────────────────────────────────────
// Star display helper
// ──────────────────────────────────────────────
function StarDisplay({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-xs select-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i < value ? '' : 'opacity-25'}`}
          style={{ fontVariationSettings: i < value ? "'FILL' 1" : "'FILL' 0", fontSize: 14 }}
        >
          star
        </span>
      ))}
    </span>
  );
}

// ──────────────────────────────────────────────
// Single reply item
// ──────────────────────────────────────────────
interface ReplyItemProps {
  reply: Comment;
  currentUserId?: number;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

function ReplyItem({ reply, currentUserId, isAdmin, onDelete }: ReplyItemProps) {
  const canDelete = reply.user?.userId === currentUserId || isAdmin;

  return (
    <div className="flex gap-3 py-3 first:pt-0">
      <Avatar
        src={reply.user?.avatarUrl || `https://ui-avatars.com/api/?name=${reply.user?.name || 'U'}&background=e0f2fe&color=0ea5e9&bold=true`}
        size={32}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Text strong className="text-xs dark:text-white">{reply.user?.name || 'Người dùng ẩn danh'}</Text>
          <Text className="text-[11px] text-slate-400">
            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}
          </Text>
        </div>
        <Paragraph className="!text-sm text-slate-600 dark:text-slate-300 !mb-0 leading-relaxed whitespace-pre-wrap">
          {reply.content}
        </Paragraph>
        {canDelete && (
          <Button
            type="text"
            size="small"
            danger
            className="px-0 text-xs mt-1 h-auto"
            onClick={() => onDelete(reply.commentId)}
          >
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Single root comment item
// ──────────────────────────────────────────────
interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  isAdmin: boolean;
  articleId: number;
  onDelete: (id: number, isRoot: boolean) => void;
  onReply: (rootId: number) => void;
  replyToId: number | null;
  onCancelReply: () => void;
  onSubmitReply: (content: string) => void;
  isSubmitting: boolean;
  onPin: (id: number) => void;
}

function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  onDelete,
  onReply,
  replyToId,
  onCancelReply,
  onSubmitReply,
  isSubmitting,
  onPin,
}: CommentItemProps) {
  const [replyContent, setReplyContent] = useState('');
  const canDelete = comment.user?.userId === currentUserId || isAdmin;
  const replies = comment.replies || [];
  const canReply = replies.length < MAX_REPLIES;
  const isReplying = replyToId === comment.commentId;

  const handleSubmit = () => {
    if (!replyContent.trim()) return;
    onSubmitReply(replyContent.trim());
    setReplyContent('');
  };

  return (
    <div className={`py-5 first:pt-0 border-b border-slate-100 dark:border-slate-800 last:border-0 ${comment.isPinned ? 'bg-amber-50/60 dark:bg-amber-900/10 -mx-4 px-4 rounded-xl' : ''}`}>
      {/* Pinned badge */}
      {comment.isPinned && (
        <div className="flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1", fontSize: 14 }}>push_pin</span>
          <Text className="text-xs font-bold text-amber-600 uppercase tracking-wider">Đã ghim</Text>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar
          src={comment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user?.name || 'U'}&background=ccfbf1&color=0d9488&bold=true`}
          size={40}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Text strong className="text-sm dark:text-white">{comment.user?.name || 'Người dùng ẩn danh'}</Text>
            {comment.ratingStar && <StarDisplay value={comment.ratingStar} />}
            <Text className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
            </Text>
          </div>

          {/* Content */}
          <Paragraph className="!text-sm text-slate-700 dark:text-slate-300 !mb-2 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </Paragraph>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {currentUserId && canReply && (
              <Button
                type="text"
                size="small"
                className="px-0 text-xs h-auto text-slate-500 hover:!text-teal-600 font-medium"
                onClick={() => onReply(comment.commentId)}
              >
                <span className="material-symbols-outlined mr-1" style={{ fontSize: 14 }}>reply</span>
                Trả lời
              </Button>
            )}
            {!canReply && (
              <Tooltip title="Đã đạt giới hạn 10 câu trả lời">
                <Text className="text-xs text-slate-400 italic">Đã đầy</Text>
              </Tooltip>
            )}
            {canDelete && (
              <Button
                type="text"
                size="small"
                danger
                className="px-0 text-xs h-auto"
                onClick={() => onDelete(comment.commentId, true)}
              >
                Xóa
              </Button>
            )}
            {isAdmin && !comment.isPinned && (
              <Button
                type="text"
                size="small"
                className="px-0 text-xs h-auto text-amber-600 hover:!text-amber-500 font-medium"
                onClick={() => onPin(comment.commentId)}
              >
                <span className="material-symbols-outlined mr-1" style={{ fontSize: 14, fontVariationSettings: "'FILL' 0" }}>push_pin</span>
                Ghim
              </Button>
            )}
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-0">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.commentId}
                  reply={reply}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onDelete={(id) => onDelete(id, false)}
                />
              ))}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3 pl-4 border-l-2 border-teal-200 dark:border-teal-700">
              <div className="flex gap-2 items-start">
                <Input.TextArea
                  autoFocus
                  rows={2}
                  placeholder="Viết câu trả lời..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="rounded-lg resize-none flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') onCancelReply();
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-2 justify-end">
                <Button size="small" onClick={onCancelReply}>Hủy</Button>
                <Button
                  type="primary"
                  size="small"
                  className="bg-teal-600 hover:!bg-teal-500 font-semibold"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={!replyContent.trim()}
                >
                  Gửi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main CommentSection
// ──────────────────────────────────────────────
interface CommentSectionProps {
  articleId: number;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const currentUserId = user?.userId;

  // Pagination state
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  // Hooks
  const { data: commentsData, isLoading } = useComments(articleId, { page, size: PAGE_SIZE });
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment(articleId);
  const { mutate: pinComment } = usePinComment(articleId);

  // Root comment form state
  const [commentContent, setCommentContent] = useState('');
  const [ratingStar, setRatingStar] = useState<number>(5);

  // Reply state
  const [replyToId, setReplyToId] = useState<number | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; isRoot: boolean } | null>(null);

  const rootComments = commentsData?.data || [];
  const totalItems = commentsData?.totalItems || 0;

  // ── Handlers ──
  const handleCreateRootComment = useCallback(() => {
    if (!commentContent.trim() || !articleId) return;
    createComment(
      {
        articleId,
        parentId: null,
        content: commentContent.trim(),
        ratingStar,
      },
      {
        onSuccess: () => {
          setCommentContent('');
          setRatingStar(5);
          setPage(0); // Go to first page to see new comment
        },
      },
    );
  }, [articleId, commentContent, ratingStar, createComment]);

  const handleReply = useCallback(
    (content: string) => {
      if (!replyToId) return;
      createComment(
        {
          articleId,
          parentId: replyToId,
          content,
          ratingStar: null,
        },
        {
          onSuccess: () => setReplyToId(null),
        },
      );
    },
    [articleId, replyToId, createComment],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteComment(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteComment]);

  const handlePin = useCallback(
    (commentId: number) => pinComment(commentId),
    [pinComment],
  );

  return (
    <div className="mt-12 pt-8">
      <Title level={3} className="!text-xl !font-bold mb-6">
        Bình luận {totalItems > 0 && <span className="text-slate-400 font-normal text-base">({totalItems})</span>}
      </Title>

      {/* ── Create Root Comment Form ── */}
      {user && (
        <div className="flex gap-4 mb-8">
          <Avatar
            size={40}
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || 'ME'}&background=ccfbf1&color=0d9488&bold=true`}
            className="shrink-0"
          />
          <div className="flex-1 space-y-3">
            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <Text className="text-sm text-slate-500">Đánh giá:</Text>
              <Rate
                value={ratingStar}
                onChange={(v) => setRatingStar(v || 1)}
                className="text-amber-400"
                style={{ fontSize: 18 }}
              />
            </div>

            <Input.TextArea
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="rounded-xl resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="primary"
                className="bg-teal-600 hover:!bg-teal-500 font-semibold rounded-lg px-6"
                onClick={handleCreateRootComment}
                loading={isCreating && !replyToId}
                disabled={!commentContent.trim()}
              >
                Gửi bình luận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Comment List ── */}
      {isLoading ? (
        <div className="text-center py-10">
          <Text className="text-slate-400">Đang tải bình luận...</Text>
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-10">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">forum</span>
          <Text className="text-slate-400">Chưa có bình luận nào. Hãy là người đầu tiên!</Text>
        </div>
      ) : (
        <div>
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              articleId={articleId}
              onDelete={(id, isRoot) => setDeleteTarget({ id, isRoot })}
              onReply={(rootId) => setReplyToId(rootId)}
              replyToId={replyToId}
              onCancelReply={() => setReplyToId(null)}
              onSubmitReply={handleReply}
              isSubmitting={isCreating && !!replyToId}
              onPin={handlePin}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {(commentsData?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page + 1}
            total={totalItems}
            pageSize={PAGE_SIZE}
            onChange={(p) => setPage(p - 1)}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleDeleteConfirm}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
        centered
      >
        {deleteTarget?.isRoot ? (
          <Text>
            Xóa bình luận này sẽ <strong>xóa tất cả câu trả lời</strong> bên dưới. Bạn có chắc chắn?
          </Text>
        ) : (
          <Text>Bạn có chắc chắn muốn xóa bình luận này?</Text>
        )}
      </Modal>
    </div>
  );
}
