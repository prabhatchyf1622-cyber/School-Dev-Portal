import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  UserCheck,
  CreditCard,
  BookOpen,
  CalendarClock,
  BarChart3,
  Megaphone,
  Bus,
  CalendarDays,
  BookMarked,
  Sparkles,
  ArrowRight,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  School,
  ChevronDown
} from 'lucide-react';

interface StudentParentDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentParentDashboard: React.FC<StudentParentDashboardProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    selectedChild,
    allUsers,
    setSelectedChildId,
    homeworks,
    submissions,
    attendance,
    results,
    fees,
    notices,
    events,
    transportRoutes
  } = useSchool();

  const isParent = currentUser.role === 'parent';

  // Target student for metrics
  const activeStudent = isParent ? (selectedChild || allUsers.find(u => u.role === 'student') || currentUser) : currentUser;

  // Filter linked children for parents
  const linkedChildren = allUsers.filter(u => u.role === 'student');

  // Student specific metrics
  const studentSubmissions = submissions.filter(s => s.studentId === activeStudent.id);
  const pendingHomeworkCount = homeworks.filter(h => !studentSubmissions.some(s => s.homeworkId === h.id)).length;

  const studentAttendance = attendance.filter(a => a.studentId === activeStudent.id);
  const presentDays = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((presentDays / studentAttendance.length) * 100) : 94;

  const studentFees = fees.filter(f => f.studentId === activeStudent.id || !f.studentId);
  const pendingFees = studentFees.filter(f => f.status !== 'paid');
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  const studentResults = results.filter(r => r.studentId === activeStudent.id);
  const avgMarks = studentResults.length > 0
    ? Math.round(studentResults.reduce((sum, r) => sum + (r.marksObtained / r.totalMarks) * 100, 0) / studentResults.length)
    : 88;

  // 9 Visual Action Tiles matching the user's reference mockup
  const actionTiles = [
    {
      id: 'attendance',
      title: 'Attendance',
      featureName: 'Real-time Attendance',
      description: isParent ? "Track your child's attendance instantly." : 'Check your daily attendance records.',
      bgGradient: 'from-emerald-500 to-green-600',
      shadowColor: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-400/20 text-emerald-100',
      badgeText: `${attendanceRate}% Present`,
      icon: UserCheck,
    },
    {
      id: 'fees',
      title: 'Fees',
      featureName: 'Fee Management',
      description: isParent ? 'View fee details and make payments online.' : 'View fee invoices and receipts.',
      bgGradient: 'from-sky-500 to-blue-600',
      shadowColor: 'shadow-sky-500/20',
      badgeBg: totalPendingAmount > 0 ? 'bg-amber-400/25 text-white' : 'bg-white/20 text-white',
      badgeText: totalPendingAmount > 0 ? `₹${totalPendingAmount.toLocaleString()} Due` : 'Clear',
      icon: CreditCard,
    },
    {
      id: 'homework',
      title: 'Homework',
      featureName: 'Homework & Tasks',
      description: isParent ? 'Stay updated with homework and assignments.' : 'View assignments and submit homework.',
      bgGradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: `${pendingHomeworkCount} Pending`,
      icon: BookOpen,
    },
    {
      id: 'timetable',
      title: 'Time Table',
      featureName: 'Class Schedule',
      description: 'Access class timetable anytime, anywhere.',
      bgGradient: 'from-indigo-500 to-purple-600',
      shadowColor: 'shadow-indigo-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: 'Mon - Fri',
      icon: CalendarClock,
    },
    {
      id: 'exams',
      title: 'Exam Results',
      featureName: 'Performance Cards',
      description: 'Check exam results and performance easily.',
      bgGradient: 'from-teal-500 to-emerald-600',
      shadowColor: 'shadow-teal-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: `${avgMarks}% Score`,
      icon: BarChart3,
    },
    {
      id: 'notices',
      title: 'Notice Board',
      featureName: 'Circulars & Alerts',
      description: 'Get important school notices and updates.',
      bgGradient: 'from-amber-500 to-yellow-600',
      shadowColor: 'shadow-yellow-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: `${notices.length} Notices`,
      icon: Megaphone,
    },
    {
      id: 'transport',
      title: 'Transport',
      featureName: 'Bus Tracking',
      description: isParent ? "Track your child's bus in real-time." : 'View bus route, stop times and driver info.',
      bgGradient: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: transportRoutes[0]?.busNumber || 'Bus #12',
      icon: Bus,
    },
    {
      id: 'events',
      title: 'Events',
      featureName: 'School Calendar',
      description: 'Never miss an important school event.',
      bgGradient: 'from-rose-500 to-pink-600',
      shadowColor: 'shadow-rose-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: `${events.length} Upcoming`,
      icon: CalendarDays,
    },
    {
      id: 'library_resources',
      title: 'Library',
      featureName: 'Digital Library',
      description: 'Access digital books, study notes and question banks.',
      bgGradient: 'from-purple-500 to-indigo-600',
      shadowColor: 'shadow-purple-500/20',
      badgeBg: 'bg-white/20 text-white',
      badgeText: 'Study Notes',
      icon: BookMarked,
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Student / Child Header Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-5 shadow-lg border border-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-white/10 to-transparent pointer-events-none rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={activeStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={activeStudent.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-200 font-medium">
                  {isParent ? 'Parent Portal' : 'Student Portal'}
                </span>
                <span className="text-blue-300">·</span>
                <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full font-semibold">
                  {activeStudent.studentId || 'SD-2026-10A'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                Welcome, {isParent ? `${currentUser.name} (Parent of ${activeStudent.name})` : activeStudent.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-blue-100">
                <span className="inline-flex items-center gap-1 font-medium bg-blue-900/60 px-2 py-0.5 rounded-lg border border-blue-400/20">
                  <School className="w-3.5 h-3.5 text-blue-300" />
                  Class {activeStudent.classId || '10'} - Section {activeStudent.section || 'A'}
                </span>
                <span>Roll No: {activeStudent.rollNumber || '14'}</span>
              </div>
            </div>
          </div>

          {/* If Parent: Multi-Child Switcher */}
          {isParent && linkedChildren.length > 1 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 self-stretch sm:self-center shrink-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                Select Child
              </label>
              <div className="flex gap-1.5">
                {linkedChildren.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeStudent.id === child.id
                        ? 'bg-white text-blue-800 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {child.name.split(' ')[0]} ({child.classId || '10'}th)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Student Highlights Strip */}
        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Attendance</span>
            <span className="text-sm sm:text-base font-extrabold text-white">{attendanceRate}%</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Pending Tasks</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-300">{pendingHomeworkCount} Tasks</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Term Avg</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-300">{avgMarks}%</span>
          </div>
        </div>
      </div>

      {/* 9 Vibrant Action Tiles Grid (Matching Reference Screenshot 3) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Quick Operations & Modules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap any tile to open details and actions
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            9 Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {actionTiles.map(tile => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={() => onNavigateTab(tile.id)}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tile.bgGradient} p-4 sm:p-5 text-white shadow-md ${tile.shadowColor} hover:shadow-xl hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[140px] sm:min-h-[155px] active:scale-98`}
              >
                {/* Decorative background glow circle */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg group-hover:scale-125 transition-transform" />

                <div className="flex items-start justify-between w-full">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${tile.badgeBg}`}>
                    {tile.badgeText}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                    {tile.title}
                  </h4>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-medium">
                    {tile.featureName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Tutor Assistant Quick Launcher */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 shadow-md border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>SchoolDev AI Study Companion</span>
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full font-bold">24/7</span>
            </h4>
            <p className="text-xs text-purple-200/80">
              Instant explanations, step-by-step math solver, and interactive revision notes.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('ai_tutor')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5 self-end sm:self-center shrink-0"
        >
          <span>Open AI Tutor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Updates Section (Matching Reference Screenshot 3) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Recent Updates & Events
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official school announcements and upcoming diary dates
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {[
            {
              id: 'upd-1',
              title: 'Annual Day Celebration',
              description: 'The Annual Day celebration will be held on 25th July 2026. Parents are cordially invited.',
              date: '10 Jul',
              icon: CalendarDays,
              badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
              tab: 'events',
            },
            {
              id: 'upd-2',
              title: 'Parent Teacher Meeting (PTM)',
              description: 'Term 1 progress report cards will be shared during the PTM scheduled on 20th July 2026.',
              date: '8 Jul',
              icon: UserCheck,
              badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
              tab: 'events',
            },
            {
              id: 'upd-3',
              title: 'School Holiday Announcement',
              description: 'School will remain closed on 17th July 2026 on account of Muharram.',
              date: '5 Jul',
              icon: Bell,
              badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
              tab: 'notices',
            },
            {
              id: 'upd-4',
              title: 'Term 1 Mathematics Assessment Result',
              description: 'Marks scored in Mathematics and Science units have been uploaded to report cards.',
              date: '2 Jul',
              icon: BarChart3,
              badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
              tab: 'exams',
            },
          ].map(item => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.tab)}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 p-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.badgeColor}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
