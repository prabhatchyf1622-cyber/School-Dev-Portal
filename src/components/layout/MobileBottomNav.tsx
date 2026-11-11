import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Bell,
  Menu,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { portalTab, setPortalTab, toggleMobileMenu, notifications, isMobileMenuOpen } = useSchool();
  const unreadNotices = notifications.filter(n => !n.read).length;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      {/* 1. Dashboard */}
      <button
        onClick={() => setPortalTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
          portalTab === 'dashboard'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      {/* 2. Academics / Homework */}
      <button
        onClick={() => setPortalTab('homework')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
          portalTab === 'homework'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span>Tasks</span>
      </button>

      {/* 3. Timetable / Schedule */}
      <button
        onClick={() => setPortalTab('timetable')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
          portalTab === 'timetable'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Clock className="w-5 h-5 mb-0.5" />
        <span>Schedule</span>
      </button>

      {/* 4. Notices */}
      <button
        onClick={() => setPortalTab('notices')}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
          portalTab === 'notices'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5 mb-0.5" />
          {unreadNotices > 0 && (
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {unreadNotices > 9 ? '9+' : unreadNotices}
            </span>
          )}
        </div>
        <span>Alerts</span>
      </button>

      {/* 5. Full Drawer Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
          isMobileMenuOpen
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
