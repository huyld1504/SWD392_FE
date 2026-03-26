/**
 * TabbedCodeBlockEditor — create multi-language code blocks.
 * Serializes to special HTML to be embedded in contentBody.
 */
import { useState } from 'react';
import {
  Button, Input, Select, Tabs, Card, Typography, Space, Tooltip, Empty, Divider,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, CodeOutlined, CloseOutlined,
} from '@ant-design/icons';
import { toast } from 'sonner';

const { Text } = Typography;

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash/Shell' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'plaintext', label: 'Plain Text' },
];

export interface CodeTab {
  lang: string;
  code: string;
}

export interface CodeBlock {
  id: string;
  title?: string;
  tabs: CodeTab[];
}

// ── Serialize / Deserialize ───────────────────────────────────────────────────

export function serializeCodeBlock(block: CodeBlock): string {
  const tabsJson = encodeURIComponent(JSON.stringify(block.tabs));
  const titleAttr = block.title
    ? ` data-title="${encodeURIComponent(block.title)}"`
    : '';
  return `<div class="tabbed-code-block" data-id="${block.id}"${titleAttr} data-tabs="${tabsJson}"></div>`;
}

export function parseCodeBlocksFromHtml(html: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex =
    /<div class="tabbed-code-block" data-id="([^"]+)"(?:[^>]*data-title="([^"]*)")?[^>]*data-tabs="([^"]+)"[^>]*><\/div>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    try {
      blocks.push({
        id: m[1],
        title: m[2] ? decodeURIComponent(m[2]) : undefined,
        tabs: JSON.parse(decodeURIComponent(m[3])) as CodeTab[],
      });
    } catch { /* skip */ }
  }
  return blocks;
}

// ── Single block editor ───────────────────────────────────────────────────────

function SingleCodeBlockEditor({
  block,
  onChange,
  onDelete,
}: {
  block: CodeBlock;
  onChange: (b: CodeBlock) => void;
  onDelete: () => void;
}) {
  const [activeKey, setActiveKey] = useState(block.tabs[0]?.lang ?? 'javascript');

  const langLabel = (lang: string) =>
    SUPPORTED_LANGUAGES.find((l) => l.value === lang)?.label ?? lang;

  const addTab = (lang: string) => {
    if (block.tabs.find((t) => t.lang === lang)) {
      toast.warning('Ngôn ngữ này đã được thêm!');
      return;
    }
    const newTabs = [...block.tabs, { lang, code: '' }];
    onChange({ ...block, tabs: newTabs });
    setActiveKey(lang);
  };

  const removeTab = (lang: string) => {
    if (block.tabs.length <= 1) {
      toast.warning('Code block phải có ít nhất 1 tab!');
      return;
    }
    const next = block.tabs.filter((t) => t.lang !== lang);
    onChange({ ...block, tabs: next });
    if (activeKey === lang) setActiveKey(next[0].lang);
  };

  const updateCode = (lang: string, code: string) => {
    onChange({
      ...block,
      tabs: block.tabs.map((t) => (t.lang === lang ? { ...t, code } : t)),
    });
  };

  const unusedLangs = SUPPORTED_LANGUAGES.filter(
    (l) => !block.tabs.find((t) => t.lang === l.value),
  );

  const tabItems = block.tabs.map((tab) => ({
    key: tab.lang,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {langLabel(tab.lang)}
        {block.tabs.length > 1 && (
          <CloseOutlined
            style={{ fontSize: 10, color: '#94a3b8', cursor: 'pointer' }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              removeTab(tab.lang);
            }}
          />
        )}
      </span>
    ),
    children: (
      <div style={{ padding: 16, background: '#ffffff', border: '1px solid #d1fae5', borderTop: '1px solid #d1fae5', borderRadius: '0 0 12px 12px' }}>
        <Input.TextArea
          value={tab.code}
          onChange={(e) => updateCode(tab.lang, e.target.value)}
          placeholder={`// ${langLabel(tab.lang)} code here...`}
          autoSize={{ minRows: 8, maxRows: 24 }}
          style={{
            fontFamily: '"Fira Code", Consolas, monospace',
            fontSize: 13,
            lineHeight: 1.6,
            background: '#f8fafc',
            color: '#0f172a',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            padding: '14px',
            resize: 'vertical',
          }}
          spellCheck={false}
        />
      </div>
    ),
  }));

  return (
    <Card
      style={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff', overflow: 'hidden', boxShadow: '0 6px 20px rgba(15, 118, 110, 0.06)' }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e2e8f0',
      }}>
        <Space>
          <CodeOutlined style={{ color: '#0d9488', fontSize: 16 }} />
          <Input
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Tiêu đề code block (tùy chọn)"
            variant="borderless"
            style={{ fontWeight: 600, fontSize: 13, width: 220, padding: 0 }}
          />
        </Space>
        <Space>
          <Select
            size="small"
            placeholder="+ Thêm ngôn ngữ"
            style={{ width: 160 }}
            value={undefined as string | undefined}
            onChange={(lang: string) => addTab(lang)}
            options={unusedLangs.map((l) => ({ value: l.value, label: l.label }))}
            showSearch
            optionFilterProp="label"
          />
          <Tooltip title="Xoá code block này">
            <Button danger size="small" icon={<DeleteOutlined />} onClick={onDelete} type="text" />
          </Tooltip>
        </Space>
      </div>

      {/* Editor area */}
      <div style={{ background: '#f0fdf9', padding: 12 }}>
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabItems}
          size="small"
          tabBarGutter={8}
          tabBarStyle={{
            margin: 0,
            padding: '4px 6px 0',
            background: '#e7f7f5',
            border: '1px solid #d1fae5',
            borderRadius: 10,
          }}
        />
      </div>
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  blocks: CodeBlock[];
  onChange: (blocks: CodeBlock[]) => void;
}

export default function TabbedCodeBlockEditor({ blocks, onChange }: Props) {
  const addBlock = () => {
    onChange([
      ...blocks,
      { id: `cb-${Date.now()}`, title: '', tabs: [{ lang: 'javascript', code: '' }] },
    ]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>
          <CodeOutlined style={{ marginRight: 6, color: '#0d9488' }} />
          Code Block
          {blocks.length > 0 && (
            <Text style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
              ({blocks.length} block)
            </Text>
          )}
        </Text>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addBlock}
          style={{ borderColor: '#0d9488', color: '#0d9488', borderRadius: 8 }}
        >
          Thêm Code Block
        </Button>
      </div>

      {blocks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: '#94a3b8', fontSize: 13 }}>
              Chưa có code block nào. Nhấn <strong>"Thêm Code Block"</strong> để bắt đầu.
            </span>
          }
          style={{ border: '2px dashed #e2e8f0', borderRadius: 12, padding: '24px 0', background: '#fafafa' }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {blocks.map((block, idx) => (
            <div key={block.id}>
              {idx > 0 && <Divider style={{ margin: '0 0 16px', borderColor: '#f1f5f9' }} />}
              <SingleCodeBlockEditor
                block={block}
                onChange={(updated) =>
                  onChange(blocks.map((b) => (b.id === updated.id ? updated : b)))
                }
                onDelete={() => onChange(blocks.filter((b) => b.id !== block.id))}
              />
            </div>
          ))}
        </div>
      )}

      <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginTop: 10 }}>
        💡 Code block sẽ hiển thị với các tab chọn ngôn ngữ trong bài viết.
      </Text>
    </div>
  );
}
