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
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx'; // Corrected path

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Promo Codes', href: '/promos', icon: TagIcon },
  { name: 'Reviews', href: '/reviews', icon: StarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth(); // To potentially hide items for non-admin in the future

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={twMerge(
          'fixed top-0 left-0 z-30 w-64 h-screen pt-16 transition-transform bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0', // Ensure it's static on desktop
        )}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto">
          <div className="px-3 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = item.href === '/' 
                  ? currentPath === item.href 
                  : currentPath.startsWith(item.href);
                  
                return (
                  <li key={item.name}>
                    <NavLink // Using NavLink for active styling
                      to={item.href}
                      className={({ isActive }) => twMerge(
                        'flex items-center p-3 text-base font-medium rounded-lg',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                        'group transition-colors duration-200'
                      )}
                      onClick={onClose}
                    >
                      <item.icon 
                        className={twMerge(
                          'flex-shrink-0 w-5 h-5 transition duration-75',
                          isActive 
                            ? 'text-primary' 
                            : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
                        )}
                        aria-hidden="true"
                      />
                      <span className="ml-3">{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            
            <div className="pt-4 mt-4 border-t border-border-light dark:border-border-dark">
              <NavLink // Using NavLink for active styling
                to="/settings"
                className={({ isActive }) => twMerge(
                  'flex items-center p-3 text-base font-medium rounded-lg',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                  'group transition-colors duration-200'
                )}
                onClick={onClose}
              >
                <Cog6ToothIcon 
                  className={twMerge(
                    'flex-shrink-0 w-5 h-5 transition duration-75',
                    location.pathname === '/settings'
                      ? 'text-primary' 
                      : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
                  )}
                  aria-hidden="true"
                />
                <span className="ml-3">Settings</span>
              </NavLink>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
