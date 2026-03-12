import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArticle } from '@/hooks/useArticles';
import { useTopics } from '@/hooks/useTopics';
import {
  Form, Input, Select, Button, Card, Typography, Upload, Space,
} from 'antd';
import { ArrowLeftOutlined, SendOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
const { Title, Text } = Typography;
const { Dragger } = Upload;

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
  const { data: topicsPage, isLoading: topicsLoading } = useTopics();
  const topics = topicsPage?.data ?? [];
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    []
  );

  const { mutate: createArticle, isPending } = useCreateArticle();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { topicId: 0, contentBody: '' },
  });

 const onSubmit = (data: ArticleForm) => {
  const files = fileList
    .map((f) => f.originFileObj)
    .filter((f): f is RcFile => !!f);

  createArticle(
    {
      ...data,
      diagrams: files.length > 0 ? files : undefined,
      diagramDetails: files.length > 0
        ? files.map((_, i) => ({ sortOrder: i + 1 }))
        : undefined,
    },
    { onSuccess: () => navigate('/lecture/articles') },
  );
};

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Breadcrumb / back */}
      <div style={{ marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/lecture/articles')}>Trang chủ</span>
        <span style={{ margin: '0 6px' }}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Tạo bài viết</span>
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
        <Title level={3} style={{ margin: '0 0 4px', fontWeight: 800 }}>Tạo bài viết mới</Title>
        <Text style={{ color: '#64748b', display: 'block', marginBottom: 32 }}>
          Chia sẻ kiến thức và tài liệu của bạn với cộng đồng sinh viên.
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
                  placeholder="-- Chọn chủ đề --"
                  loading={topicsLoading}
                  style={{ width: '100%', borderRadius: 8 }}
                  onChange={(val) => field.onChange(Number(val))}
                  showSearch
                  optionFilterProp="children"
                >
                  {topics.map((t) => (
                    <Select.Option key={t.topicId} value={t.topicId}>
                      {t.name}{t.subjectName ? ` — ${t.subjectName}` : ''}
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
                  style={{ borderRadius: 8 }}
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
                    placeholder="Bắt đầu viết nội dung bài viết tại đây..."
                  />
                </div>
              )}
            />
          </Form.Item>

          {/* Image upload */}
          <Form.Item label={<span style={{ fontWeight: 600 }}>Sơ đồ / Hình ảnh đính kèm</span>}>
            <Dragger
              listType="picture"
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg,.svg,.gif"
              multiple
              style={{ borderRadius: 8, background: '#fafafa' }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#0d9488', fontSize: 32 }} />
              </p>
              <p style={{ color: '#64748b', margin: '8px 0 4px' }}>
                Kéo file và vào đây hoặc <span style={{ color: '#0d9488', fontWeight: 600 }}>Click để chọn</span>
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>PNG, JPG, SVG (tối đa 10MB)</p>
            </Dragger>
          </Form.Item>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              * Các trường có dấu sao là bắt buộc. Bài viết sẽ được kiểm duyệt trước khi hiển thị công khai.
            </Text>
            <Space>
              <Button size="large" style={{ borderRadius: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isPending}
                icon={<SendOutlined />}
                style={{ background: '#0d9488', borderColor: '#0d9488', borderRadius: 8, fontWeight: 700 }}
              >
                Đăng bài viết
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
