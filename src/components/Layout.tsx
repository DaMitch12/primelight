// src/components/Layout.tsx
import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Camera, PieChart, BookOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: '/record',
      label: 'Record/Upload',
      icon: <Camera className="w-5 h-5" />
    },
    {
      path: '/insights',
      label: 'Insights',
      icon: <PieChart className="w-5 h-5" />
    },
    {
      path: '/resources',
      label: 'Resources',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-600">CommSkill</h1>
          </div>

          <nav className="flex-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                {item.icon}
                <span className="mx-4">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="mx-4">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;