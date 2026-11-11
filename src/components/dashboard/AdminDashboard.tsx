import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  DollarSign,
  CheckCircle2,
  BookOpen,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Check,
  Building2,
  GraduationCap,
  Search,
  School,
  Send,
  PieChart,
  BellRing,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Filter
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    registerUser,
    fees,
    attendance,
    notices,
    admissionInquiries,
    updateInquiryStatus,
    setPortalTab,
    publishNotice,
  } = useSchool();

  // Create user modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userClass, setUserClass] = useState('10');
  const [userSection, setUserSection] = useState('A');
  const [userRoll, setUserRoll] = useState('35');

  // Broadcast notice modal
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'general' | 'exam' | 'holiday' | 'urgent'>('general');
  const [noticeTarget, setNoticeTarget] = useState<'all' | 'student' | 'teacher' | 'parent'>('all');
  const [noticeContent, setNoticeContent] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Metrics
  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const parents = allUsers.filter(u => u.role === 'parent');

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

  const totalAttendanceDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const schoolAttendanceRate = totalAttendanceDays > 0 ? Math.round((presentDays / totalAttendanceDays) * 100) : 94;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      name: userName,
      email: userEmail,
      role: userRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isActive: true,
      classId: userRole === 'student' ? userClass : undefined,
      section: userRole === 'student' ? userSection : undefined,
      rollNumber: userRole === 'student' ? userRoll : undefined,
      studentId: userRole === 'student' ? `SD-2026-${userClass}${userRoll}` : undefined,
      designation: userRole === 'teacher' ? 'Assistant Teacher' : undefined,
    });

    setShowAddUser(false);
    setUserName('');
    setUserEmail('');
    showToast(`New user "${userName}" (${userRole}) registered successfully!`);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    publishNotice({
      title: noticeTitle,
      category: noticeCategory,
      targetRole: noticeTarget,
      content: noticeContent,
      priority: noticeCategory === 'urgent' ? 'critical' : 'normal',
      author: 'Administrative Directorate',
    });

    setShowBroadcast(false);
    setNoticeTitle('');
    setNoticeContent('');
    showToast('School-wide circular published to portal!');
  };

  // Top Defaulters Data (Matching Screenshot 1)
  const defaulters = [
    { name: 'John Kamau', grade: 'Grade 10-A', amount: 120000, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Mary Wanjiku', grade: 'Grade 9-B', amount: 98400, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { name: 'David Otieno', grade: 'Grade 8-A', amount: 75000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Sarah Achieng', grade: 'Grade 7-C', amount: 60500, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Peter Mwangi', grade: 'Grade 6-B', amount: 50000, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Campus Management Header (Matching Screenshot 1) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>SchoolLabs Central Campus · Academic Workspace</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            School Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            School-wide operations across academic, administrative and financial departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddUser(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student / Staff</span>
          </button>
          <button
            onClick={() => setShowBroadcast(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 4 Primary Stat Cards (Matching Screenshot 1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
              +4.2%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            10,002
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Students · Active learners
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Allocated
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            6
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Classes · 32 Sections
          </div>
        </div>

        {/* Parents */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Verified
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            9,840
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Parents · Linked contacts
          </div>
        </div>

        {/* Staff */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
              +2
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            86
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Staff · Active team
          </div>
        </div>
      </div>

      {/* Info Pill (Matching Screenshot 1) */}
      <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Enrollment stands at <strong>10,005 students</strong> (4,943 boys, 5,062 girls).</span>
        </div>
        <span className="hidden sm:inline font-bold text-blue-700 dark:text-blue-300">Term 1 Active Session</span>
      </div>

      {/* Charts & Analytics Row (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Student Gender Ratio Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Counts</h3>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Boys
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Girls
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* SVG Donut */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="238.7" strokeDashoffset="119.3" />
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="238.7" strokeDashoffset="0" className="opacity-90" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">10,005</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Students</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Boys</span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">4,943 (49.4%)</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Girls</span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">5,062 (50.6%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Class-wise Student Distribution Bar Chart (Matching Screenshot 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Class-wise Distribution</h3>
              <p className="text-[11px] text-slate-500">Student count per grade level</p>
            </div>
            <button
              onClick={() => setPortalTab('users')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {[
              { grade: 'Playgroup', count: 1850, height: '44%' },
              { grade: 'Grade 1', count: 2750, height: '65%' },
              { grade: 'Grade 2 W', count: 2960, height: '70%' },
              { grade: 'Grade 3', count: 4150, height: '98%' },
              { grade: 'Grade 4 E', count: 2275, height: '54%' },
            ].map(col => (
              <div key={col.grade} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-teal-600 transition-colors">
                  {col.count}
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end overflow-hidden h-36">
                  <div
                    className="w-full bg-teal-600 group-hover:bg-teal-500 rounded-t-lg transition-all"
                    style={{ height: col.height }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[60px] text-center">
                  {col.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Collection & Upcoming Events (Matching Screenshot 1) */}
        <div className="space-y-4">
          {/* Fee Collection Ring */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Fee Collection</h4>
              <button onClick={() => setPortalTab('fees')} className="text-[11px] font-bold text-teal-600 hover:underline">
                View Finance
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="16, 100" />
                </svg>
                <span className="absolute text-xs font-black text-slate-900 dark:text-white">16%</span>
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" /> Collected:
                  </span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">₹56,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">₹300,500</span>
                </div>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Total Fees:</span>
                  <span className="text-slate-900 dark:text-white">₹357,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Mini Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Upcoming Events</h4>
              <button onClick={() => setPortalTab('events')} className="text-[11px] font-bold text-teal-600 hover:underline">
                View Calendar
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex flex-col items-center justify-center text-[10px] font-bold">
                    <span>01</span>
                    <span className="text-[8px] uppercase">May</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Academic Day</h5>
                    <p className="text-[10px] text-slate-400">07:00 AM - 10:00 AM</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
                  Academic
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex flex-col items-center justify-center text-[10px] font-bold">
                    <span>07</span>
                    <span className="text-[8px] uppercase">May</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Scouts Day</h5>
                    <p className="text-[10px] text-slate-400">08:30 AM - 01:30 PM</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Sports
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Overview Trend & Top Fee Defaulters Row (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Finance Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Finance Overview</h3>
              <p className="text-[11px] text-slate-500">Fee collection and revenue performance analysis</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-teal-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Fees Paid
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Fees Pending
              </span>
              <button onClick={() => setPortalTab('fees')} className="text-teal-600 hover:underline font-bold">
                View full report
              </button>
            </div>
          </div>

          {/* SVG Trend Line Graph */}
          <div className="relative h-44 w-full pt-4">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeDasharray="4" />

              {/* Pending Fee dotted line */}
              <path
                d="M 20 120 Q 100 110, 200 90 T 380 60 T 580 50"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="4"
              />

              {/* Paid Fee solid teal line */}
              <path
                d="M 20 135 Q 100 125, 200 110 T 380 85 T 580 80"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              {[[20, 135], [110, 128], [200, 110], [300, 100], [400, 85], [500, 82], [580, 80]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>

            {/* Months Axis */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        {/* Top Fee Defaulters (Matching Screenshot 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Fee Defaulters</h3>
              <p className="text-[11px] text-slate-500">Highest overdue tuition fees</p>
            </div>
            <button onClick={() => setPortalTab('fees')} className="text-xs font-bold text-teal-600 hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {defaulters.map(d => (
              <div key={d.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{d.name}</h5>
                    <p className="text-[10px] text-slate-400">{d.grade}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    ₹{d.amount.toLocaleString()}
                  </div>
                  <button
                    onClick={() => showToast(`Automated SMS reminder dispatched to ${d.name}'s parents!`)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Remind
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed (Matching Screenshot 1) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <span className="text-xs font-bold text-teal-600 hover:underline cursor-pointer">View all</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Payment received</p>
              <p className="text-[11px] text-slate-500">Peter Kamau · <span className="font-semibold text-teal-600">₹12,500</span></p>
              <span className="text-[10px] text-slate-400">2m ago</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">New student enrolled</p>
              <p className="text-[11px] text-slate-500">Grace Wanjiru · Grade 3 West</p>
              <span className="text-[10px] text-slate-400">48m ago</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Parent meeting scheduled</p>
              <p className="text-[11px] text-slate-500">John's Parent · May 10, 2026</p>
              <span className="text-[10px] text-slate-400">1h ago</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Fee reminder sent</p>
              <p className="text-[11px] text-slate-500">Dispatched to 32 parents</p>
              <span className="text-[10px] text-slate-400">2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New School User</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="user@schooldev.edu"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">User Role</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {userRole === 'student' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class</label>
                    <input
                      type="text"
                      value={userClass}
                      onChange={e => setUserClass(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                    <input
                      type="text"
                      value={userSection}
                      onChange={e => setUserSection(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll No</label>
                    <input
                      type="text"
                      value={userRoll}
                      onChange={e => setUserRoll(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Notice Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Broadcast Circular</h3>
              <button onClick={() => setShowBroadcast(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleBroadcast} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Schedule of Annual Day 2026"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={e => setNoticeCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="exam">Examination</option>
                    <option value="holiday">Holiday</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Audience</label>
                  <select
                    value={noticeTarget}
                    onChange={e => setNoticeTarget(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="all">Entire School</option>
                    <option value="student">Students Only</option>
                    <option value="teacher">Teachers Only</option>
                    <option value="parent">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Content / Body</label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={e => setNoticeContent(e.target.value)}
                  placeholder="Official circular body text..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBroadcast(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
