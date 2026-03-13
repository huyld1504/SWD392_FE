import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useTopics } from '@/hooks/useTopics';
import { ArrowLeft, Save, X, ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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

  // Image state
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewImages(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImagePreviews(previews);
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (data: ArticleForm) => {
    updateArticle(
      {
        id: articleId,
        data: {
          ...data,
          ...(newImages.length > 0 ? { diagrams: newImages } : {}),
        },
      },
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
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
                  errors.topicId ? 'border-red-300' : 'border-gray-300'
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
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
                errors.title ? 'border-red-300' : 'border-gray-300'
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
            <div className={`${errors.contentBody ? 'border-red-300' : ''}`}>
              <Controller
                name="contentBody"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Viết nội dung bài viết tại đây..."
                    className="bg-white h-[300px] mb-12"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                        ['link'],
                        ['clean']
                      ],
                    }}
                  />
                )}
              />
            </div>
            {errors.contentBody && (
              <p className="mt-1 text-sm text-red-600">{errors.contentBody.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh minh họa
            </label>

            {/* Existing images from article */}
            {article.diagrams && article.diagrams.length > 0 && newImages.length === 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Ảnh hiện tại:</p>
                <div className="flex flex-wrap gap-3">
                  {article.diagrams.map((diagram) => (
                    <div key={diagram.diagramId} className="relative group">
                      <img
                        src={diagram.imageUrl}
                        alt={diagram.caption || 'Diagram'}
                        className="w-28 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      {diagram.caption && (
                        <p className="text-[10px] text-gray-400 mt-1 text-center truncate max-w-[112px]">
                          {diagram.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  Tải lên ảnh mới sẽ thay thế các ảnh hiện tại.
                </p>
              </div>
            )}

            {/* New image previews */}
            {newImagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {newImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-28 h-20 object-cover rounded-lg border border-teal-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors cursor-pointer"
            >
              <ImagePlus size={16} />
              {newImages.length > 0 ? `Đã chọn ${newImages.length} ảnh — Đổi ảnh` : 'Thêm / đổi ảnh'}
            </button>
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
              disabled={isPending || (!isDirty && newImages.length === 0)}
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
