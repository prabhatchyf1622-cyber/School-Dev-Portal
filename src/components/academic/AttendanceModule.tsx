import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { calculateAttendanceStats } from '../../utils/academicCalculations';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  UserCheck,
  Check,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { AttendanceRecord } from '../../types';

export const AttendanceModule: React.FC = () => {
  const {
    currentUser,
    allUsers,
    attendance,
    markAttendance,
    bulkMarkAttendance,
    selectedChild,
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // For teacher attendance sheet state
  const classStudents = allUsers.filter(u => u.role === 'student' && u.classId === selectedClass);

  // Local draft state for marking
  const [rosterDraft, setRosterDraft] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    classStudents.forEach(stu => {
      const existing = attendance.find(a => a.studentId === stu.id && a.date === selectedDate);
      initial[stu.id] = (existing?.status as any) || 'present';
    });
    return initial;
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const next: Record<string, 'present' | 'absent' | 'late'> = {};
    classStudents.forEach(stu => {
      next[stu.id] = status;
    });
    setRosterDraft(next);
  };

  const handleSaveAttendance = () => {
    const recordsToSave: Omit<AttendanceRecord, 'id'>[] = classStudents.map(stu => ({
      studentId: stu.id,
      studentName: stu.name,
      date: selectedDate,
      status: rosterDraft[stu.id] || 'present',
      classId: stu.classId || selectedClass,
      section: stu.section || 'A',
    }));

    bulkMarkAttendance(recordsToSave);
    showToast(`Attendance for Class ${selectedClass}-A successfully recorded for ${selectedDate}!`);
  };

  // Student or Parent view records
  const targetStudent = currentUser.role === 'student' ? currentUser : selectedChild || classStudents[0] || allUsers[0];
  const targetAttendance = attendance.filter(a => a.studentId === targetStudent.id);
  const stats = calculateAttendanceStats(targetAttendance);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily attendance monitoring, monthly logs, and official records.
          </p>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target Threshold: 75% CBSE Norm</span>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Teacher or Admin: Interactive Attendance Marking Register */}
      {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Take Class Attendance</h2>
              <p className="text-xs text-slate-500">Mark daily attendance for enrolled class students</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-600 font-medium">Class:</span>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="p-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="10">Class 10-A</option>
                  <option value="7">Class 7-B</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-600 font-medium">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="p-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <button
                onClick={() => handleMarkAll('present')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Mark All Present
              </button>

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Save Attendance Register
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3 text-center">Status Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map(stu => {
                  const currentStatus = rosterDraft[stu.id] || 'present';
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {stu.rollNumber || '01'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={stu.avatar}
                            alt={stu.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900">{stu.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {stu.studentId}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setRosterDraft(prev => ({ ...prev, [stu.id]: 'present' }))
                            }
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRosterDraft(prev => ({ ...prev, [stu.id]: 'late' }))
                            }
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRosterDraft(prev => ({ ...prev, [stu.id]: 'absent' }))
                            }
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student / Parent Attendance View */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Attendance Log for {targetStudent.name}
          </h2>
          <p className="text-xs text-slate-500">
            Class {targetStudent.classId}-{targetStudent.section} · Student ID: {targetStudent.studentId}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Cumulative Rate
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {stats.percentage}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Status: Excellent
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Days Present
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
              {stats.present}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Full day sessions</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Days Absent
            </span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
              {stats.absent}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Approved medical/leave</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Late Arrivals
            </span>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
              {stats.late}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Traffic / Transit delays</div>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Past 15 Days Attendance History
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {targetAttendance.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">No records available.</div>
            ) : (
              targetAttendance.map(rec => (
                <div key={rec.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-mono font-bold text-slate-900">{rec.date}</div>
                      {rec.remarks && <div className="text-[11px] text-slate-500">{rec.remarks}</div>}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold font-mono uppercase ${
                      rec.status === 'present'
                        ? 'bg-emerald-50 text-emerald-700'
                        : rec.status === 'late'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
