import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { PWAInstallBanner } from './PWAInstallBanner';
import { StudentParentDashboard } from './StudentParentDashboard';

// Submodules
import { HomeworkModule } from '../academic/HomeworkModule';
import { AttendanceModule } from '../academic/AttendanceModule';
import { ExaminationsModule } from '../academic/ExaminationsModule';
import { TimetableModule } from '../academic/TimetableModule';
import { DigitalLibraryModule } from '../academic/DigitalLibraryModule';
import { FeesModule } from '../finance/FeesModule';
import { LeaveModule } from '../services/LeaveModule';
import { CertificatesModule } from '../services/CertificatesModule';
import { TransportModule } from '../services/TransportModule';
import { NoticesModule } from '../communication/NoticesModule';
import { EventsModule } from '../communication/EventsModule';
import { MessagesModule } from '../communication/MessagesModule';
import { AiTutorModule } from '../ai/AiTutorModule';

import {
  Home,
  GraduationCap,
  Bell,
  MoreHorizontal,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  WifiOff,
  Smartphone,
  Maximize2,
  CheckCircle,
  Sparkles,
  BookOpen,
  Calendar,
  CreditCard,
  Bus,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const StudentAppShell: React.FC = () => {
  const { currentUser, portalTab, setPortalTab, theme, toggleTheme, notifications, markAllNotificationsRead } = useSchool();
  const { logout } = useAuth();
  const isOnline = useOnlineStatus();

  // Desktop simulator frame toggle
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);

  const isParent = currentUser.role === 'parent';
  const appTitle = isParent ? 'School Parent App' : 'School Student App';
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const getModuleTitle = (tab: string) => {
    switch (tab) {
      case 'homework': return 'Homework & Assignments';
      case 'attendance': return 'Daily Attendance Log';
      case 'exams': return 'Examinations & Report Cards';
      case 'timetable': return 'Weekly Class Schedule';
      case 'library_resources': return 'Digital Library & Notes';
      case 'fees': return 'Fee Invoices & Receipts';
      case 'leaves': return 'Leave Applications';
      case 'certificates': return 'Digital Certificates';
      case 'transport': return 'School Bus Live GPS';
      case 'notices': return 'School Circulars & Notices';
      case 'events': return 'Calendar & School Events';
      case 'messages': return 'Messages & Parent-Teacher Chat';
      case 'ai_tutor': return 'AI Learning Companion';
      default: return 'Module Details';
    }
  };

  const renderActiveModule = () => {
    switch (portalTab) {
      case 'dashboard':
        return <StudentParentDashboard onNavigateTab={(tab) => setPortalTab(tab)} />;
      case 'homework':
        return <HomeworkModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'exams':
        return <ExaminationsModule />;
      case 'timetable':
        return <TimetableModule />;
      case 'library_resources':
        return <DigitalLibraryModule />;
      case 'fees':
        return <FeesModule />;
      case 'leaves':
        return <LeaveModule />;
      case 'certificates':
        return <CertificatesModule />;
      case 'transport':
        return <TransportModule />;
      case 'notices':
        return <NoticesModule />;
      case 'events':
        return <EventsModule />;
      case 'messages':
        return <MessagesModule />;
      case 'ai_tutor':
        return <AiTutorModule />;
      default:
        return <StudentParentDashboard onNavigateTab={(tab) => setPortalTab(tab)} />;
    }
  };

  const content = (
    <div className="flex flex-col min-h-screen bg-slate-100/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>You are offline. Timetable and cached study materials are available offline.</span>
        </div>
      )}

      {/* App Header (Top App Bar matching Screenshot 3) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {portalTab !== 'dashboard' ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPortalTab('dashboard')}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {getModuleTitle(portalTab)}
                </h1>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {appTitle}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <img src="/icon.svg" alt="SchoolDev" className="w-6 h-6 invert" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {appTitle}
                </h1>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold leading-none">
                  Stay Connected, Stay Informed
                </p>
              </div>
            </div>
          )}

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            {/* Phone Frame switch toggle (visible on desktop screen) */}
            <button
              onClick={() => setIsPhoneFrame(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title={isPhoneFrame ? 'Switch to Full Width View' : 'Preview in Smartphone Device Frame'}
            >
              {isPhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 flex items-center justify-center text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-3 sm:p-4 pb-28">
        {portalTab === 'dashboard' && <PWAInstallBanner />}
        {renderActiveModule()}
      </main>

      {/* Mobile App Bottom Navigation Bar (Matching Screenshot 3) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-xl py-1.5 px-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* Home */}
          <button
            onClick={() => { setPortalTab('dashboard'); setShowServicesMenu(false); }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              portalTab === 'dashboard' && !showServicesMenu
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Academics (Homework/Timetable/Exams) */}
          <button
            onClick={() => { setPortalTab('homework'); setShowServicesMenu(false); }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              ['homework', 'timetable', 'exams', 'library_resources'].includes(portalTab) && !showServicesMenu
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Academics</span>
          </button>

          {/* Notices & Messages */}
          <button
            onClick={() => { setPortalTab('notices'); setShowServicesMenu(false); }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              ['notices', 'events', 'messages'].includes(portalTab) && !showServicesMenu
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Notices</span>
          </button>

          {/* Services / More */}
          <button
            onClick={() => setShowServicesMenu(prev => !prev)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              showServicesMenu || ['fees', 'transport', 'leaves', 'certificates', 'ai_tutor'].includes(portalTab)
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Services</span>
          </button>
        </div>
      </nav>

      {/* Services Sheet Modal */}
      {showServicesMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                All Student & Parent Services
              </h3>
              <button
                onClick={() => setShowServicesMenu(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {[
                { id: 'fees', label: 'Fees & Invoices', icon: CreditCard, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50' },
                { id: 'transport', label: 'Bus GPS Tracking', icon: Bus, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
                { id: 'leaves', label: 'Leave Request', icon: Calendar, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
                { id: 'certificates', label: 'Certificates', icon: FileCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
                { id: 'ai_tutor', label: 'AI Study Tutor', icon: Sparkles, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
                { id: 'library_resources', label: 'Digital Library', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
              ].map(s => {
                const SIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setPortalTab(s.id);
                      setShowServicesMenu(false);
                    }}
                    className="flex flex-col items-center text-center p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-slate-100 dark:border-slate-800/80 active:scale-95"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${s.color}`}>
                      <SIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Notifications & Circulars
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className="py-2.5 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>{notif.title}</span>
                    <span className="text-[10px] font-normal text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If Phone Simulator Frame is enabled on desktop screen:
  if (isPhoneFrame) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center">
        {/* Simulator controls header */}
        <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-white">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold">Android Phone Simulator (Pixel / Galaxy)</span>
          </div>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Width</span>
          </button>
        </div>

        {/* Realistic Mobile Device Mockup Frame */}
        <div className="relative w-full max-w-[400px] h-[820px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-12 ring-slate-800 border-4 border-slate-700 flex flex-col overflow-hidden">
          {/* Top Speaker and Camera Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
            <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
            </div>
          </div>

          {/* Device Screen */}
          <div className="flex-1 w-full bg-white dark:bg-slate-950 rounded-[38px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 relative">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Normal responsive viewport
  return content;
};
