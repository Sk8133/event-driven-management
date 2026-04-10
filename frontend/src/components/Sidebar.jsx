import { Link } from 'react-router-dom';
import { BarChart3, Calendar, CheckSquare, TrendingUp, Users } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: TrendingUp },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 border-r border-gray-700">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">📊</span>
        EventHub
      </h2>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


    </aside>
  );
};

export default Sidebar;