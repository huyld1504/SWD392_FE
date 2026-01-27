import { useState } from 'react';
import '../dashboard.css';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/Topbar';
import {
    Users,
    FileText,
    Clock,
    Coins,
    CheckCircle,
    XCircle,
    Eye,
    MessageSquare,
    Bookmark,
    TrendingUp,
    Sparkles,
    Award,
    ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
    const [activePage, setActivePage] = useState('posts-pending');

    const stats = [
        { title: 'Total Students', value: '2,543', icon: <Users className="w-7 h-7" />, change: '+12% from last month', color: '#3B82F6' },
        { title: 'Pending Posts', value: '12', icon: <Clock className="w-7 h-7" />, change: '8 new today', color: '#F59E0B', urgent: true },
        { title: 'Total Posts', value: '1,234', icon: <FileText className="w-7 h-7" />, change: '+8% from last month', color: '#3B82F6' },
        { title: 'Coins Distributed', value: '54,239', icon: <Coins className="w-7 h-7" />, change: '+23% from last month', color: '#10B981', sparkle: true },
    ];

    const secondaryStats = [
        { title: 'Active Topics', value: '156', icon: <MessageSquare className="w-5 h-5" /> },
        { title: 'Comments This Week', value: '892', icon: <MessageSquare className="w-5 h-5" /> },
        { title: 'Total Bookmarks', value: '3,421', icon: <Bookmark className="w-5 h-5" /> },
    ];

    const pendingPosts = [
        { id: 1, title: 'Understanding React Hooks in Depth', author: 'Sarah Johnson', authorAvatar: 'SJ', subject: 'Web Development', topic: 'React Basics', coinsEarned: 0, status: 'pending', submittedDate: '2024-01-18', comments: 5, bookmarks: 12 },
        { id: 2, title: 'Machine Learning Fundamentals', author: 'Michael Chen', authorAvatar: 'MC', subject: 'Data Science', topic: 'ML Basics', coinsEarned: 0, status: 'pending', submittedDate: '2024-01-18', comments: 3, bookmarks: 8 },
        { id: 3, title: 'CSS Grid vs Flexbox: Complete Guide', author: 'Emma Wilson', authorAvatar: 'EW', subject: 'Web Development', topic: 'CSS Advanced', coinsEarned: 50, status: 'approved', submittedDate: '2024-01-17', comments: 15, bookmarks: 34 },
        { id: 4, title: 'Python Data Structures Explained', author: 'James Brown', authorAvatar: 'JB', subject: 'Programming', topic: 'Python', coinsEarned: 0, status: 'pending', submittedDate: '2024-01-17', comments: 2, bookmarks: 5 },
    ];

    const topPosts = [
        { title: 'React Hooks Best Practices', author: 'Alice Chen', coins: 120, comments: 45 },
        { title: 'JavaScript Array Methods', author: 'Bob Wilson', coins: 95, comments: 38 },
        { title: 'CSS Animations Guide', author: 'Carol Lee', coins: 85, comments: 32 },
    ];

    const topContributors = [
        { name: 'Sarah Johnson', coins: 1250, posts: 24, avatar: 'SJ' },
        { name: 'Michael Chen', coins: 980, posts: 19, avatar: 'MC' },
        { name: 'Emma Wilson', coins: 875, posts: 17, avatar: 'EW' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="admin-dashboard min-h-screen bg-[#F9FAFB]">
            <Sidebar activeItem={activePage} onItemClick={setActivePage} />
            <TopBar />

            <main className="ml-64 mt-16 p-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-6">
                    <span className="text-gray-500">Home</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-[#111827]">Dashboard</span>
                </div>

                {/* Page Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#111827] mb-2">Dashboard</h1>
                        <p className="text-gray-600 text-base">Welcome back! Here's what's happening with your platform today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm">
                            <Clock className="w-4 h-4" />
                            Review Posts (12)
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm">
                            <Coins className="w-4 h-4" />
                            Give Bonus Coins
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.title} className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 relative overflow-hidden ${stat.urgent ? 'ring-2 ring-[#F59E0B]' : 'border border-gray-200'}`}>
                            {stat.sparkle && <Sparkles className="absolute top-3 right-3 w-5 h-5 text-[#10B981] opacity-40" />}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-[#111827] mb-2">{stat.value}</p>
                                    <p className="text-xs text-gray-500 font-medium">{stat.change}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {secondaryStats.map((stat) => (
                        <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 bg-[#06B6D4] bg-opacity-10 rounded-lg flex items-center justify-center text-[#06B6D4]">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                                <p className="text-xl font-bold text-[#111827]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-[#111827] mb-1">Posts Pending Review</h2>
                            <p className="text-sm text-gray-500">Review and moderate student submissions</p>
                        </div>
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">View All Posts</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Post Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Subject / Topic</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Coins Earned</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm font-semibold text-[#111827] line-clamp-2">{post.title}</span>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{post.comments}</span>
                                                    <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" />{post.bookmarks}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-xs font-bold">{post.authorAvatar}</div>
                                                <span className="text-sm font-medium text-[#111827]">{post.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-[#111827]">{post.subject}</span>
                                                <span className="text-xs text-gray-500">{post.topic}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Coins className="w-4 h-4 text-[#10B981]" />
                                                <span className="text-sm font-bold text-[#10B981]">{post.coinsEarned}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${getStatusColor(post.status)}`}>
                                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{post.submittedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <button className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /></button>
                                                {post.status === 'pending' && (
                                                    <>
                                                        <button className="p-2 text-[#10B981] hover:bg-green-50 rounded-lg transition-colors" title="Approve"><CheckCircle className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /></button>
                                                        <button className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors" title="Reject"><XCircle className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /></button>
                                                        <button className="p-2 text-[#10B981] hover:bg-green-50 rounded-lg transition-colors" title="Give Coins"><Coins className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                        <p className="text-sm text-gray-600 font-medium">Showing {pendingPosts.length} posts</p>
                        <button className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-semibold hover:underline">View all posts →</button>
                    </div>
                </div>

                {/* Bottom Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">Top Posts This Week</h2>
                                <p className="text-sm text-gray-500 mt-1">Most engaging content</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div className="space-y-4">
                            {topPosts.map((post, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-9 h-9 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{index + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-[#111827] mb-1 line-clamp-1">{post.title}</h3>
                                        <p className="text-xs text-gray-500 mb-2">by {post.author}</p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 font-bold text-[#10B981]"><Coins className="w-3.5 h-3.5" />{post.coins} coins</span>
                                            <span className="flex items-center gap-1 text-gray-500"><MessageSquare className="w-3.5 h-3.5" />{post.comments} comments</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">Top Contributors</h2>
                                <p className="text-sm text-gray-500 mt-1">Students with most coins</p>
                            </div>
                            <Award className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <div className="space-y-4">
                            {topContributors.map((contributor, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${index === 0 ? 'bg-[#F59E0B]' : index === 1 ? 'bg-gray-400' : 'bg-[#CD7F32]'}`}>{contributor.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-[#111827]">{contributor.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs">
                                            <span className="flex items-center gap-1 font-bold text-[#10B981]"><Coins className="w-3.5 h-3.5" />{contributor.coins}</span>
                                            <span className="text-gray-500 font-medium">{contributor.posts} posts</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
