import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
    const [searchScope, setSearchScope] = useState('all');

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
            {/* LEFT: Search */}
            <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students, posts, topics..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white"
                        />
                    </div>
                    <select
                        value={searchScope}
                        onChange={(e) => setSearchScope(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] font-medium text-gray-700"
                    >
                        <option value="all">All</option>
                        <option value="students">Students</option>
                        <option value="posts">Posts</option>
                        <option value="topics">Topics</option>
                        <option value="comments">Comments</option>
                    </select>
                </div>
            </div>

            {/* RIGHT: Notifications + User */}
            <div className="flex items-center gap-3 ml-6">
                {/* Bell Notification */}
                <button className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#F59E0B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                        4
                    </span>
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="w-9 h-9 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        JD
                    </div>
                    <span className="text-sm font-semibold text-[#111827]">John Doe</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        </header>
    );
}
