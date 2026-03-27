import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSemesterLeaderboard, useSemesters } from '@/hooks/useSemesters';
import type { Semester, SemesterLeaderboardEntry } from '@/types';
import { Avatar, Card, Empty, Select, Spin, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CalendarOutlined, CrownOutlined, RiseOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const formatCoins = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

export default function LeaderboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: semesterData, isLoading: isLoadingSemesters } = useSemesters({ page: 1, pageSize: 50 });
  const semesters = useMemo(
    () => (semesterData?.data ?? []).filter((s) => !s.deleted),
    [semesterData],
  );

  const [selectedSemester, setSelectedSemester] = useState<string>();

  useEffect(() => {
    if (!selectedSemester && semesters.length > 0) {
      setSelectedSemester(semesters[0].semesterCode);
    }
  }, [selectedSemester, semesters]);

  const {
    data: leaderboard = [],
    isLoading: isLoadingLeaderboard,
    isFetching: isFetchingLeaderboard,
  } = useSemesterLeaderboard(selectedSemester);

  const selectedSemesterInfo = useMemo<Semester | undefined>(
    () => semesters.find((s) => s.semesterCode === selectedSemester),
    [semesters, selectedSemester],
  );

  const top3 = leaderboard.slice(0, 3);

  const medalColors: Record<number, { bg: string; border: string; text: string; emoji: string }> = {
    1: { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '#f59e0b', text: '#92400e', emoji: '🥇' },
    2: { bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', border: '#94a3b8', text: '#475569', emoji: '🥈' },
    3: { bg: 'linear-gradient(135deg, #fed7aa, #fdba74)', border: '#f97316', text: '#9a3412', emoji: '🥉' },
  };

  const columns: ColumnsType<SemesterLeaderboardEntry> = [
    {
      title: 'HẠNG',
      dataIndex: 'rank',
      width: 90,
      render: (rank: number) => (
        rank <= 3
          ? <span style={{ fontSize: 20 }}>{medalColors[rank].emoji}</span>
          : <Text strong style={{ color: '#94a3b8', fontSize: 14 }}>#{rank}</Text>
      ),
    },
    {
      title: 'SINH VIÊN',
      key: 'student',
      render: (_: unknown, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.avatarUrl ?? undefined} icon={<UserOutlined />} size={40} />
          <div>
            <Text strong style={{ fontSize: 14, color: '#1e293b' }}>
              {record.fullName}
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
      title: 'TỔNG COINS NHẬN',
      dataIndex: 'totalReceived',
      width: 180,
      render: (amount: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RiseOutlined style={{ color: '#0d9488' }} />
          <Text strong style={{ color: '#0f172a', fontSize: 16 }}>{formatCoins(amount)} xu</Text>
        </div>
      ),
      sorter: (a, b) => a.totalReceived - b.totalReceived,
      defaultSortOrder: 'descend',
    },
  ];

  const isInitialLoading = (isLoadingSemesters || isLoadingLeaderboard) && leaderboard.length === 0;

  if (isInitialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="Đang tải bảng xếp hạng..." />
      </div>
    );
  }

  if (!semesters.length) {
    return (
      <Card>
        <Empty description="Chưa có kỳ học nào" />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>
            <TrophyOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
            Bảng xếp hạng quyên góp
          </Title>
          <Text style={{ color: '#64748b' }}>
            Top sinh viên nhận được nhiều xu nhất trong kỳ học này.
          </Text>
        </div>
        <Select
          style={{ minWidth: 220 }}
          placeholder="Chọn kỳ học"
          value={selectedSemester}
          loading={isLoadingSemesters}
          onChange={setSelectedSemester}
          options={semesters.map((s) => ({ value: s.semesterCode, label: s.semesterCode }))}
        />
      </div>

      {selectedSemesterInfo && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <CalendarOutlined style={{ fontSize: 28, color: '#0d9488' }} />
            <div>
              <Text strong style={{ display: 'block', fontSize: 14, color: '#0f172a' }}>
                Kỳ {selectedSemesterInfo.semesterCode}
              </Text>
              <Text style={{ color: '#64748b' }}>
                {selectedSemesterInfo.startDate} → {selectedSemesterInfo.endDate}
              </Text>
            </div>
          </div>
        </Card>
      )}

      {leaderboard.length === 0 ? (
        <Card>
          <Empty description="Chưa có dữ liệu quyên góp" />
        </Card>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((student) => {
              const m = medalColors[student.rank];
              const isFirst = student.rank === 1;
              return (
                <Card
                  key={student.userId}
                  style={{
                    borderRadius: 16,
                    border: `2px solid ${m.border}`,
                    background: m.bg,
                    width: isFirst ? 240 : 200,
                    textAlign: 'center',
                    transform: isFirst ? 'scale(1.05)' : undefined,
                    boxShadow: isFirst ? '0 8px 30px rgba(245,158,11,0.2)' : undefined,
                  }}
                  styles={{ body: { padding: '22px 16px' } }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{m.emoji}</div>
                  <Avatar
                    src={student.avatarUrl ?? undefined}
                    icon={<UserOutlined />}
                    size={isFirst ? 78 : 62}
                    style={{ border: `3px solid ${m.border}`, marginBottom: 12 }}
                  />
                  <div>
                    <Text strong style={{ fontSize: isFirst ? 16 : 14, color: m.text, display: 'block' }}>
                      {student.fullName}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 2 }}>
                      {student.email}
                    </Text>
                    <div style={{
                      marginTop: 12,
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.7)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <RiseOutlined style={{ color: '#0d9488' }} />
                      <Text strong style={{ color: '#0f172a' }}>{formatCoins(student.totalReceived)} xu</Text>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CrownOutlined style={{ color: '#f59e0b' }} />
              <Text strong style={{ fontSize: 16, color: '#1e293b' }}>
                Top {leaderboard.length} sinh viên trong kỳ
              </Text>
              {isFetchingLeaderboard && <Tag color="blue">Đang cập nhật...</Tag>}
            </div>
            <Table
              rowKey="userId"
              columns={columns}
              dataSource={leaderboard}
              pagination={false}
              loading={isFetchingLeaderboard}
              rowClassName={(record) => (record.userId === user?.userId ? 'bg-teal-50' : '')}
            />
          </Card>
        </>
      )}
    </div>
  );
}
