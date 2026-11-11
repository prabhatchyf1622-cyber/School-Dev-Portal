import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
  Send,
  Award,
  Bell,
  Sparkles,
  Users,
  Bus,
  Clock,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  UserCheck2,
  LogOut,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const {
    currentUser,
    portalTab,
    setPortalTab,
    selectedChildId,
    setSelectedChildId,
    allUsers,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useSchool();

  // Child selection for parent
  const parentChildren = allUsers.filter(u => u.parentId === currentUser.id || currentUser.childrenIds?.includes(u.id));

  // Determine navigation items by role
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'timetable', label: 'Timetable', icon: Clock },
          { id: 'homework', label: 'Homework & Tasks', icon: BookOpen },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
          { id: 'exams', label: 'Exams & Results', icon: FileText },
          { id: 'library_resources', label: 'Digital Library', icon: BookOpen },
          { id: 'fees', label: 'School Fees', icon: DollarSign },
          { id: 'leaves', label: 'Leave Application', icon: Send },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'notices', label: 'Announcements', icon: Bell },
          { id: 'events', label: 'School Events', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'ai_tutor', label: 'AI Study Assistant', icon: Sparkles, badge: 'AI' },
        ];

      case 'teacher':
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'timetable', label: 'My Classes & Schedule', icon: Clock },
          { id: 'homework', label: 'Homework Management', icon: BookOpen },
          { id: 'attendance', label: 'Mark Attendance', icon: UserCheck2 },
          { id: 'exams', label: 'Exam Marks & Grades', icon: FileText },
          { id: 'library_resources', label: 'Upload Study Materials', icon: BookOpen },
          { id: 'leaves', label: 'Student Leave Requests', icon: FileCheck2 },
          { id: 'notices', label: 'Publish Notices', icon: Bell },
          { id: 'events', label: 'Activities & Events', icon: Calendar },
          { id: 'messages', label: 'Direct Messages', icon: MessageSquare },
        ];

      case 'parent':
        return [
          { id: 'dashboard', label: 'Child Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance Records', icon: CheckCircle2 },
          { id: 'homework', label: 'Homework Tracker', icon: BookOpen },
          { id: 'exams', label: 'Report Cards & Exams', icon: FileText },
          { id: 'fees', label: 'Fees & Payment Receipts', icon: DollarSign },
          { id: 'leaves', label: 'Leave Requests', icon: Send },
          { id: 'notices', label: 'School Notices', icon: Bell },
          { id: 'events', label: 'School Events', icon: Calendar },
          { id: 'messages', label: 'Teacher Contact', icon: MessageSquare },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'timetable', label: 'Academic Schedules', icon: Clock },
          { id: 'exams', label: 'Examinations', icon: FileText },
          { id: 'fees', label: 'Financial Records', icon: DollarSign },
          { id: 'leaves', label: 'Staff & Student Leaves', icon: FileCheck2 },
          { id: 'transport', label: 'Transport & Fleet', icon: Bus },
          { id: 'library_resources', label: 'Campus Library', icon: BookOpen },
          { id: 'notices', label: 'School Notices', icon: Bell },
          { id: 'events', label: 'Events & Functions', icon: Calendar },
          { id: 'admissions', label: 'Admission Inquiries', icon: Users },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const renderSidebarBody = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* User Identity Snippet */}
        <div className="mb-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
            />
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-blue-400 capitalize flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                {currentUser.role}
                {currentUser.classId && ` · Class ${currentUser.classId}-${currentUser.section}`}
              </div>
            </div>
          </div>

          {/* Child Switcher for Parents */}
          {currentUser.role === 'parent' && parentChildren.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-700">
              <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mb-1.5">
                Monitoring Child:
              </label>
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900/80 rounded-lg">
                {parentChildren.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`px-2 py-1.5 text-xs rounded-md text-left transition-all ${
                      selectedChildId === child.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">{child.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-80">{child.classId}-{child.section}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = portalTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPortalTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/30 text-indigo-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Sign Out */}
      <div className="pt-4 mt-6 border-t border-slate-800 space-y-3">
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>

        <div className="text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Session: 2026-27</span>
            <span className="font-mono text-slate-400">v2.4</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 leading-tight">
            Central School Operating System
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop & Laptop Docked Sidebar (Screen width >= 1024px) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-65px)] flex-col justify-between p-4 shrink-0 border-r border-slate-800">
        {renderSidebarBody()}
      </aside>

      {/* 2. Mobile & Tablet Sliding Off-Canvas Drawer (Screen width < 1024px) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-200 h-full flex flex-col justify-between p-4 border-r border-slate-800 shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-250">
            {/* Drawer Header with Close Button */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Portal Modules
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {renderSidebarBody()}
          </aside>
        </div>
      )}
    </>
  );
};
