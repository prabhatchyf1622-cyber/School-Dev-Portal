import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  calculateAttendanceStats,
  calculateOverallResultSummary,
} from '../../utils/academicCalculations';
import {
  Users,
  CheckCircle2,
  BookOpen,
  DollarSign,
  FileText,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Check,
  Calendar,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const {
    currentUser,
    selectedChildId,
    setSelectedChildId,
    allUsers,
    attendance,
    results,
    homeworks,
    submissions,
    fees,
    payFee,
    setPortalTab,
  } = useSchool();

  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptToast, setReceiptToast] = useState<string | null>(null);

  // All children of parent
  const myChildren = allUsers.filter(u => u.parentId === currentUser.id || currentUser.childrenIds?.includes(u.id));
  const activeChild = allUsers.find(u => u.id === selectedChildId) || myChildren[0] || allUsers[0];

  // Stats for active child
  const childAttendance = attendance.filter(a => a.studentId === activeChild.id);
  const attendanceStats = calculateAttendanceStats(childAttendance);

  const childResults = results.filter(r => r.studentId === activeChild.id);
  const resultSummary = calculateOverallResultSummary(childResults);

  const childFees = fees.filter(f => f.studentId === activeChild.id);
  const pendingFee = childFees.find(f => f.status === 'pending' || f.status === 'overdue');

  const pendingHomeworks = homeworks.filter(h => {
    if (h.classId !== activeChild.classId) return false;
    const isSubmitted = submissions.some(s => s.homeworkId === h.id && s.studentId === activeChild.id);
    return !isSubmitted;
  });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFeeId) return;

    const updated = payFee(payingFeeId, paymentMethod);
    setPayingFeeId(null);
    if (updated) {
      setReceiptToast(`Fee paid successfully! Receipt #${updated.invoiceNo} generated.`);
      setTimeout(() => setReceiptToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
              <span>Parent Portal</span>
              <span aria-hidden="true">·</span>
              <span>Family ID: FAM-2026-901</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Monitoring {myChildren.length} registered children at SchoolDev
            </p>
          </div>

          {/* Child Switcher Tabs */}
          {myChildren.length > 1 && (
            <div className="bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1.5 self-start md:self-center">
              {myChildren.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedChildId === child.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span>{child.name.split(' ')[0]} (Class {child.classId}-{child.section})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {receiptToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{receiptToast}</span>
          </div>
          <button
            onClick={() => setPortalTab('fees')}
            className="text-xs font-bold text-emerald-700 underline"
          >
            View Official Receipt
          </button>
        </div>
      )}

      {/* Child KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Child Attendance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Attendance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {attendanceStats.percentage}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {attendanceStats.present} days present ({attendanceStats.absent} absences)
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cumulative Grade</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {resultSummary.overallGrade} ({resultSummary.percentage}%)
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Class Rank #1 · Excellent</div>
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
            {pendingHomeworks.length > 0 ? 'Due for submission this week' : 'All homework submitted'}
          </div>
        </div>

        {/* Term Fees */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fee Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {pendingFee ? (
            <div>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                ₹{pendingFee.amount.toLocaleString()}
              </div>
              <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center justify-between">
                <span>Due: {pendingFee.dueDate}</span>
                <button
                  onClick={() => setPayingFeeId(pendingFee.id)}
                  className="underline font-bold text-blue-600 dark:text-blue-400"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                Paid in Full
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Term 2 cleared</div>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Child Academic Status & Homework Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Child Overview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeChild.avatar}
                  alt={activeChild.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeChild.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Grade {activeChild.classId}-{activeChild.section} · Roll #{activeChild.rollNumber} · Student ID: {activeChild.studentId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortalTab('exams')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Download Report Card
                </button>
                <button
                  onClick={() => setPortalTab('messages')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Contact Teacher
                </button>
              </div>
            </div>

            {/* Academic Results Breakdown */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Recent Term Assessment Grades
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {childResults.map(res => (
                  <div key={res.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{res.subject}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{res.remarks}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {res.marksObtained} / {res.totalMarks}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Grade {res.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Child's Homework Monitor */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Homework & Due Dates</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track your child’s weekly academic obligations</p>
              </div>
              <button
                onClick={() => setPortalTab('homework')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                Full Tracker <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingHomeworks.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                All homework for Class {activeChild.classId}-{activeChild.section} is currently submitted!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingHomeworks.map(hw => (
                  <div key={hw.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{hw.subject}</span>
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 font-mono">
                        Due: {hw.dueDate}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">{hw.title}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">{hw.instructions}</p>
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Teacher: {hw.teacherName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fee Ledger & Quick Actions */}
        <div className="space-y-6">
          {/* Fee Records Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Fee Invoices & Receipts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Academic Session 2026-27</p>

            <div className="space-y-3">
              {childFees.map(fee => (
                <div key={fee.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{fee.term}</span>
                    <span className={`font-semibold uppercase text-[10px] ${
                      fee.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {fee.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      ₹{fee.amount.toLocaleString()}
                    </span>
                    {fee.status === 'paid' ? (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Receipt: {fee.invoiceNo}
                      </span>
                    ) : (
                      <button
                        onClick={() => setPayingFeeId(fee.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs"
                      >
                        Pay Online
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Communication Action */}
          <div className="bg-slate-900 dark:bg-slate-900/90 text-slate-200 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Parent Services</h3>
            <p className="text-xs text-slate-400 mb-3">Direct link with school administration</p>
            <div className="space-y-2">
              <button
                onClick={() => setPortalTab('leaves')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Submit Child Leave Request</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('fees')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>View Full Fee Ledger & Breakdown</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setPortalTab('notices')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <span>School Circulars & Event Notices</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Online Fee Payment Modal Simulation */}
      {payingFeeId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">School Fee Online Payment</h3>
              <button onClick={() => setPayingFeeId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handlePay} className="mt-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400">Student: {activeChild.name} (Class {activeChild.classId}-{activeChild.section})</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Term: Term 2 (Oct 2026 - Mar 2027)</div>
                <div className="mt-3 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  ₹28,500
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Includes Tuition (₹18,000), Lab (₹3,500), Transport (₹4,000), Activity (₹3,000)
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Select Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Net Banking', 'Credit/Debit Card'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`p-2.5 text-xs rounded-lg border font-semibold transition-all ${
                        paymentMethod === mode
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayingFeeId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Confirm & Pay ₹28,500
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
