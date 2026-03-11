import { Row, Col, Card, Typography, Tag, Button, Skeleton, Avatar, Space, Divider } from 'antd';
import {
  HeartFilled,
  WalletFilled,
  PlusOutlined,
  HistoryOutlined,
  BookOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useArticles } from '@/hooks/useArticles';
import { useTopics, useSubjects } from '@/hooks/useTopics';
import { useAuthStore } from '@/stores/authStore';
import type { Article } from '@/types';

const { Title, Text, Paragraph } = Typography;

// Gradient placeholder colors for article thumbnails without images
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const thumbnailUrl = article.diagrams?.[0]?.imageUrl;
  const topicColor = '#0d9488';

  return (
    <Card
      hoverable
      bodyStyle={{ padding: '20px 20px 16px' }}
      style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', height: '100%' }}
      cover={
        thumbnailUrl ? (
          <div style={{ height: 192, overflow: 'hidden' }}>
            <img
              src={thumbnailUrl}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 192,
              background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
              position: 'relative',
            }}
          />
        )
      }
    >
      {/* Topic badge — overlay on cover */}
      <div style={{ marginTop: -12, marginBottom: 12 }}>
        <Tag
          style={{
            background: topicColor,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {article.topic?.name}
        </Tag>
      </div>

      {/* Title */}
      <Link to={`/student/articles/${article.articleId}`}>
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, lineHeight: '22px', color: '#0f172a' }}
        >
          {article.title}
        </Paragraph>
      </Link>

      {/* Author + Donate */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size={8}>
          <Avatar
            src={article.author?.avatarUrl}
            size={24}
            style={{ background: '#ccfbf1', color: '#0d9488', fontSize: 11 }}
          >
            {!article.author?.avatarUrl && article.author?.fullName?.[0]}
          </Avatar>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: '14px' }}>
              {article.author?.fullName}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: '13px' }}>
              {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: vi })}
            </div>
          </div>
        </Space>

        <Button
          size="small"
          icon={<HeartFilled style={{ fontSize: 11 }} />}
          style={{
            borderRadius: 8,
            background: 'rgba(13,148,136,0.06)',
            borderColor: 'transparent',
            color: '#0d9488',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          Donate
        </Button>
      </div>
    </Card>
  );
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: recentArticles, isLoading } = useArticles({
  page: 1,        
  pageSize: 10,
  status: 'APPROVED',
  sort: 'createdAt',
  direction: 'desc',
  });
  const { data: topicsPage } = useTopics();
  const topics = topicsPage?.data ?? [];
  const { data: subjectsPage } = useSubjects();
  const subjects = subjectsPage?.data ?? [];


  const today = format(new Date(), "EEEE, dd 'Tháng' M, yyyy", { locale: vi });
  // Capitalize first letter
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>
            Xin chào, {user?.fullName}! 👋
          </Title>
          <Text style={{ color: '#64748b', fontWeight: 500 }}>{todayLabel}</Text>
        </div>
        <Link to="/student/my-articles/new">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #065f46 100%)',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              height: 44,
              paddingInline: 24,
              boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
            }}
          >
            Tạo bài viết
          </Button>
        </Link>
      </div>

      {/* Wallet card + Quick stats */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        {/* Wallet card */}
        <Col xs={24} lg={16}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #065f46 100%)',
              borderRadius: 16,
              padding: '32px',
              color: '#fff',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(13,148,136,0.3)',
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute',
                right: -80,
                top: -80,
                width: 256,
                height: 256,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                filter: 'blur(40px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -40,
                bottom: -40,
                width: 192,
                height: 192,
                background: 'rgba(0,0,0,0.08)',
                borderRadius: '50%',
                filter: 'blur(30px)',
              }}
            />

            {/* Wallet info */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>
                  Ví chính (MAIN)
                </Text>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px 12px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Đang hoạt động
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <WalletFilled style={{ fontSize: 36 }} />
                <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  120 BLUE
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, marginTop: 24 }}>
              
              <Button
                icon={<HistoryOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                Lịch sử
              </Button>
            </div>
          </div>
        </Col>

        {/* Quick stats */}
        <Col xs={24} lg={8}>
          <Card
            style={{ height: '100%', borderRadius: 16, border: '1px solid #e2e8f0' }}
            bodyStyle={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Text strong style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 24 }}>
              Thống kê nhanh
            </Text>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size={12}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartFilled style={{ color: '#3b82f6', fontSize: 18 }} />
                  </div>
                  <Text style={{ fontWeight: 500 }}>BLUE còn lại</Text>
                </Space>
                <Text strong style={{ fontSize: 18 }}>120</Text>
              </div>
          
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size={12}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartOutlined style={{ color: '#22c55e', fontSize: 18 }} />
                  </div>
                  <Text style={{ fontWeight: 500 }}>Lần đã donate</Text>
                </Space>
                <Text strong style={{ fontSize: 18 }}>15</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Subject Topics */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>Môn học</Title>
          <Link to="/student/articles" style={{ color: '#0d9488', fontWeight: 600, fontSize: 14 }}>
            Xem tất cả
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
          {subjects?.slice(0, 8).map((subject, idx) => (
            <Tag
              key={subject.subjectId}
              style={{
                padding: '6px 18px',
                borderRadius: 999,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
                whiteSpace: 'nowrap',
                background: idx === 0 ? '#0d9488' : '#fff',
                color: idx === 0 ? '#fff' : '#334155',
                border: idx === 0 ? 'none' : '1px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {subject.name}
            </Tag>
          ))}
        </div>
      </div>

      {/*  Topics */}
    
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>Chủ đề phổ biến </Title>
          <Link to="/student/articles" style={{ color: '#0d9488', fontWeight: 600, fontSize: 14 }}>
            Xem tất cả
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
          {topics?.slice(0, 8).map((topic, idx) => (
            <Tag
              key={topic.topicId}
              style={{
                padding: '6px 18px',
                borderRadius: 999,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
                whiteSpace: 'nowrap',
                background: idx === 0 ? '#0d9488' : '#fff',
                color: idx === 0 ? '#fff' : '#334155',
                border: idx === 0 ? 'none' : '1px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {topic.name}
            </Tag>
          ))}
        </div>
      </div>
      {/* Latest Articles */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>Bài viết mới nhất</Title>
          <Link to="/student/articles" style={{ color: '#64748b', fontWeight: 500, fontSize: 14 }}>
            Xem tất cả →
          </Link>
        </div>

        {isLoading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3].map((i) => (
              <Col key={i} xs={24} md={12} lg={8}>
                <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <Skeleton.Image style={{ width: '100%', height: 192, borderRadius: 8 }} active />
                  <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row gutter={[24, 24]}>
            {(recentArticles?.data ?? []).slice(0, 6).map((article, index) => (
              <Col key={article.articleId} xs={24} md={12} lg={8}>
                <ArticleCard article={article} index={index} />
              </Col>
            ))}
          </Row>
        )}

        {!isLoading && (recentArticles?.data ?? []).length === 0 && (
          <Card style={{ borderRadius: 12, textAlign: 'center', padding: '48px 24px' }}>
            <BookOutlined style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 16 }} />
            <Title level={5} style={{ color: '#94a3b8', fontWeight: 500 }}>
              Chưa có bài viết nào
            </Title>
          </Card>
        )}
      </div>
    </div>
  );
}
