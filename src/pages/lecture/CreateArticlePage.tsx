import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArticle } from '@/hooks/useArticles';
import { useTopics } from '@/hooks/useTopics';
import { ArrowLeft, Send } from 'lucide-react';
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

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const { data: topics, isLoading: topicsLoading } = useTopics();

  // Custom toolbar cho Quill (Bao gồm chức năng up ảnh)
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    []
  );
  const { mutate: createArticle, isPending } = useCreateArticle();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { topicId: 0, contentBody: '' },
  });

  const onSubmit = (data: ArticleForm) => {
    createArticle(data, {
      onSuccess: () => navigate('/lecture/articles'),
    });
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo bài viết mới</h1>

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
                {topics?.map((topic) => (
                  <option key={topic.topicId} value={topic.topicId}>
                    {topic.name}
                    {topic.subject ? ` (${topic.subject.name})` : ''}
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
            <Controller
              name="contentBody"
              control={control}
              render={({ field }) => (
                <div className={`rounded-lg overflow-hidden border transition-all ${errors.contentBody ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500'
                  }`}>
                  <style>{`
                    .quill-editor-container .ql-editor {
                      min-height: 300px;
                      font-size: 16px;
                    }
                  `}</style>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Viết nội dung bài viết tại đây (Hỗ trợ kéo thả ảnh)..."
                    className="bg-white quill-editor-container"
                  />
                </div>
              )}
            />
            {errors.contentBody && (
              <p className="mt-1 text-sm text-red-600">{errors.contentBody.message}</p>
            )}
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
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={16} />
              {isPending ? 'Đang tạo...' : 'Đăng bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
