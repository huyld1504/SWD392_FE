import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useTopics } from '@/hooks/useTopics';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const articleSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề tối thiểu 5 ký tự')
    .max(255, 'Tiêu đề tối đa 255 ký tự'),
  contentBody: z.string().min(20, 'Nội dung tối thiểu 20 ký tự'),
  topicId: z.number().min(1, 'Vui lòng chọn chủ đề'),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading } = useArticle(articleId);
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const { mutate: updateArticle, isPending } = useUpdateArticle();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
  });

  // Populate form when article loads
  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        contentBody: article.contentBody,
        topicId: article.topicId,
      });
    }
  }, [article, reset]);

  const onSubmit = (data: ArticleForm) => {
    updateArticle(
      { id: articleId, data },
      { onSuccess: () => navigate('/lecture/articles') },
    );
  };

  if (isLoading) return <LoadingSpinner fullScreen text="Đang tải bài viết..." />;

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy bài viết</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  if (article.status !== 'PENDING') {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          Chỉ có thể chỉnh sửa bài viết đang chờ duyệt
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa bài viết</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            {topicsLoading ? (
              <LoadingSpinner text="" />
            ) : (
              <select
                {...register('topicId', { valueAsNumber: true })}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${errors.topicId ? 'border-red-300' : 'border-gray-300'
                  }`}
              >
                <option value={0}>-- Chọn chủ đề --</option>
                {topics?.data.map((topic) => (
                  <option key={topic.topicId} value={topic.topicId}>
                    {topic.name}
                    {topic.subjectName ? ` (${topic.subjectName})` : ''}
                  </option>
                ))}
              </select>
            )}
            {errors.topicId && (
              <p className="mt-1 text-sm text-red-600">{errors.topicId.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="Nhập tiêu đề bài viết..."
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('contentBody')}
              rows={15}
              placeholder="Viết nội dung bài viết tại đây... (Hỗ trợ HTML)"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-y min-h-[200px] ${errors.contentBody ? 'border-red-300' : 'border-gray-300'
                }`}
            />
            {errors.contentBody && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contentBody.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Bạn có thể sử dụng HTML để định dạng nội dung
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Save size={16} />
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
