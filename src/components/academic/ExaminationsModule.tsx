import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { calculateOverallResultSummary } from '../../utils/academicCalculations';
import {
  FileText,
  Calendar,
  Clock,
  Printer,
  Award,
  Plus,
  CheckCircle2,
  Check,
  Building,
  GraduationCap,
} from 'lucide-react';

export const ExaminationsModule: React.FC = () => {
  const {
    currentUser,
    exams,
    results,
    enterExamResult,
    selectedChild,
    allUsers,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'schedule' | 'results' | 'report_card'>('schedule');
  const [showEnterMarks, setShowEnterMarks] = useState(false);

  // Enter marks form state
  const [marksExamId, setMarksExamId] = useState(exams[0]?.id || 'ex-1');
  const [marksStudentId, setMarksStudentId] = useState('stu-1');
  const [marksScore, setMarksScore] = useState(88);
  const [marksGrade, setMarksGrade] = useState('A');
  const [marksRemarks, setMarksRemarks] = useState('Great analytical conceptual clarity.');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Determine active student
  const activeStudent = currentUser.role === 'student' ? currentUser : selectedChild || allUsers[0];
  const studentResults = results.filter(r => r.studentId === activeStudent.id);
  const resultSummary = calculateOverallResultSummary(studentResults);

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const examObj = exams.find(e => e.id === marksExamId);
    const stuObj = allUsers.find(u => u.id === marksStudentId);

    if (!examObj || !stuObj) return;

    enterExamResult({
      examId: examObj.id,
      examTitle: examObj.title,
      studentId: stuObj.id,
      studentName: stuObj.name,
      classId: stuObj.classId || '10',
      subject: examObj.subject,
      marksObtained: Number(marksScore),
      totalMarks: examObj.totalMarks,
      grade: marksGrade,
      remarks: marksRemarks,
    });

    setShowEnterMarks(false);
    showToast(`Exam marks for ${stuObj.name} recorded!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Examinations & Academic Grading
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Exam schedules, hall tickets, online result declarations, and official report cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
            <button
              onClick={() => setShowEnterMarks(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Enter Student Marks
            </button>
          )}

          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Date Sheet
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'results' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Assessment Grades
            </button>
            <button
              onClick={() => setActiveTab('report_card')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'report_card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Report Card
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tab 1: Exam Date Sheet */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Midterm Examination Date Sheet 2026
              </h2>
              <p className="text-xs text-slate-500">
                Applicable for Grade 10-A · Morning Shift (09:00 AM - 12:00 PM)
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Admit Card Validated
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {exams.map(exam => (
              <div key={exam.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-mono font-bold shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {exam.subject}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{exam.title}</h3>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {exam.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {exam.startTime} - {exam.endTime}
                      </span>
                      <span>Seating: {exam.roomNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right self-end sm:self-center shrink-0">
                  <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                    Max: {exam.totalMarks} Marks
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Passing: {exam.passingMarks} Marks (35%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Assessment Results */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Term Examination Performance · {activeStudent.name}
              </h2>
              <p className="text-xs text-slate-500">
                Class {activeStudent.classId}-{activeStudent.section} · Roll #{activeStudent.rollNumber}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall Score</span>
                <span className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
                  {resultSummary.percentage}% ({resultSummary.overallGrade})
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-right">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-right">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3">Teacher Evaluator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900">{res.subject}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right tabular-nums">
                      {res.marksObtained}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-right tabular-nums">
                      {res.totalMarks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-emerald-700 bg-emerald-50">
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 italic">{res.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official Report Card (Printable) */}
      {activeTab === 'report_card' && (
        <div className="space-y-4">
          <div className="no-print flex justify-end">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF Report Card
            </button>
          </div>

          {/* Printable Report Card Sheet */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 max-w-3xl mx-auto shadow-sm">
            {/* School Header */}
            <div className="text-center pb-6 border-b-2 border-slate-900">
              <div className="flex items-center justify-center gap-2 mb-1">
                <GraduationCap className="w-8 h-8 text-slate-900" />
                <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
                  SchoolDev International Academy
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium tracking-wide">
                Affiliated to CBSE, New Delhi · School Code: 20491 · Affiliation # 830114
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Institutional Area, Knowledge Park, New Delhi - 110001
              </p>
              <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                Cumulative Academic Performance Report 2026-27
              </div>
            </div>

            {/* Student Particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm">{activeStudent.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Student ID:</span>
                <span className="font-mono font-bold text-slate-900">{activeStudent.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Class & Section:</span>
                <span className="font-bold text-slate-900">
                  Grade {activeStudent.classId} - {activeStudent.section}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Roll Number:</span>
                <span className="font-mono font-bold text-slate-900">#{activeStudent.rollNumber}</span>
              </div>
            </div>

            {/* Marks Breakdown Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold text-slate-900 uppercase">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-right">Max Marks</th>
                    <th className="py-2.5 px-3 text-right">Marks Scored</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Performance Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {studentResults.map(r => (
                    <tr key={r.id}>
                      <td className="py-3 px-3 font-bold text-slate-900">{r.subject}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">{r.totalMarks}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{r.marksObtained}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{r.grade}</td>
                      <td className="py-3 px-3 text-slate-700">{r.remarks}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold text-slate-900">
                    <td className="py-3 px-3 uppercase">Total Aggregate</td>
                    <td className="py-3 px-3 text-right font-mono">{resultSummary.totalMarks}</td>
                    <td className="py-3 px-3 text-right font-mono">{resultSummary.marksObtained}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-700">{resultSummary.overallGrade}</td>
                    <td className="py-3 px-3 text-emerald-800 font-mono">
                      Percentage: {resultSummary.percentage}% (PASSED WITH DISTINCTION)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attendance & Conduct */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Attendance Rate:</span>
                <span className="font-bold text-slate-900 font-mono">92% (Exemplary)</span>
              </div>
              <div>
                <span className="text-slate-500 block">General Conduct:</span>
                <span className="font-bold text-slate-900">Disciplined & Participative</span>
              </div>
              <div>
                <span className="text-slate-500 block">Co-Curricular Rank:</span>
                <span className="font-bold text-slate-900">Gold Medalist (Badminton)</span>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="mt-12 pt-8 border-t border-slate-300 flex items-end justify-between text-center text-xs">
              <div>
                <div className="font-serif italic text-slate-800 mb-1">Priya Verma</div>
                <div className="w-36 border-t border-slate-800 pt-1 font-semibold text-slate-900">
                  Class Teacher
                </div>
              </div>

              <div>
                <div className="w-20 h-20 rounded-full border-2 border-blue-900/30 mx-auto flex items-center justify-center text-[10px] font-bold text-blue-900 uppercase tracking-tighter">
                  School Seal
                </div>
              </div>

              <div>
                <div className="font-serif italic text-slate-800 mb-1">Dr. Sunita Kulkarni</div>
                <div className="w-36 border-t border-slate-800 pt-1 font-semibold text-slate-900">
                  Principal & CAO
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enter Marks Modal */}
      {showEnterMarks && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Student Examination Marks</h3>
              <button onClick={() => setShowEnterMarks(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveMarks} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Examination</label>
                <select
                  value={marksExamId}
                  onChange={e => setMarksExamId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                >
                  {exams.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({ex.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={marksStudentId}
                  onChange={e => setMarksStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                >
                  {allUsers.filter(u => u.role === 'student').map(stu => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} (Class {stu.classId}-{stu.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={marksScore}
                    onChange={e => setMarksScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={marksGrade}
                    onChange={e => setMarksGrade(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="A+">A+ (90-100)</option>
                    <option value="A">A (80-89)</option>
                    <option value="B+">B+ (70-79)</option>
                    <option value="B">B (60-69)</option>
                    <option value="C">C (50-59)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  required
                  value={marksRemarks}
                  onChange={e => setMarksRemarks(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnterMarks(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Marks Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
