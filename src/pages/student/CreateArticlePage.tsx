import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArticle, useSaveDraft } from '@/hooks/useArticles';
import { useSubjects, useTopicsBySubject } from '@/hooks/useTopics';
import {
  Form, Input, Select, Button, Card, Typography, Upload, Space, Tabs, Badge,
} from 'antd';
import {
  ArrowLeftOutlined, SendOutlined, InboxOutlined, SaveOutlined,
  FileTextOutlined, PictureOutlined, CodeOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import TabbedCodeBlockEditor, { type CodeBlock, serializeCodeBlock } from '@/components/common/TabbedCodeBlockEditor';

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

export default function StudentCreateArticlePage() {
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const { data: subjectsPage, isLoading: subjectsLoading } = useSubjects();
  const subjects = subjectsPage?.data ?? [];
  const { data: topicsPage, isLoading: topicsLoading } = useTopicsBySubject(subjectId!);
  const topics = topicsPage?.data ?? [];
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [activeTab, setActiveTab] = useState('content');

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote'],
        ['clean'],
      ],
    }),
    [],
  );

  const { mutate: createArticle, isPending } = useCreateArticle();
  const { mutate: saveDraft, isPending: isDrafting } = useSaveDraft();

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { topicId: 0, contentBody: '' },
  });

  const getFiles = (): RcFile[] =>
    fileList.map((f) => f.originFileObj).filter((f): f is RcFile => !!f);

  const buildContentBody = (data: ArticleForm): string => {
    const serialized = codeBlocks.map(serializeCodeBlock).join('');
    return data.contentBody + (serialized ? serialized : '');
  };

  const buildPayload = (data: ArticleForm) => ({
    ...data,
    contentBody: buildContentBody(data),
    diagrams: getFiles().length > 0 ? getFiles() : undefined,
    diagramDetails: getFiles().length > 0
      ? getFiles().map((_, i) => ({ sortOrder: i + 1 }))
      : undefined,
  });

  const onSubmit = (data: ArticleForm) => {
    createArticle(buildPayload(data), {
      onSuccess: () => navigate('/student/my-articles'),
    });
  };

  const onSaveDraft = () => {
    const data = getValues();
    saveDraft(buildPayload(data), {
      onSuccess: () => navigate('/student/my-articles'),
    });
  };

  const contentHasError = !!(errors.title || errors.contentBody || errors.topicId);

  const tabItems = [
    {
      key: 'content',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 6 }} />
          Nội dung
          {contentHasError && (
            <Badge dot status="error" style={{ marginLeft: 6, verticalAlign: 'middle' }} />
          )}
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
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
                <div
                  style={{
                    border: errors.contentBody ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <style>{`.ql-editor { min-height: 300px; font-size: 15px; }`}</style>
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
        </div>
      ),
    },
    {
      key: 'diagrams',
      label: (
        <span>
          <PictureOutlined style={{ marginRight: 6 }} />
          Sơ đồ / Hình ảnh
          {fileList.length > 0 && (
            <Badge count={fileList.length} size="small" style={{ marginLeft: 6, backgroundColor: '#0d9488' }} />
          )}
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <Text style={{ color: '#64748b', display: 'block', marginBottom: 16, fontSize: 13 }}>
            Tải lên sơ đồ, hình ảnh minh họa cho bài viết. Hỗ trợ nhiều file.
          </Text>
          <Dragger
            listType="picture"
            fileList={fileList}
            onChange={({ fileList: fl }) => setFileList(fl)}
            beforeUpload={() => false}
            accept=".png,.jpg,.jpeg,.svg,.gif,.webp"
            multiple
            style={{ borderRadius: 8, background: '#fafafa' }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#0d9488', fontSize: 36 }} />
            </p>
            <p style={{ color: '#334155', margin: '8px 0 4px', fontWeight: 500 }}>
              Kéo thả file vào đây hoặc <span style={{ color: '#0d9488', fontWeight: 700 }}>Click để chọn</span>
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>PNG, JPG, SVG, GIF, WebP (tối đa 10MB mỗi file)</p>
          </Dragger>
        </div>
      ),
    },
    {
      key: 'code',
      label: (
        <span>
          <CodeOutlined style={{ marginRight: 6 }} />
          Code Blocks
          {codeBlocks.length > 0 && (
            <Badge count={codeBlocks.length} size="small" style={{ marginLeft: 6, backgroundColor: '#0d9488' }} />
          )}
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <TabbedCodeBlockEditor blocks={codeBlocks} onChange={setCodeBlocks} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/student/my-articles')}>
          Bài viết của tôi
        </span>
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

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }} styles={{ body: { padding: '36px 40px' } }}>
        <Title level={3} style={{ margin: '0 0 4px', fontWeight: 800 }}>Tạo bài viết mới</Title>
        <Text style={{ color: '#64748b', display: 'block', marginBottom: 24 }}>
          Chia sẻ kiến thức và tài liệu của bạn với cộng đồng sinh viên.
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: 8 }}
          />

          {/* Actions */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 16, borderTop: '1px solid #f1f5f9', marginTop: 8,
          }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              * Các trường có dấu sao là bắt buộc. Bài viết sẽ được kiểm duyệt trước khi hiển thị.
            </Text>
            <Space>
              <Button size="large" onClick={() => navigate(-1)}>Hủy</Button>
              <Button
                size="large"
                icon={<SaveOutlined />}
                loading={isDrafting}
                onClick={onSaveDraft}
                style={{ borderColor: '#0d9488', color: '#0d9488' }}
              >
                Lưu nháp
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isPending}
                icon={<SendOutlined />}
                style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700 }}
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
