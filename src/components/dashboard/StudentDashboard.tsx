import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  calculateAttendanceStats,
  calculateOverallResultSummary,
} from '../../utils/academicCalculations';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Send,
  UploadCloud,
  Check,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    homeworks,
    submissions,
    attendance,
    results,
    timetable,
    notices,
    setPortalTab,
    submitHomework,
  } = useSchool();

  // Selected homework for quick submission modal
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [mockFileName, setMockFileName] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Student specific calculations
  const studentAttendance = attendance.filter(a => a.studentId === currentUser.id);
  const attendanceStats = calculateAttendanceStats(studentAttendance);

  const studentResults = results.filter(r => r.studentId === currentUser.id);
  const resultSummary = calculateOverallResultSummary(studentResults);

  // Homework status
  const pendingHomeworks = homeworks.filter(h => {
    const isSubmitted = submissions.some(
      s => s.homeworkId === h.id && s.studentId === currentUser.id
    );
    return !isSubmitted;
  });

  // Today's schedule (Monday for demo)
  const todaySchedule = timetable.find(t => t.day === 'Monday')?.periods || [];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHwId) return;

    submitHomework({
      homeworkId: submittingHwId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      content: submissionText || 'Assignment answers submitted online.',
      fileName: mockFileName || 'student_assignment_doc.pdf',
      fileSize: '1.2 MB',
      status: 'submitted',
    });

    setSubmittingHwId(null);
    setSubmissionText('');
    setMockFileName('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
            <span>Student Portal</span>
            <span aria-hidden="true">·</span>
            <span>Academic Year 2026-27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Class {currentUser.classId}-{currentUser.section} · Roll #{currentUser.rollNumber} · Student ID: {currentUser.studentId}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setPortalTab('homework')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Pending Homework ({pendingHomeworks.length})
            </button>
            <button
              onClick={() => setPortalTab('ai_tutor')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Ask AI Academic Tutor
            </button>
          </div>
        </div>
      </div>

      {isSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Homework assignment submitted successfully! Your teacher has been notified.</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {attendanceStats.percentage}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {attendanceStats.present} present out of {attendanceStats.total} school days
          </div>
        </div>

        {/* Pending Homework */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Tasks</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {pendingHomeworks.length}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            {pendingHomeworks.length > 0 ? 'Submissions due this week' : 'All caught up!'}
          </div>
        </div>

        {/* Term GPA / Overall Grade */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Academic Grade</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {resultSummary.overallGrade} ({resultSummary.percentage}%)
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {resultSummary.subjectCount} evaluated subjects
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Today's Classes</span>
            <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {todaySchedule.length} Periods
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Next: {todaySchedule[0]?.subject || 'Class finished'}
          </div>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Timetable & Pending Homework */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Class Schedule</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monday · Class 10-A Timetable</p>
              </div>
              <button
                onClick={() => setPortalTab('timetable')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                Full Week <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {todaySchedule.map(period => (
                <div key={period.period} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center">
                      P{period.period}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{period.subject}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{period.teacher} · {period.room}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {period.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Homework */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Homework & Tasks</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assigned by your teachers</p>
              </div>
              <button
                onClick={() => setPortalTab('homework')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingHomeworks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">You're all caught up!</p>
                <p className="text-xs mt-1">No pending homework assignments.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingHomeworks.map(hw => (
                  <div key={hw.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{hw.subject}</div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{hw.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{hw.instructions}</p>
                      </div>
                      <button
                        onClick={() => setSubmittingHwId(hw.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap transition-colors"
                      >
                        Submit
                      </button>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Assigned by {hw.teacherName}</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">Due: {hw.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Announcements & Quick Services */}
        <div className="space-y-6">
          {/* Recent School Notices */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Latest Notices</h2>
              <button
                onClick={() => setPortalTab('notices')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                All Notices
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map(n => (
                <div key={n.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{n.category}</span>
                    <span>{n.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Services Box */}
          <div className="bg-slate-900 dark:bg-slate-900/90 text-slate-200 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Student Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setPortalTab('leaves')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  Apply for Student Leave
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('certificates')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  View Merit Certificates
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('library_resources')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Download Notes & Question Banks
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Submit Modal */}
      {submittingHwId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Homework Assignment
              </h3>
              <button
                onClick={() => setSubmittingHwId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Notes / Text Answer
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Explain your approach, solution, or notes for the teacher..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Assignment File (PDF / DOC / Image)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 block font-medium">
                    {mockFileName || 'Click to select completed file (Simulated Upload)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="hw-upload-input"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setMockFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="hw-upload-input"
                    className="mt-2 inline-block px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Browse Local File
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingHwId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
