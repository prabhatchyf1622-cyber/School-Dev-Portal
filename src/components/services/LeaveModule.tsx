import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import { LeaveRequest } from '../../types';

export const LeaveModule: React.FC = () => {
  const {
    currentUser,
    leaves,
    applyLeave,
    updateLeaveStatus,
    selectedChild,
  } = useSchool();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const applicant = currentUser.role === 'parent' ? selectedChild || currentUser : currentUser;

    applyLeave({
      applicantId: applicant.id,
      applicantName: applicant.name,
      applicantRole: applicant.role === 'teacher' ? 'teacher' : 'student',
      applicantClass: applicant.classId ? `${applicant.classId}-${applicant.section}` : undefined,
      fromDate,
      toDate,
      reason: leaveReason,
    });

    setShowApplyModal(false);
    setLeaveReason('');
    showToast('Leave application submitted successfully for review!');
  };

  // Filter leaves
  const visibleLeaves = currentUser.role === 'admin'
    ? leaves
    : currentUser.role === 'teacher'
    ? leaves
    : leaves.filter(l => l.applicantId === currentUser.id || (currentUser.role === 'parent' && (l.applicantId === selectedChild?.id || l.applicantId === 'stu-1')));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Leave Applications & Sanctions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply for student sick or emergency leave, track approval workflows, and teacher reviews.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Leave Applications Registry</h2>
          <span className="text-xs font-mono text-slate-500">
            {visibleLeaves.length} record(s)
          </span>
        </div>

        {visibleLeaves.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No leave applications logged.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleLeaves.map(lev => (
              <div key={lev.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{lev.applicantName}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-blue-600 font-semibold">{lev.applicantClass || 'Faculty'}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-mono text-slate-500">Applied: {lev.appliedDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {lev.fromDate} to {lev.toDate}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{lev.reason}</p>

                  {lev.reviewerRemarks && (
                    <div className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-200/60">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Reviewer Note: {lev.reviewerRemarks}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold font-mono uppercase ${
                      lev.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : lev.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {lev.status}
                  </span>

                  {(currentUser.role === 'teacher' || currentUser.role === 'admin') && lev.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          updateLeaveStatus(lev.id, 'approved', 'Sanctioned by School Authority');
                          showToast(`Leave sanctioned for ${lev.applicantName}.`);
                        }}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1"
                        title="Approve Leave"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          updateLeaveStatus(lev.id, 'rejected', 'Disapproved due to attendance shortage');
                          showToast(`Leave rejected for ${lev.applicantName}.`);
                        }}
                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1"
                        title="Decline Leave"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Submit Leave Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="Detail the illness, family event, or reason for leave..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
