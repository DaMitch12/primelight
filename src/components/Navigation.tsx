// src/components/Navigation.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

interface NavigationProps {
  items: NavItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-nav-bg shadow-nav z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-accent-blue">CommSkill</span>
            <span className="text-xl text-gray-400">Enhancer</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium nav-link-hover ${
                  location.pathname === item.path
                    ? 'text-accent-blue'
                    : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-nav-bg border-t border-gray-800">
        <div className="flex justify-around">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-4 flex-1 nav-link-hover ${
                location.pathname === item.path ? 'text-accent-blue' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
