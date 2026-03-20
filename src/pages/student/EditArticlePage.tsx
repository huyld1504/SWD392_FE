import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArticle, useUpdateArticle, useSubmitArticle } from '@/hooks/useArticles';
import { useSubjects, useTopicsBySubject } from '@/hooks/useTopics';
import {
  Form, Input, Select, Button, Card, Typography, Upload, Space, Tabs, Badge,
  Image, Spin, Result, Tooltip, Tag, Modal,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, FileTextOutlined, PictureOutlined,
  InboxOutlined, DeleteOutlined, PlusOutlined, CodeOutlined, SendOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import type { Diagram } from '@/types';
import TabbedCodeBlockEditor, { type CodeBlock, serializeCodeBlock, parseCodeBlocksFromHtml } from '@/components/common/TabbedCodeBlockEditor';

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

export default function StudentEditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading: articleLoading } = useArticle(articleId);
  const { mutate: updateArticle, isPending } = useUpdateArticle();
  const { mutate: submitArticle, isPending: isSubmitting } = useSubmitArticle();

  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { data: subjectsPage, isLoading: subjectsLoading } = useSubjects();
  const subjects = subjectsPage?.data ?? [];
  const { data: topicsPage, isLoading: topicsLoading } = useTopicsBySubject(subjectId!);
  const topics = topicsPage?.data ?? [];

  const [activeTab, setActiveTab] = useState('content');

  // Diagram management
  const [existingDiagrams, setExistingDiagrams] = useState<Diagram[]>([]);
  const [deleteDiagramIds, setDeleteDiagramIds] = useState<number[]>([]);
  const [newFileList, setNewFileList] = useState<UploadFile[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

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
      
      // Separate code blocks from HTML body
      const blocks = parseCodeBlocksFromHtml(article.contentBody || '');
      setCodeBlocks(blocks);

      // Clean body for Quill
      const cleanBody = (article.contentBody || '').replace(
        /<div class="tabbed-code-block"[^>]*><\/div>/g,
        ''
      );

      reset({
        title: article.title,
        contentBody: cleanBody,
        topicId: article.topicId ?? 0,
      });
      setExistingDiagrams(article.diagrams ?? []);
      setDeleteDiagramIds([]);
      setNewFileList([]);
    }
  }, [article, reset]);

  const handleDeleteExisting = (diagramId: number) => {
    setExistingDiagrams((prev) => prev.filter((d) => d.diagramId !== diagramId));
    setDeleteDiagramIds((prev) => [...prev, diagramId]);
  };

  const onSubmit = (data: ArticleForm) => {
    const newFiles = newFileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);
    
    // Merge code blocks back into contentBody
    const serializedBlocks = codeBlocks.map(serializeCodeBlock).join('');
    const fullContentBody = data.contentBody + (serializedBlocks || '');

    updateArticle(
      {
        id: articleId,
        data: {
          title: data.title,
          contentBody: fullContentBody,
          existingDiagrams: existingDiagrams.map((d, i) => ({
            diagramId: d.diagramId,
            caption: d.caption,
            sortOrder: d.sortOrder ?? i + 1,
          })),
          deleteDiagramIds: deleteDiagramIds.length > 0 ? deleteDiagramIds : undefined,
          newDiagrams: newFiles.length > 0 ? newFiles : undefined,
        },
      },
      {
        onSuccess: () => {
          if (article && (article.status === 'DRAFT' || article.status === 'REJECTED')) {
            setShowSubmitModal(true);
          } else {
            navigate('/student/my-articles');
          }
        },
      },
    );
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (articleLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }

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

  const canEdit = article.status === 'PENDING' || article.status === 'REJECTED' || article.status === 'DRAFT';
  if (!canEdit) {
    return (
      <Result
        status="warning"
        title="Không thể chỉnh sửa"
        subTitle="Chỉ có thể chỉnh sửa bài viết ở trạng thái Nháp, Chờ duyệt hoặc Bị từ chối."
        extra={
          <Button type="primary" onClick={() => navigate('/student/my-articles')}
            style={{ background: '#0d9488', borderColor: '#0d9488' }}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  const contentHasError = !!(errors.title || errors.contentBody || errors.topicId);
  const diagramChanges = deleteDiagramIds.length + newFileList.length;

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
                    placeholder="Nội dung bài viết..."
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
          {diagramChanges > 0 && (
            <Badge count={diagramChanges} size="small" style={{ marginLeft: 6, backgroundColor: '#f59e0b' }} />
          )}
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          {/* Existing diagrams */}
          {existingDiagrams.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Text style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: 12 }}>
                Sơ đồ hiện tại
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {existingDiagrams.map((diagram) => (
                  <div
                    key={diagram.diagramId}
                    style={{
                      position: 'relative',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: 120,
                    }}
                  >
                    <Image
                      src={diagram.imageUrl}
                      alt={diagram.caption || `Diagram ${diagram.diagramId}`}
                      width={120}
                      height={90}
                      style={{ objectFit: 'cover', display: 'block' }}
                      preview={{ mask: 'Xem' }}
                    />
                    {diagram.caption && (
                      <div style={{
                        padding: '4px 6px', fontSize: 11, color: '#64748b',
                        background: '#f8fafc', borderTop: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {diagram.caption}
                      </div>
                    )}
                    <Tooltip title="Xoá sơ đồ này">
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          opacity: 0.9, borderRadius: 4,
                        }}
                        onClick={() => handleDeleteExisting(diagram.diagramId)}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
              {deleteDiagramIds.length > 0 && (
                <Text style={{ color: '#f59e0b', fontSize: 12, display: 'block', marginTop: 8 }}>
                  ⚠ {deleteDiagramIds.length} sơ đồ sẽ bị xoá khi lưu.
                </Text>
              )}
            </div>
          )}

          {/* Upload new diagrams */}
          <div>
            <Text style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: 12 }}>
              <PlusOutlined style={{ marginRight: 4 }} />
              Thêm sơ đồ mới
            </Text>
            <Dragger
              listType="picture"
              fileList={newFileList}
              onChange={({ fileList: fl }) => setNewFileList(fl)}
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

          {article.status === 'REJECTED' && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa' }}>
              <Text style={{ color: '#c2410c', fontSize: 13 }}>
                ℹ Bài viết bị từ chối. Sau khi lưu, bài viết sẽ tự động chuyển về trạng thái <Tag color="orange">Chờ duyệt</Tag>.
              </Text>
            </div>
          )}
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

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }} styles={{ body: { padding: '36px 40px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Chỉnh sửa bài viết</Title>
          {article.status === 'REJECTED' && <Tag color="red">Bị từ chối</Tag>}
          {article.status === 'PENDING' && <Tag color="orange">Chờ duyệt</Tag>}
          {article.status === 'DRAFT' && <Tag color="default">Nháp</Tag>}
        </div>
        <Text style={{ color: '#64748b', display: 'block', marginBottom: 24 }}>
          Cập nhật nội dung bài viết. Bài viết sẽ được đưa vào hàng chờ kiểm duyệt lại sau khi lưu.
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
              * Bài viết sẽ được đưa lại vào hàng chờ kiểm duyệt sau khi lưu.
            </Text>
            <Space>
              <Button size="large" onClick={() => navigate(-1)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isPending}
                icon={article.status === 'REJECTED' ? <SendOutlined /> : <SaveOutlined />}
                style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700 }}
              >
                {article.status === 'REJECTED' ? 'Lưu & Gửi lại' : 'Lưu thay đổi'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      <Modal
        title="Gửi duyệt bài viết?"
        open={showSubmitModal}
        onCancel={() => {
          setShowSubmitModal(false);
          navigate('/student/my-articles');
        }}
        footer={[
          <Button key="later" onClick={() => {
            setShowSubmitModal(false);
            navigate('/student/my-articles');
          }}>
            Để sau
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={() => {
              submitArticle(articleId, {
                onSuccess: () => navigate('/student/my-articles'),
              });
            }}
            style={{ background: '#0d9488', borderColor: '#0d9488' }}
          >
            Gửi duyệt ngay
          </Button>,
        ]}
      >
        <p>Bài viết đã được lưu nháp. Bạn có muốn gửi bài viết để kiểm duyệt ngay bây giờ không?</p>
      </Modal>
    </div>
  );
}
