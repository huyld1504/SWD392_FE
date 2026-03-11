import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useSubjects, useTopicsBySubject } from '@/hooks/useTopics';
import {
  Form, Input, Select, Button, Card, Typography, Space, Spin, Result,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const articleSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề tối thiểu 5 ký tự')
    .max(255, 'Tiêu đề tối đa 255 ký tự'),
  contentBody: z.string().min(20, 'Nội dung tối thiểu 20 ký tự'),
  topicId: z.number().min(1, 'Vui lòng chọn chủ đề'),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function StudentEditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading: articleLoading } = useArticle(articleId);
  const { mutate: updateArticle, isPending } = useUpdateArticle();

  // Subject/topic selects
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const { data: subjectsPage, isLoading: subjectsLoading } = useSubjects();
  const subjects = subjectsPage?.data ?? [];
  const { data: topicsPage, isLoading: topicsLoading } = useTopicsBySubject(subjectId!);
  const topics = topicsPage?.data ?? [];

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    [],
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { topicId: 0, contentBody: '' },
  });

  // Populate form once article loads
  useEffect(() => {
    if (article) {
      setSubjectId(article.subjectId);
      reset({
        title: article.title,
        contentBody: article.contentBody,
        topicId: article.topicId ?? 0,
      });
    }
  }, [article, reset]);

  const onSubmit = (data: ArticleForm) => {
    updateArticle(
      { id: articleId, data },
      { onSuccess: () => navigate('/student/my-articles') },
    );
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (articleLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!article) {
    return (
      <Result
        status="404"
        title="Không tìm thấy bài viết"
        extra={
          <Button type="primary" onClick={() => navigate('/student/my-articles')}
            style={{ background: '#0d9488', borderColor: '#0d9488' }}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  // ── Only PENDING articles can be edited ────────────────────────────────────
  if (article.status !== 'PENDING') {
    return (
      <Result
        status="warning"
        title="Không thể chỉnh sửa"
        subTitle="Chỉ có thể chỉnh sửa bài viết đang chờ duyệt."
        extra={
          <Button type="primary" onClick={() => navigate('/student/my-articles')}
            style={{ background: '#0d9488', borderColor: '#0d9488' }}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/student/my-articles')}>
          Bài viết của tôi
        </span>
        <span style={{ margin: '0 6px' }}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Chỉnh sửa bài viết</span>
      </div>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 24, color: '#64748b', paddingLeft: 0 }}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>

      <Card
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
        bodyStyle={{ padding: '36px 40px' }}
      >
        <Title level={3} style={{ margin: '0 0 4px', fontWeight: 800 }}>Chỉnh sửa bài viết</Title>
        <Text style={{ color: '#64748b', display: 'block', marginBottom: 32 }}>
          Cập nhật nội dung bài viết. Bài viết sẽ được đưa vào hàng chờ kiểm duyệt lại sau khi lưu.
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Subject */}
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Môn học <span style={{ color: '#ef4444' }}>*</span></span>}
          >
            <Select
              size="large"
              placeholder="-- Chọn môn học --"
              loading={subjectsLoading}
              style={{ width: '100%' }}
              value={subjectId}
              onChange={(val) => {
                setSubjectId(val);
                setValue('topicId', 0);
              }}
              showSearch
              optionFilterProp="children"
              allowClear
              onClear={() => setSubjectId(undefined)}
            >
              {subjects.map((s) => (
                <Select.Option key={s.subjectId} value={s.subjectId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Topic */}
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Chủ đề <span style={{ color: '#ef4444' }}>*</span></span>}
            validateStatus={errors.topicId ? 'error' : ''}
            help={errors.topicId?.message}
          >
            <Controller
              name="topicId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  placeholder={subjectId ? '-- Chọn chủ đề --' : '-- Chọn môn học trước --'}
                  loading={topicsLoading}
                  disabled={!subjectId}
                  style={{ width: '100%' }}
                  onChange={(val) => field.onChange(Number(val))}
                  showSearch
                  optionFilterProp="children"
                >
                  {topics.map((t) => (
                    <Select.Option key={t.topicId} value={t.topicId}>
                      {t.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Title */}
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Tiêu đề <span style={{ color: '#ef4444' }}>*</span></span>}
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Nhập tiêu đề bài viết..."
                  maxLength={255}
                  showCount
                />
              )}
            />
          </Form.Item>

          {/* Content */}
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Nội dung <span style={{ color: '#ef4444' }}>*</span></span>}
            validateStatus={errors.contentBody ? 'error' : ''}
            help={errors.contentBody?.message}
          >
            <Controller
              name="contentBody"
              control={control}
              render={({ field }) => (
                <div style={{
                  border: errors.contentBody ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
                  borderRadius: 8, overflow: 'hidden',
                }}>
                  <style>{`.ql-editor { min-height: 280px; font-size: 15px; }`}</style>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nội dung bài viết..."
                  />
                </div>
              )}
            />
          </Form.Item>

          {/* Actions */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 8, borderTop: '1px solid #f1f5f9',
          }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              * Bài viết sẽ được đưa lại vào hàng chờ kiểm duyệt sau khi lưu.
            </Text>
            <Space>
              <Button size="large" style={{ borderRadius: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isPending}
                icon={<SaveOutlined />}
                style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 700 }}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
