import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Bell,
  Globe,
  LayoutDashboard,
  Check,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  KeyRound,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { logout, user: authUser } = useAuth();
  const {
    currentUser,
    switchRolePersona,
    allUsers,
    isPublicSite,
    setIsPublicSite,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setPortalTab,
    theme,
    toggleTheme,
    isMobileMenuOpen,
    toggleMobileMenu,
  } = useSchool();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string; user: typeof currentUser }[] = [
    {
      role: 'student',
      label: 'Student',
      desc: 'Aarav Sharma (Class 10-A)',
      user: allUsers.find(u => u.id === 'stu-1') || allUsers[0],
    },
    {
      role: 'teacher',
      label: 'Teacher',
      desc: 'Priya Verma (Mathematics & Physics)',
      user: allUsers.find(u => u.id === 'tea-1') || allUsers[0],
    },
    {
      role: 'parent',
      label: 'Parent',
      desc: 'Rajesh Sharma (Parent of Aarav & Ananya)',
      user: allUsers.find(u => u.id === 'par-1') || allUsers[0],
    },
    {
      role: 'admin',
      label: 'Administrator',
      desc: 'Dr. Sunita Kulkarni (Principal)',
      user: allUsers.find(u => u.id === 'adm-1') || allUsers[0],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Mobile Hamburger + Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isPublicSite && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              title={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-rose-500" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              setIsPublicSite(false);
              setPortalTab('dashboard');
            }}
            className="flex items-center gap-2 sm:gap-2.5 text-left group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block leading-tight">
                SchoolDev
              </span>
              <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Operating System
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setIsPublicSite(false)}
            className={`transition-colors pb-0.5 border-b-2 ${
              !isPublicSite
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            School Portal
          </button>
          <button
            onClick={() => setIsPublicSite(true)}
            className={`flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 ${
              isPublicSite
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Website
          </button>
          <button
            onClick={() => switchRolePersona('student')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors"
            title="Open Student & Parent Mobile App experience"
          >
            <span>📱 Student & Parent App</span>
          </button>
        </nav>

        {/* Zone 3: Actions, Theme Switcher & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Toggle for Public / Portal on mobile */}
          <button
            onClick={() => setIsPublicSite(!isPublicSite)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title={isPublicSite ? 'Switch to Portal' : 'Switch to Public Website'}
          >
            {isPublicSite ? <LayoutDashboard className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">Notifications ({unreadCount})</div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) {
                          setPortalTab(n.linkTab);
                          setIsPublicSite(false);
                          setShowNotifications(false);
                        }
                      }}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</div>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle Button on Top Right Corner */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Quick Role Switcher & User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-left transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-600"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  {currentUser.isEmailVerified && (
                    <span title="Verified Account">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-xs bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                    {currentUser.email}
                  </div>
                  {currentUser.isEmailVerified ? (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Email Verified & Protected</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-amber-500 font-medium mt-1">
                      Unverified Email
                    </div>
                  )}
                </div>

                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona (Demo)
                  </div>
                </div>

                <div className="p-1.5 space-y-1">
                  {roles.map(item => {
                    const isCurrent = currentUser.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRolePersona(item.role, item.user.id);
                          setShowRoleDropdown(false);
                          setIsPublicSite(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.user.avatar}
                            alt={item.label}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.label}: {item.user.name.split(' ')[0]}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Sign Out Action */}
                <div className="p-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={async () => {
                      setShowRoleDropdown(false);
                      await logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign Out Button */}
          <button
            onClick={() => logout()}
            className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Sign out of SchoolDev Portal"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
