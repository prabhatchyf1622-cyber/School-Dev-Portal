import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  CheckCircle2,
  BookOpen,
  FileCheck2,
  Clock,
  Plus,
  ArrowRight,
  Check,
  X,
  FileText,
  UploadCloud,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    homeworks,
    submissions,
    leaves,
    updateLeaveStatus,
    setPortalTab,
    createHomework,
    gradeSubmission,
    allUsers,
  } = useSchool();

  // Create homework modal
  const [showCreateHw, setShowCreateHw] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState(currentUser.assignedSubjects?.[0] || 'Mathematics');
  const [hwClass, setHwClass] = useState('10');
  const [hwDueDate, setHwDueDate] = useState('2026-11-20');
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwScore, setHwScore] = useState(25);

  // Grade modal
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(20);
  const [gradeLetter, setGradeLetter] = useState<'A+' | 'A' | 'B' | 'C'>('A');
  const [gradeFeedback, setGradeFeedback] = useState('Well presented solutions.');

  // Toast feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Pending reviews
  const pendingReviews = submissions.filter(s => s.status === 'submitted');
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    createHomework({
      title: hwTitle,
      subject: hwSubject,
      classId: hwClass,
      section: 'A',
      assignedBy: currentUser.id,
      teacherName: currentUser.name,
      dueDate: hwDueDate,
      instructions: hwInstructions,
      maxScore: Number(hwScore),
    });

    setShowCreateHw(false);
    setHwTitle('');
    setHwInstructions('');
    showToast(`Homework "${hwTitle}" assigned to Class ${hwClass}-A!`);
  };

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;

    gradeSubmission(gradingSubId, Number(gradeScore), gradeLetter, gradeFeedback);
    setGradingSubId(null);
    showToast('Student homework evaluated and grade updated.');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              <span>Faculty Dashboard</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.teacherId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentUser.name}
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              {currentUser.designation} · Classes: {currentUser.assignedClasses?.join(', ')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowCreateHw(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Assign Homework
            </button>
            <button
              onClick={() => setPortalTab('attendance')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Stats KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Submissions to Grade</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {pendingReviews.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Awaiting your feedback & score</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Leave Requests</span>
            <FileCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {pendingLeaves.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending approval from Class 10-A</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Homeworks</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {homeworks.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across Math & Physics streams</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Assigned Students</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {allUsers.filter(u => u.role === 'student').length * 28}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled in 3 sections</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Submissions awaiting grading */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Submissions for Review</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submitted work requiring evaluation</p>
              </div>
              <button
                onClick={() => setPortalTab('homework')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                All Homeworks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">All submissions graded!</p>
                <p className="text-xs mt-1">No pending student assignments at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingReviews.map(sub => {
                  const hw = homeworks.find(h => h.id === sub.homeworkId);
                  return (
                    <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.studentName}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{hw?.subject || 'Assignment'}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{hw?.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{sub.content}</p>
                        {sub.fileName && (
                          <div className="mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span>📄 {sub.fileName}</span>
                            <span>({sub.fileSize})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            setGradingSubId(sub.id);
                            setGradeScore(hw?.maxScore ? Math.floor(hw.maxScore * 0.9) : 22);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Grade Work
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Student Leaves */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Leave Requests to Review</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Student applications awaiting class teacher sanction</p>

            {pendingLeaves.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                No leave requests pending.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map(lev => (
                  <div key={lev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{lev.applicantName}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{lev.applicantClass}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{lev.fromDate} to {lev.toDate}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{lev.reason}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          updateLeaveStatus(lev.id, 'approved', 'Sanctioned by Class Teacher');
                          showToast(`Leave approved for ${lev.applicantName}.`);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          updateLeaveStatus(lev.id, 'rejected', 'Please meet in person with parent note.');
                          showToast(`Leave rejected for ${lev.applicantName}.`);
                        }}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors border border-rose-200/50 dark:border-rose-900/50"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Schedule & Quick Resources */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Today's Teaching Schedule</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Monday Timetable</p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Period 1: Mathematics</span>
                  <span className="font-mono text-blue-700 dark:text-blue-300">08:30 - 09:15</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Class 10-A · Room 301</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Period 2: Physics Lab</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">09:15 - 10:00</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Class 10-A · Physics Lab</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Period 4: Physics Theory</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">11:00 - 11:45</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Class 9-B · Room 202</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-900/90 text-slate-200 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Teacher Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setPortalTab('attendance')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Take Class Attendance</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('exams')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Record Examination Marks</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('library_resources')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Upload Class Notes / Question Paper</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('notices')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Publish Class Notice</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Homework Modal */}
      {showCreateHw && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Homework Assignment</h3>
              <button onClick={() => setShowCreateHw(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleCreateHw} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={e => setHwTitle(e.target.value)}
                  placeholder="e.g. Electromagnetic Induction Numerical Problems"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={hwSubject}
                    onChange={e => setHwSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class & Section</label>
                  <select
                    value={hwClass}
                    onChange={e => setHwClass(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="10">Class 10-A</option>
                    <option value="9">Class 9-B</option>
                    <option value="11">Class 11-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={hwDueDate}
                    onChange={e => setHwDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Maximum Score</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={hwScore}
                    onChange={e => setHwScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions & Guidelines</label>
                <textarea
                  rows={3}
                  required
                  value={hwInstructions}
                  onChange={e => setHwInstructions(e.target.value)}
                  placeholder="Detail the problems, reference chapters, and submission criteria..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateHw(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Assign to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradingSubId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Evaluate Student Submission</h3>
              <button onClick={() => setGradingSubId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleGrade} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Score Awarded</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={gradeScore}
                    onChange={e => setGradeScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Grade Letter</label>
                  <select
                    value={gradeLetter}
                    onChange={e => setGradeLetter(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="A+">A+ (Outstanding)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B">B (Good)</option>
                    <option value="C">C (Satisfactory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teacher Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for student development..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
