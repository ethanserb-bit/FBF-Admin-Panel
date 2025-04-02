import React from 'react';
import {
  BarChart2, Users, DollarSign, MessageCircle, FileText, Settings, LogOut,
  Shield, HelpCircle, Award, Bell, UserCog, HeartHandshake, PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { title: string; path: string; }[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <BarChart2 className="w-5 h-5" />, path: '/dashboard' },

    {
      title: 'Analytics',
      icon: <PieChart className="w-5 h-5" />,
      path: '/analytics',
      submenu: [
        { title: 'User Growth', path: '/analytics/user-growth' },
        { title: 'Revenue', path: '/analytics/revenue' },
        { title: 'Engagement', path: '/analytics/engagement' },
      ]
    },
    {
      title: 'Community',
      icon: <Users className="w-5 h-5" />,
      path: '/community',
      submenu: [
        { title: 'Quizzes', path: '/community/quizzes' },
        { title: 'Polls', path: '/community/polls' },
        { title: 'Dating Tips', path: '/community/tips' },
        { title: 'Topics', path: '/community/topics' },
      ]
    },
    {
      title: 'User Management',
      icon: <UserCog className="w-5 h-5" />,
      path: '/users',
      submenu: [
        { title: 'All Users', path: '/users/all' },
        { title: 'Experts', path: '/users/experts' },
        { title: 'Blocked Users', path: '/users/blocked' },
      ]
    },
    {
      title: 'Requests',
      icon: <MessageCircle className="w-5 h-5" />,
      path: '/requests',
      submenu: [
        { title: 'Review Queue', path: '/requests/queue' },
        { title: 'Expert Requests', path: '/requests/expert' },
        { title: 'Support Tickets', path: '/requests/support' },
      ]
    },
    {
      title: 'Moderation',
      icon: <Shield className="w-5 h-5" />,
      path: '/moderation',
      submenu: [
        { title: 'Content Review', path: '/moderation/review' },
        { title: 'Reports', path: '/moderation/reports' },
        { title: 'Risk Alerts', path: '/moderation/alerts' },
      ]
    },
    {
      title: 'Payments',
      icon: <DollarSign className="w-5 h-5" />,
      path: '/payments',
      submenu: [
        { title: 'User Payouts', path: '/payments/payouts' },
        { title: 'Payment History', path: '/payments/history' },
        { title: 'Pricing Plans', path: '/payments/plans' },
      ]
    },
    {
      title: 'Team',
      icon: <HeartHandshake className="w-5 h-5" />,
      path: '/team',
      submenu: [
        { title: 'Admin Users', path: '/team/admins' },
        { title: 'Support Team', path: '/team/support' },
        { title: 'Permissions', path: '/team/permissions' },
      ]
    },
    {
      title: 'Content',
      icon: <FileText className="w-5 h-5" />,
      path: '/content',
      submenu: [
        { title: 'Terms & Conditions', path: '/content/terms' },
        { title: 'Privacy Policy', path: '/content/privacy' },
        { title: 'Community Guidelines', path: '/content/guidelines' },
      ]
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
      submenu: [
        { title: 'General', path: '/settings/general' },
        { title: 'Notifications', path: '/settings/notifications' },
        { title: 'Security', path: '/settings/security' },
      ]
    },
  ];

  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleSubmenu = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">F Boy Filter</h1>
          <p className="text-sm text-gray-600">Admin Panel</p>
        </div>

        {/* Navigation */}
<nav className="flex-1 p-4">
  <ul className="space-y-1">
    {menuItems.map((item) => (
      <li key={item.path}>
        <Link
          to={item.path}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
        {item.submenu && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.submenu.map((subItem) => (
              <li key={subItem.path}>
                <Link
                  to={subItem.path}
                  className="block px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {subItem.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
</nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;