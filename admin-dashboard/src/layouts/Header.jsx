import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, LogOut, Bell, UserCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { logout, user } = useAuth();
  
  // Basic theme toggle logic
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 p-4 z-30">
      <div className="flex items-center justify-between">
        {/* Mobile Toggle & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block text-xl font-semibold text-gray-800 dark:text-white">
            Welcome, {user?.username || 'Admin'}
          </div>
        </div>

        {/* Right side icons and user menu */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          </button>

          {/* Account Settings Link */}
          <NavLink
            to="/settings"
            className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <UserCircle className="h-5 w-5" />
            <span className="hidden sm:block text-sm font-medium">Account</span>
          </NavLink>

          {/* Logout Button */}
          <button 
            onClick={logout}
            className="flex items-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
