/**
 * TabbedCodeBlockRenderer — parse HTML contentBody và render các tabbed-code-block
 * thành Ant Design Tabs với nút Copy và syntax highlighting tối giản.
 */
import { useState } from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { SUPPORTED_LANGUAGES, type CodeBlock, type CodeTab } from './TabbedCodeBlockEditor';

const { Text } = Typography;

// Language color scheme
const LANG_COLORS: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  java: '#ed8b00',
  python: '#3776ab',
  csharp: '#9b4993',
  cpp: '#00599c',
  go: '#00add8',
  rust: '#ce422b',
  php: '#777bb4',
  ruby: '#cc342d',
  swift: '#fa7343',
  kotlin: '#7f52ff',
  sql: '#e38c00',
  bash: '#4eaa25',
  html: '#e34c26',
  css: '#264de4',
  json: '#cbcb41',
  xml: '#f06529',
  yaml: '#cb171e',
  plaintext: '#94a3b8',
};

function getLangLabel(lang: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.value === lang)?.label ?? lang;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Tooltip title={copied ? 'Đã copy!' : 'Copy code'}>
      <Button
        size="small"
        icon={copied ? <CheckOutlined style={{ color: '#4ade80' }} /> : <CopyOutlined />}
        onClick={handleCopy}
        style={{
          background: '#f8fafc',
          border: '1px solid #c7eadf',
          color: copied ? '#0f172a' : '#0f172a',
          borderRadius: 8,
          fontSize: 12,
          height: 30,
          boxShadow: '0 4px 10px rgba(13, 148, 136, 0.08)',
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </Tooltip>
  );
}

function CodeBlockDisplay({ block }: { block: CodeBlock }) {
  const [activeKey, setActiveKey] = useState(block.tabs[0]?.lang ?? '');

  const activeTab = block.tabs.find((t) => t.lang === activeKey) ?? block.tabs[0];

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #d1fae5',
        margin: '20px 0',
        boxShadow: '0 12px 36px rgba(13,148,136,0.12)',
        background: '#ffffff',
      }}
    >
      {/* Tabs & copy */}
      <div
        style={{
          background: '#e7f7f5',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderBottom: '1px solid #d1fae5',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {block.tabs.map((tab) => {
            const isActive = tab.lang === activeKey;
            const color = LANG_COLORS[tab.lang] ?? '#0f172a';
            return (
              <button
                key={tab.lang}
                onClick={() => setActiveKey(tab.lang)}
                style={{
                  padding: '6px 12px',
                  background: isActive ? '#ffffff' : '#d9f3ec',
                  border: isActive ? `1px solid ${color}` : '1px solid #c7eadf',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  borderRadius: 8,
                  boxShadow: isActive ? '0 6px 14px rgba(13,148,136,0.16)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {getLangLabel(tab.lang)}
              </button>
            );
          })}
        </div>
        <CopyButton code={activeTab?.code ?? ''} />
      </div>

      {block.title && (
        <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Text style={{ color: '#475569', fontSize: 12, fontWeight: 600 }}>{block.title}</Text>
        </div>
      )}

      {/* Code area */}
      <pre
        style={{
          margin: 0,
          padding: '18px 20px',
          background: '#ffffff',
          color: '#0f172a',
          fontFamily: '"Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
          fontSize: 13.5,
          lineHeight: 1.7,
          overflowX: 'auto',
          maxHeight: 520,
          overflowY: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code>{activeTab?.code || '// (empty)'}</code>
      </pre>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  /** Raw HTML string from article.contentBody */
  html: string;
  className?: string;
}

/**
 * Renders article HTML content, replacing `.tabbed-code-block` divs
 * with interactive Ant Design tab-based code viewers.
 */
export default function ArticleContentRenderer({ html, className }: Props) {
  // Split html around <div class="tabbed-code-block"...></div> placeholders
  if (!html) return null;

  const parts: Array<{ type: 'html' | 'code'; content: string; block?: CodeBlock }> = [];

  const regex = /<div class="tabbed-code-block"([^>]*)><\/div>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    // HTML before this block
    if (match.index > lastIndex) {
      parts.push({ type: 'html', content: html.slice(lastIndex, match.index) });
    }

    // Parse block attributes
    const attrs = match[1];
    const idMatch = attrs.match(/data-id="([^"]+)"/);
    const tabsMatch = attrs.match(/data-tabs="([^"]+)"/);
    const titleMatch = attrs.match(/data-title="([^"]*)"/);

    if (idMatch && tabsMatch) {
      try {
        const tabs = JSON.parse(decodeURIComponent(tabsMatch[1])) as CodeTab[];
        const block: CodeBlock = {
          id: idMatch[1],
          title: titleMatch ? decodeURIComponent(titleMatch[1]) : undefined,
          tabs,
        };
        parts.push({ type: 'code', content: '', block });
      } catch {
        // malformed: treat as html
        parts.push({ type: 'html', content: match[0] });
      }
    } else {
      parts.push({ type: 'html', content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining HTML
  if (lastIndex < html.length) {
    parts.push({ type: 'html', content: html.slice(lastIndex) });
  }

  const rootClassName = className ? `article-body-text ${className}` : 'article-body-text';

  return (
    <div className={rootClassName}>
      {parts.map((part, idx) =>
        part.type === 'html' ? (
          <div
            key={idx}
            dangerouslySetInnerHTML={{ __html: part.content }}
            className="article-body-text"
          />
        ) : part.block ? (
          <CodeBlockDisplay key={idx} block={part.block} />
        ) : null,
      )}
    </div>
  );
}
