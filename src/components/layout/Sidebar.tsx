import { Link } from 'react-router-dom';
import { 
    Shield, 
    Users, 
    DollarSign, 
    Home, 
    HelpCircle, 
    FileText, 
    UserCog, 
    HeartHandshake,
    Settings,
    BarChart2,
    MessageCircle
  } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  submenu?: {
    title: string;
    href: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigation: NavItem[] = [
    {
      title: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      href: '/dashboard',
    },
    {
        title: 'Analytics',
        icon: <BarChart2 className="w-5 h-5" />, // Changed from BarChart to BarChart2
        href: '/analytics',
        submenu: [
          { title: 'User Growth', href: '/analytics/user-growth' },
          { title: 'Revenue', href: '/analytics/revenue' },
          { title: 'Engagement', href: '/analytics/engagement' },
          { title: 'Content Performance', href: '/analytics/content' },
        ]
      },
    {
      title: 'Community',
      icon: <Users className="w-5 h-5" />,
      href: '/community',
      submenu: [
        { title: 'Quizzes', href: '/community/quizzes' },
        { title: 'Polls', href: '/community/polls' },
        { title: 'Dating Tips', href: '/community/tips' },
        { title: 'Topics', href: '/community/topics' },
      ]
    },
    {
      title: 'User Management',
      icon: <UserCog className="w-5 h-5" />,
      href: '/users',
      submenu: [
        { title: 'All Users', href: '/users/all' },
        { title: 'Experts', href: '/users/experts' },
        { title: 'Blocked Users', href: '/users/blocked' },
        { title: 'Reports', href: '/users/reports' },
      ]
    },
    {
      title: 'Content Moderation',
      icon: <Shield className="w-5 h-5" />,
      href: '/moderation',
      badge: 'New',
      submenu: [
        { title: 'Review Queue', href: '/requests/queue' },
        { title: 'Reported Content', href: '/moderation/reported' },
        { title: 'AI Moderation', href: '/moderation/ai' },
        { title: 'Risk Alerts', href: '/moderation/alerts' },
      ]
    },
    {
      title: 'Payments & Payouts',
      icon: <DollarSign className="w-5 h-5" />,
      href: '/payments',
      submenu: [
        { title: 'Payout Requests', href: '/payments/payouts' },
        { title: 'Payment History', href: '/payments/history' },
        { title: 'Pricing Plans', href: '/payments/plans' },
        { title: 'Tax Documents', href: '/payments/tax' },
      ]
    },
    {
      title: 'Team Management',
      icon: <HeartHandshake className="w-5 h-5" />,
      href: '/team',
      submenu: [
        { title: 'Admin Users', href: '/team/admins' },
        { title: 'Support Team', href: '/team/support' },
        { title: 'Moderators', href: '/team/moderators' },
        { title: 'Permissions', href: '/team/permissions' },
      ]
    },
    {
      title: 'Support',
      icon: <HelpCircle className="w-5 h-5" />,
      href: '/support',
      submenu: [
        { title: 'Help Center', href: '/support/help' },
        { title: 'User Tickets', href: '/support/tickets' },
        { title: 'FAQ Manager', href: '/support/faq' },
      ]
    },
    {
      title: 'Content Management',
      icon: <FileText className="w-5 h-5" />,
      href: '/content',
      submenu: [
        { title: 'Terms & Conditions', href: '/content/terms' },
        { title: 'Privacy Policy', href: '/content/privacy' },
        { title: 'Community Guidelines', href: '/content/guidelines' },
      ]
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings',
      submenu: [
        { title: 'General', href: '/settings/general' },
        { title: 'Notifications', href: '/settings/notifications' },
        { title: 'Security', href: '/settings/security' },
        { title: 'API Keys', href: '/settings/api' },
      ]
    },
    {
      title: 'Request Management',
      icon: <MessageCircle className="w-5 h-5" />,
      path: '/requests',
      submenu: [
        { title: 'All Requests', path: '/requests' },
        { title: 'Responses', path: '/requests/responses' }
      ]
    },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-gray-900 text-white w-64", className)}>
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold">F Boy Filter Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navigation.map((item, index) => (
            <li key={index}>
              <div className="relative">
                <Link
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
                {item.submenu && (
                  <ul className="pl-12 mt-1 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.href}
                          className="text-sm text-gray-300 hover:text-white block py-1"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700" />
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@fboyfilter.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;