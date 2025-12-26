import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  TagIcon, 
  StarIcon, 
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Promo Codes', href: '/promos', icon: TagIcon },
  { name: 'Reviews', href: '/reviews', icon: StarIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={twMerge(
          'fixed top-0 left-0 z-50 w-72 h-screen transition-transform duration-300 ease-in-out',
          'bg-white border-r border-gray-200 shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto'
        )}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Rentora</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="px-4 py-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shadow-md text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.username || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-2">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = item.href === '/' 
                  ? location.pathname === item.href 
                  : location.pathname.startsWith(item.href);
                  
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => twMerge(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                          : 'text-gray-700 hover:bg-gray-100',
                        'group'
                      )}
                      onClick={onClose}
                    >
                      <item.icon 
                        className={twMerge(
                          'flex-shrink-0 w-5 h-5 transition-transform duration-200',
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-500 group-hover:text-blue-600',
                          'group-hover:scale-110'
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Settings Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <NavLink
                to="/settings"
                className={({ isActive }) => twMerge(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-700 hover:bg-gray-100',
                  'group'
                )}
                onClick={onClose}
              >
                <Cog6ToothIcon 
                  className={twMerge(
                    'flex-shrink-0 w-5 h-5 transition-transform duration-200',
                    location.pathname === '/settings'
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-blue-600',
                    'group-hover:rotate-90'
                  )}
                  aria-hidden="true"
                />
                <span>Settings</span>
                {location.pathname === '/settings' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </NavLink>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>© 2024 Rentora</span>
              <span className="font-medium">v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;