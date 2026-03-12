import { useMemo } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useAuthStore } from '@/stores/authStore';
import { Card, Typography, Table, Avatar, Tag, Spin } from 'antd';
import { CrownOutlined, UserOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface AuthorStat {
  rank: number;
  userId: number;
  name: string;
  email: string;
  avatarUrl?: string;
  articleCount: number;
}

export default function LeaderboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useArticles({ page: 1, pageSize: 50 });

  const leaderboard = useMemo<AuthorStat[]>(() => {
    if (!data?.data) return [];
    const map = new Map<number, Omit<AuthorStat, 'rank'>>();
    data.data.forEach((a) => {
      if (!a.author) return;
      const existing = map.get(a.author.userId);
      if (existing) {
        existing.articleCount += 1;
      } else {
        map.set(a.author.userId, {
          userId: a.author.userId,
          name: a.author.name,
          email: a.author.email,
          avatarUrl: a.author.avatarUrl,
          articleCount: 1,
        });
      }
    });
    return Array.from(map.values())
      .sort((a, b) => b.articleCount - a.articleCount)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [data]);

  const top3 = leaderboard.slice(0, 3);

  const medalColors: Record<number, { bg: string; border: string; text: string; emoji: string }> = {
    1: { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '#f59e0b', text: '#92400e', emoji: '🥇' },
    2: { bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', border: '#94a3b8', text: '#475569', emoji: '🥈' },
    3: { bg: 'linear-gradient(135deg, #fed7aa, #fdba74)', border: '#f97316', text: '#9a3412', emoji: '🥉' },
  };

  const columns: ColumnsType<AuthorStat> = [
    {
      title: 'HẠNG',
      dataIndex: 'rank',
      width: 70,
      render: (rank: number) => {
        if (rank <= 3) {
          return <span style={{ fontSize: 20 }}>{medalColors[rank].emoji}</span>;
        }
        return <Text strong style={{ color: '#94a3b8', fontSize: 14 }}>#{rank}</Text>;
      },
    },
    {
      title: 'TÁC GIẢ',
      key: 'author',
      render: (_: unknown, record: AuthorStat) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.avatarUrl} icon={<UserOutlined />} size={36} />
          <div>
            <Text strong style={{ fontSize: 14, color: '#1e293b' }}>
              {record.name}
              {record.userId === user?.userId && (
                <Tag color="teal" style={{ marginLeft: 8, fontSize: 10 }}>Bạn</Tag>
              )}
            </Text>
            <div>
              <Text style={{ fontSize: 12, color: '#94a3b8' }}>{record.email}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'SỐ BÀI VIẾT',
      dataIndex: 'articleCount',
      width: 130,
      render: (count: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileTextOutlined style={{ color: '#0d9488' }} />
          <Text strong style={{ color: '#0f172a', fontSize: 16 }}>{count}</Text>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="Đang tải bảng xếp hạng..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>
          <TrophyOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
          Bảng xếp hạng
        </Title>
        <Text style={{ color: '#64748b' }}>Top tác giả có nhiều bài viết được duyệt nhất.</Text>
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((author) => {
            const m = medalColors[author.rank];
            const isFirst = author.rank === 1;
            return (
              <Card
                key={author.userId}
                style={{
                  borderRadius: 16,
                  border: `2px solid ${m.border}`,
                  background: m.bg,
                  width: isFirst ? 220 : 190,
                  textAlign: 'center',
                  transform: isFirst ? 'scale(1.05)' : undefined,
                  boxShadow: isFirst ? '0 8px 30px rgba(245,158,11,0.2)' : undefined,
                }}
                styles={{ body: { padding: '24px 16px' } }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{m.emoji}</div>
                <Avatar
                  src={author.avatarUrl}
                  icon={<UserOutlined />}
                  size={isFirst ? 72 : 56}
                  style={{ border: `3px solid ${m.border}`, marginBottom: 12 }}
                />
                <div>
                  <Text strong style={{ fontSize: isFirst ? 16 : 14, color: m.text, display: 'block' }}>
                    {author.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 2 }}>
                    {author.email}
                  </Text>
                  <div style={{
                    marginTop: 12, padding: '6px 14px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.7)', display: 'inline-flex',
                    alignItems: 'center', gap: 6,
                  }}>
                    <FileTextOutlined style={{ color: '#0d9488' }} />
                    <Text strong style={{ color: '#0f172a' }}>{author.articleCount} bài viết</Text>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full ranking table */}
      <Card
        style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <Text strong style={{ fontSize: 16, color: '#1e293b' }}>
            <CrownOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
            Bảng xếp hạng đầy đủ
          </Text>
        </div>
        <Table
          rowKey="userId"
          columns={columns}
          dataSource={leaderboard}
          pagination={false}
          rowClassName={(record) =>
            record.userId === user?.userId ? 'bg-teal-50' : ''
          }
        />
      </Card>
    </div>
  );
}
