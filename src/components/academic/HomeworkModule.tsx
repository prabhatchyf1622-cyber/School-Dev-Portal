import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { filterHomeworkList } from '../../utils/academicCalculations';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  User,
  Check,
  Trash2,
} from 'lucide-react';

export const HomeworkModule: React.FC = () => {
  const {
    currentUser,
    homeworks,
    submissions,
    createHomework,
    deleteHomework,
    submitHomework,
    gradeSubmission,
    selectedChild,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Submit Modal
  const [selectedHwToSubmit, setSelectedHwToSubmit] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [mockFileName, setMockFileName] = useState('');

  // Teacher Review Modal
  const [viewingHwSubmissionsId, setViewingHwSubmissionsId] = useState<string | null>(null);
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [awardedScore, setAwardedScore] = useState(25);
  const [awardedGrade, setAwardedGrade] = useState('A');
  const [awardedFeedback, setAwardedFeedback] = useState('Great analytical work.');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newClass, setNewClass] = useState('10');
  const [newDueDate, setNewDueDate] = useState('2026-11-22');
  const [newInstructions, setNewInstructions] = useState('');
  const [newMaxScore, setNewMaxScore] = useState(30);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredHomeworks = filterHomeworkList(homeworks, searchQuery, classFilter, subjectFilter);

  // Active student reference (either current user if student, or selectedChild if parent)
  const targetStudentId = currentUser.role === 'student' ? currentUser.id : selectedChild?.id || 'stu-1';

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToSubmit) return;

    submitHomework({
      homeworkId: selectedHwToSubmit,
      studentId: currentUser.id,
      studentName: currentUser.name,
      content: submissionNotes || 'Completed and scanned homework file.',
      fileName: mockFileName || 'homework_solution_scan.pdf',
      fileSize: '1.5 MB',
      status: 'submitted',
    });

    setSelectedHwToSubmit(null);
    setSubmissionNotes('');
    setMockFileName('');
    showToast('Homework successfully submitted for teacher evaluation!');
  };

  const handleCreateNewHw = (e: React.FormEvent) => {
    e.preventDefault();
    createHomework({
      title: newTitle,
      subject: newSubject,
      classId: newClass,
      section: 'A',
      assignedBy: currentUser.id,
      teacherName: currentUser.name,
      dueDate: newDueDate,
      instructions: newInstructions,
      maxScore: Number(newMaxScore),
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewInstructions('');
    showToast(`Homework "${newTitle}" created successfully!`);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;

    gradeSubmission(gradingSubId, Number(awardedScore), awardedGrade, awardedFeedback);
    setGradingSubId(null);
    showToast('Student grade and evaluation saved.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Homework & Tasks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Subject-wise assignments, submission records, and teacher evaluations.
          </p>
        </div>

        {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, subject, teacher..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Class:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-300"
            >
              <option value="all">All Classes</option>
              <option value="10">Class 10</option>
              <option value="9">Class 9</option>
              <option value="7">Class 7</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-300"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHomeworks.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No homework found matching your filters</p>
          </div>
        ) : (
          filteredHomeworks.map(hw => {
            const studentSub = submissions.find(
              s => s.homeworkId === hw.id && s.studentId === targetStudentId
            );
            const isGraded = studentSub?.status === 'graded';
            const isSubmitted = !!studentSub;

            return (
              <div
                key={hw.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {hw.subject} · Class {hw.classId}-{hw.section}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      Due: {hw.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{hw.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {hw.instructions}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    <span>Teacher: {hw.teacherName}</span>
                    <span className="mx-1.5">·</span>
                    <span className="font-mono">Max: {hw.maxScore} pts</span>
                  </div>

                  {/* Actions depending on Role */}
                  <div className="flex items-center gap-2">
                    {currentUser.role === 'student' && (
                      <>
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Grade: {studentSub?.grade} ({studentSub?.score}/{hw.maxScore})
                          </span>
                        ) : isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-semibold">
                            <Check className="w-3.5 h-3.5" />
                            Submitted for Review
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedHwToSubmit(hw.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Submit Assignment
                          </button>
                        )}
                      </>
                    )}

                    {currentUser.role === 'parent' && (
                      <span className={`px-2.5 py-1 rounded font-semibold ${
                        isGraded
                          ? 'bg-emerald-50 text-emerald-700'
                          : isSubmitted
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {isGraded
                          ? `Evaluated: ${studentSub?.score}/${hw.maxScore} (${studentSub?.grade})`
                          : isSubmitted
                          ? 'Submitted'
                          : 'Pending Submission'}
                      </span>
                    )}

                    {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingHwSubmissionsId(hw.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors"
                        >
                          Submissions ({submissions.filter(s => s.homeworkId === hw.id).length})
                        </button>
                        <button
                          onClick={() => deleteHomework(hw.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Homework"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Student Submit Modal */}
      {selectedHwToSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Homework Solution</h3>
              <button onClick={() => setSelectedHwToSubmit(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleStudentSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Answer Text or Descriptive Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  placeholder="Provide your solution summary, references, or written steps..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Scanned Assignment (PDF / Image)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    {mockFileName || 'Click to attach your scanned PDF solution'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="hw-file-attach"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setMockFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="hw-file-attach"
                    className="mt-2 inline-block px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                  >
                    Select File
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedHwToSubmit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher View Submissions Modal */}
      {viewingHwSubmissionsId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Class Submissions for Review
              </h3>
              <button onClick={() => setViewingHwSubmissionsId(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {submissions.filter(s => s.homeworkId === viewingHwSubmissionsId).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No submissions yet for this homework.
                </div>
              ) : (
                submissions
                  .filter(s => s.homeworkId === viewingHwSubmissionsId)
                  .map(sub => (
                    <div key={sub.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 font-mono">{sub.submittedAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{sub.content}</p>
                        {sub.fileName && (
                          <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                            📄 {sub.fileName} ({sub.fileSize})
                          </div>
                        )}
                        {sub.status === 'graded' && (
                          <div className="text-xs text-emerald-700 mt-1 font-semibold">
                            Evaluated: {sub.score} pts (Grade {sub.grade}) · Feedback: {sub.feedback}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setGradingSubId(sub.id);
                          setAwardedScore(sub.score || 25);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0"
                      >
                        {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingHwSubmissionsId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradingSubId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Enter Grade & Feedback</h3>
              <button onClick={() => setGradingSubId(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={awardedScore}
                    onChange={e => setAwardedScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={awardedGrade}
                    onChange={e => setAwardedGrade(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="A+">A+ (Outstanding)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B">B (Good)</option>
                    <option value="C">C (Pass)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows={3}
                  required
                  value={awardedFeedback}
                  onChange={e => setAwardedFeedback(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Homework Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Homework Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateNewHw} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Surface Chemistry & Colloidal State"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={newClass}
                    onChange={e => setNewClass(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="10">Class 10-A</option>
                    <option value="9">Class 9-B</option>
                    <option value="7">Class 7-B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newMaxScore}
                    onChange={e => setNewMaxScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={newInstructions}
                  onChange={e => setNewInstructions(e.target.value)}
                  placeholder="Problem numbers, reference textbooks, formatting expectations..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
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
    </div>
  );
};
