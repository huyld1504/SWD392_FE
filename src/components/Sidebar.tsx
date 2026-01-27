import {
    BarChart,
    BookOpen,
    FileText,
    Users,
    UserCheck,
    LayoutDashboard,
    ChevronDown,
    ChevronRight,
    Wallet
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    activeItem?: string;
    onItemClick?: (item: string) => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
    submenu?: { id: string; label: string; badge?: number }[];
}

export function Sidebar({ activeItem = 'posts-pending', onItemClick }: SidebarProps) {
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['posts']);

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleItemClick = (itemId: string) => {
        onItemClick?.(itemId);
    };

    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students Management', icon: Users },
        { id: 'subjects', label: 'Subjects & Topics', icon: BookOpen },
        {
            id: 'posts',
            label: 'Posts Management',
            icon: FileText,
            badge: 12,
            submenu: [
                { id: 'posts-all', label: 'All Posts' },
                { id: 'posts-pending', label: 'Pending Review', badge: 12 },
                { id: 'posts-reported', label: 'Reported Posts', badge: 3 },
            ]
        },
        { id: 'lectures', label: 'Lectures Management', icon: UserCheck },
        {
            id: 'wallet',
            label: 'Wallet System',
            icon: Wallet,
            submenu: [
                { id: 'wallet-transactions', label: 'Transactions' },
                { id: 'wallet-rules', label: 'Coin Distribution Rules' },
            ]
        },
        {
            id: 'statistics',
            label: 'Statistics',
            icon: BarChart,
            submenu: [
                { id: 'stats-monthly', label: 'Monthly Stats' },
                { id: 'stats-users', label: 'User Analytics' },
            ]
        },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1F2937] text-white flex flex-col overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400 mt-1">Learning Platform</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    const isExpanded = expandedMenus.includes(item.id);

                    return (
                        <div key={item.id} className="mb-1">
                            {/* Main Menu Button */}
                            <button
                                onClick={() => {
                                    if (hasSubmenu) {
                                        toggleMenu(item.id);
                                    } else {
                                        handleItemClick(item.id);
                                    }
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-[#3B82F6] text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Badge */}
                                    {item.badge && item.badge > 0 && (
                                        <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                            {item.badge}
                                        </span>
                                    )}
                                    {/* Chevron */}
                                    {hasSubmenu && (
                                        isExpanded
                                            ? <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                            : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                    )}
                                </div>
                            </button>

                            {/* Submenu */}
                            {hasSubmenu && isExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {item.submenu!.map((subItem) => {
                                        const isSubActive = activeItem === subItem.id;
                                        return (
                                            <button
                                                key={subItem.id}
                                                onClick={() => handleItemClick(subItem.id)}
                                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isSubActive
                                                        ? 'bg-[#3B82F6] text-white shadow-md'
                                                        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                                                    }`}
                                            >
                                                <span>{subItem.label}</span>
                                                {subItem.badge && subItem.badge > 0 && (
                                                    <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                                        {subItem.badge}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}
