import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import AppLayout from './AppLayout';

/**
 * ScrollToTop component to handle scrolling to top on route changes
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Placeholder Header component
const Header: React.FC = () => (
  <div className="p-4 border-b w-full">
    <h1 className="text-xl font-bold">Call Analysis System</h1>
  </div>
);

// Placeholder Sidebar component
const Sidebar: React.FC = () => {
  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
        { id: 'calls', label: 'Calls', icon: 'phone', path: '/calls' },
        { id: 'upload', label: 'Upload', icon: 'upload', path: '/upload' },
        { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
      ],
    },
  ];

  return (
    <div className="py-4">
      {navGroups.map((group) => (
        <div key={group.title} className="mb-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500">{group.title}</div>
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end={item.path === '/'}
                >
                  <span className="mr-2">
                    {item.icon === 'dashboard' ? '📊' : 
                     item.icon === 'phone' ? '📞' : 
                     item.icon === 'upload' ? '📤' : '⚙️'}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

/**
 * App layout wrapper that includes routing via Outlet
 * This component combines the AppLayout with React Router's Outlet
 */
const AppLayoutWithRouter: React.FC = () => {
  return (
    <AppLayout
      sidebar={<Sidebar />}
      header={<Header />}
    >
      <ScrollToTop />
      <Outlet />
    </AppLayout>
  );
};

export default AppLayoutWithRouter; 