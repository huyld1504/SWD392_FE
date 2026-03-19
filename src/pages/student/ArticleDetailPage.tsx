import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '@/hooks/useArticles';
import { useAddBookmark, useRemoveBookmark } from '@/hooks/useBookmarks';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useMyWallets } from '@/hooks/useWallets';
import { useArticleDonations, useDonate } from '@/hooks/useDonations';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button, Avatar, Tag, Divider, Typography, Space, Input, List } from 'antd';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ArticleStatusBadge from '@/components/common/ArticleStatusBadge';
import ArticleContentRenderer from '@/components/common/ArticleContentRenderer';

const { Title, Text, Paragraph } = Typography;


export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading } = useArticle(articleId);
  const { data: comments } = useComments(articleId);
  const { mutate: createComment, isPending: isCommenting } = useCreateComment();
  const { mutate: addBookmark, isPending: isAddingBookmark } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemovingBookmark } = useRemoveBookmark();
  const isBookmarkPending = isAddingBookmark || isRemovingBookmark;

  const handleToggleBookmark = () => {
    if (article?.bookmarked) {
      removeBookmark(articleId);
    } else {
      addBookmark(articleId);
    }
  };

  const [commentContent, setCommentContent] = useState('');

  // API Hooks cho Donate
  const [donateAmount, setDonateAmount] = useState<number>(1);
  const { data: wallets } = useMyWallets();
  const { data: donationsData } = useArticleDonations(articleId);
  const { mutate: donate, isPending: isDonating } = useDonate();

  const handleDonate = () => {
    if (!articleId) return;
    donate({ articleId, amount: donateAmount });
  };

  const handleCommentSubmit = () => {
    if (!commentContent.trim() || !articleId) return;
    createComment({ articleId, content: commentContent.trim() }, {
      onSuccess: () => setCommentContent('')
    });
  };

  const blueBalance = useMemo(() => {
    return wallets?.find((w) => w.walletType === 'MAIN')?.balance || wallets?.[0]?.balance || 0;
  }, [wallets]);

  const donations = donationsData?.data || [];
  const totalDonationsCount = donationsData?.totalItems || 0;
  const totalBlueDonated = useMemo(() => donations.reduce((sum, d) => sum + d.amount, 0), [donations]);

  if (isLoading) return <LoadingSpinner fullScreen text="Đang tải bài viết..." />;
  if (!article) {
    return (
      <div className="text-center py-16">
        <Typography.Text className="text-gray-500 text-lg">Không tìm thấy bài viết</Typography.Text>
        <br />
        <Button
          type="link"
          onClick={() => navigate(-1)}
          className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full font-sans">
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-start gap-10 flex-col lg:flex-row">
        {/* Article Content Column */}

        <article className="flex-1 w-full min-w-0 lg:w-[calc(100%-360px)]">
          <Button
            type="text"
            onClick={() => navigate(-1)}
            icon={<span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>}
            className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-8 group pl-0 hover:bg-transparent"
          >
            <span className="text-sm font-medium">Quay lại</span>
          </Button>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-full mb-4 tracking-wider uppercase">
              {article.topicName || 'CHỦ ĐỀ'}
            </span>


            <Title level={1} className="!text-3xl md:!text-4xl !font-extrabold !leading-tight !text-slate-900 dark:!text-white !mt-4 !mb-0">
              {article.title}
            </Title>
          </div>

          <div className="flex items-center justify-between gap-4 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800 flex-wrap">
            <div className="flex items-center gap-4">
              <Avatar
                size={48}
                src={article.author?.avatarUrl || "https://ui-avatars.com/api/?name=" + (article.author?.name || "A")}
                className="border-2 border-slate-100"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Text strong className="text-slate-900 dark:text-white text-base">{article.author?.name || 'Tác giả ẩn danh'}</Text>
                  {article.author?.role === 'LECTURE' && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-wide">
                      Giảng viên
                    </span>
                  )}
                </div>
                <Text className="text-sm text-slate-500 block mt-1">
                  Đăng ngày {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale: vi })} • 12 phút đọc
                </Text>
              </div>
            </div>
            
            {/* Large Bookmark Button */}
            <Button
              type={article.bookmarked ? "primary" : "default"}
              size="large"
              loading={isBookmarkPending}
              onClick={handleToggleBookmark}
              icon={
                <span
                  className={`material-symbols-outlined flex items-center justify-center ${
                    article.bookmarked ? '' : 'text-slate-500 group-hover:text-teal-600'
                  }`}
                  style={{ fontVariationSettings: article.bookmarked ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}
                >
                  bookmark
                </span>
              }
              className={`flex items-center gap-2 rounded-full px-6 font-semibold shadow-sm group ${
                article.bookmarked 
                  ? 'bg-teal-600 hover:bg-teal-500 border-none' 
                  : 'bg-white border-slate-200 hover:border-teal-600 hover:text-teal-600 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-teal-500 dark:text-slate-300'
              }`}
            >
              {article.bookmarked ? 'Đã lưu' : 'Lưu bài viết'}
            </Button>
          </div>


          <div className="prose prose-slate max-w-none dark:prose-invert">
            {article.diagrams && article.diagrams.length > 0 && (
              <img alt="Thumbnail" className="w-full rounded-2xl shadow-sm mb-10 object-cover" src={article.diagrams[0].imageUrl} />
            )}
            
            <ArticleContentRenderer html={article.contentBody} className="break-words" />

            {article.diagrams && article.diagrams.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                {article.diagrams.slice(1).map(diagram => (
                  <img key={diagram.diagramId} src={diagram.imageUrl} alt={diagram.caption} className="w-full rounded-2xl shadow-sm object-cover" />
                ))}
              </div>
            )}
          </div>




          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">

              <Button type="text" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors h-auto">
                <span className="material-symbols-outlined text-slate-500">chat_bubble</span>
                <span className="text-sm font-bold">{comments?.length || 0}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button type="text" shape="circle" icon={<span className="material-symbols-outlined text-slate-500 flex items-center justify-center">share</span>} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-10 h-10" />
              <Button
                type="text"
                shape="circle"
                loading={isBookmarkPending}
                onClick={handleToggleBookmark}
                icon={
                  <span
                    className={`material-symbols-outlined flex items-center justify-center ${article.bookmarked ? 'text-yellow-500' : 'text-slate-500'
                      }`}
                    style={{ fontVariationSettings: article.bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                }
                className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-10 h-10"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8">
            <Title level={3} className="!text-xl !font-bold mb-6">Bình luận ({comments?.length || 0})</Title>

            <div className="flex gap-4 mb-8">
              <Avatar size={40} className="bg-teal-500 shrink-0">ME</Avatar>
              <div className="flex-1 flex flex-col items-end gap-2">
                <Input.TextArea
                  rows={3}
                  placeholder="Viết bình luận của bạn..."
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
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
                <List.Item className="border-b border-slate-100 dark:border-slate-800 py-6 last:border-0">
                  <div className="flex gap-4 w-full">
                    <Avatar src={comment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user?.fullName || 'User'}`} size={40} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Text strong className="text-sm dark:text-white">{comment.user?.fullName || 'Người dùng ẩn danh'}</Text>
                        <Text className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                        </Text>
                      </div>
                      <Paragraph className="text-sm text-slate-700 dark:text-slate-300 mb-0 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </Paragraph>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </article>
        {/* Sidebar: Donate & Stats */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          {/* Donate Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24 shadow-sm">
            <Title level={4} className="!text-lg !font-bold !mb-4 flex items-center gap-2 !mt-0">
              <span className="text-teal-600 material-symbols-outlined">favorite</span>
              💙 Ủng hộ tác giả
            </Title>
            <Paragraph className="text-sm text-slate-500 mb-6 leading-relaxed">
              Nếu bài viết này giúp ích cho bạn, hãy gửi một chút BLUE để khích lệ {article.author?.name || 'tác giả'} nhé!
            </Paragraph>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1, 2, 3, 5, 10].map(v => (
                <Button
                  key={v}
                  onClick={() => setDonateAmount(v)}
                  className={`py-2 text-sm font-bold rounded-lg h-auto transition-colors ${donateAmount === v
                    ? 'border-2 border-teal-600 bg-teal-50 text-teal-600 hover:border-teal-500 hover:text-teal-500'
                    : 'border border-slate-200 dark:border-slate-700 hover:border-teal-600 hover:text-teal-600'
                    }`}
                >
                  {v}
                </Button>
              ))}
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleDonate}
              loading={isDonating}
              disabled={blueBalance < donateAmount}
              className="w-full bg-teal-600 hover:bg-teal-500 font-bold rounded-xl mb-4 border-none shadow-none h-12"
            >
              {blueBalance < donateAmount ? 'Số dư không đủ' : 'Donate ngay'}
            </Button>

            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Số dư: {blueBalance} 💙 BLUE</span>
              <Button type="link" className="text-teal-600 hover:text-teal-500 p-0 h-auto text-xs font-medium" onClick={() => navigate('/student/wallet')}>Nạp thêm</Button>
            </div>

            {/* Donation Summary */}
            <Divider className="my-6 border-slate-100 dark:border-slate-800" />

            <div className="flex items-center justify-between mb-6">
              <div className="text-center w-full">
                <Text strong className="text-xl block">{totalDonationsCount}</Text>
                <Text className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Lượt ủng hộ</Text>
              </div>
              <Divider type="vertical" className="h-8 bg-slate-100 dark:bg-slate-800" />
              <div className="text-center w-full">
                <Text strong className="text-xl text-teal-600 block">{totalBlueDonated}</Text>
                <Text className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Tổng BLUE</Text>
              </div>
            </div>

            <div className="space-y-4">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Người ủng hộ gần đây</Text>

              {donations.length === 0 ? (
                <Text className="text-sm text-slate-500 italic">Chưa có lượt ủng hộ nào.</Text>
              ) : (
                donations.slice(0, 5).map((donation) => (
                  <div key={donation.donationId} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar src={donation.donor?.avatarUrl || `https://ui-avatars.com/api/?name=${donation.donor?.fullName || 'A'}`} size={32} />
                      <div className="max-w-[120px] truncate">
                        <Text strong className="text-sm block leading-none mb-1 truncate">{donation.donor?.fullName || 'Ẩn danh'}</Text>
                        <Text className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true, locale: vi })}
                        </Text>
                      </div>
                    </div>
                    <Text strong className="text-sm text-teal-600 shrink-0">+{donation.amount} BLUE</Text>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
