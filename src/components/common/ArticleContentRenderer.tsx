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
          background: 'transparent',
          border: '1px solid #334155',
          color: copied ? '#4ade80' : '#94a3b8',
          borderRadius: 6,
          fontSize: 12,
          height: 28,
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
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #1e293b',
        margin: '20px 0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: '#0f172a',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Traffic light dots */}
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          {block.title && (
            <Text style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', marginLeft: 8 }}>
              {block.title}
            </Text>
          )}
        </div>
        <CopyButton code={activeTab?.code ?? ''} />
      </div>

      {/* Language tabs */}
      <div style={{ background: '#1e293b' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #334155', overflowX: 'auto' }}>
          {block.tabs.map((tab) => {
            const isActive = tab.lang === activeKey;
            const color = LANG_COLORS[tab.lang] ?? '#94a3b8';
            return (
              <button
                key={tab.lang}
                onClick={() => setActiveKey(tab.lang)}
                style={{
                  padding: '8px 16px',
                  background: isActive ? '#0f172a' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                  color: isActive ? '#f1f5f9' : '#64748b',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  outline: 'none',
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

        {/* Code area */}
        <pre
          style={{
            margin: 0,
            padding: '20px 24px',
            background: '#0f172a',
            color: '#e2e8f0',
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
            fontSize: 13.5,
            lineHeight: 1.7,
            overflowX: 'auto',
            maxHeight: 520,
            overflowY: 'auto',
          }}
        >
          {/* Simple syntax highlighting could be added here, 
              but for now we just show the text */}
          <code>{activeTab?.code || '// (empty)'}</code>
        </pre>
      </div>
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

  return (
    <div className={className}>
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
