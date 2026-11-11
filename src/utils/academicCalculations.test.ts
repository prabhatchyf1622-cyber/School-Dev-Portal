import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAttendanceStats,
  calculateGradeFromPercentage,
  calculateOverallResultSummary,
  calculateFeeSummary,
  filterHomeworkList,
} from './academicCalculations';
import { AttendanceRecord, ExamResult, FeeRecord, Homework } from '../types';

test('calculateAttendanceStats calculates percentage correctly', () => {
  const records: AttendanceRecord[] = [
    { id: '1', studentId: 's1', date: '2026-11-01', status: 'present', classId: '10', section: 'A' },
    { id: '2', studentId: 's1', date: '2026-11-02', status: 'present', classId: '10', section: 'A' },
    { id: '3', studentId: 's1', date: '2026-11-03', status: 'absent', classId: '10', section: 'A' },
    { id: '4', studentId: 's1', date: '2026-11-04', status: 'late', classId: '10', section: 'A' },
  ];

  const stats = calculateAttendanceStats(records);
  assert.equal(stats.total, 4);
  assert.equal(stats.present, 2);
  assert.equal(stats.absent, 1);
  assert.equal(stats.late, 1);
  // (2 + 0.5 + 0) / 4 = 2.5 / 4 = 62.5% -> rounded to 63%
  assert.equal(stats.percentage, 63);
});

test('calculateGradeFromPercentage assigns accurate grades and points', () => {
  assert.equal(calculateGradeFromPercentage(95).grade, 'A+');
  assert.equal(calculateGradeFromPercentage(85).grade, 'A');
  assert.equal(calculateGradeFromPercentage(75).grade, 'B+');
  assert.equal(calculateGradeFromPercentage(65).grade, 'B');
  assert.equal(calculateGradeFromPercentage(52).grade, 'C');
  assert.equal(calculateGradeFromPercentage(41).grade, 'D');
  assert.equal(calculateGradeFromPercentage(30).grade, 'F');
});

test('calculateOverallResultSummary computes totals, pass state, and GPA grade', () => {
  const results: ExamResult[] = [
    { id: 'r1', examId: 'e1', examTitle: 'Midterm', studentId: 's1', studentName: 'Aarav', classId: '10', subject: 'Math', marksObtained: 92, totalMarks: 100, grade: 'A+', remarks: 'Great' },
    { id: 'r2', examId: 'e2', examTitle: 'Midterm', studentId: 's1', studentName: 'Aarav', classId: '10', subject: 'Physics', marksObtained: 88, totalMarks: 100, grade: 'A', remarks: 'Good' },
    { id: 'r3', examId: 'e3', examTitle: 'Midterm', studentId: 's1', studentName: 'Aarav', classId: '10', subject: 'English', marksObtained: 85, totalMarks: 100, grade: 'A', remarks: 'Good' },
  ];

  const summary = calculateOverallResultSummary(results);
  assert.equal(summary.totalMarks, 300);
  assert.equal(summary.marksObtained, 265);
  // 265 / 300 = 88.33% -> 88%
  assert.equal(summary.percentage, 88);
  assert.equal(summary.overallGrade, 'A');
  assert.equal(summary.passed, true);
  assert.equal(summary.subjectCount, 3);
});

test('calculateFeeSummary sums paid and pending amounts', () => {
  const fees: FeeRecord[] = [
    {
      id: 'f1',
      invoiceNo: 'INV-01',
      studentId: 's1',
      studentName: 'Aarav',
      classId: '10',
      term: 'Term 1',
      amount: 15000,
      dueDate: '2026-10-15',
      status: 'paid',
      breakdown: { tuitionFee: 10000, labFee: 2000, libraryFee: 1000, transportFee: 1500, activityFee: 500 }
    },
    {
      id: 'f2',
      invoiceNo: 'INV-02',
      studentId: 's1',
      studentName: 'Aarav',
      classId: '10',
      term: 'Term 2',
      amount: 15000,
      dueDate: '2026-12-15',
      status: 'pending',
      breakdown: { tuitionFee: 10000, labFee: 2000, libraryFee: 1000, transportFee: 1500, activityFee: 500 }
    }
  ];

  const summary = calculateFeeSummary(fees);
  assert.equal(summary.totalAmount, 30000);
  assert.equal(summary.totalPaid, 15000);
  assert.equal(summary.totalPending, 15000);
  assert.equal(summary.pendingCount, 1);
  assert.equal(summary.overdueCount, 0);
});

test('filterHomeworkList filters by query, class, and subject', () => {
  const list: Homework[] = [
    { id: 'h1', title: 'Calculus Exercises', subject: 'Mathematics', classId: '10', section: 'A', assignedBy: 't1', teacherName: 'Priya Verma', dueDate: '2026-11-15', createdDate: '2026-11-09', instructions: 'Solve ex 4.1', maxScore: 20 },
    { id: 'h2', title: 'Optics Lab Report', subject: 'Physics', classId: '10', section: 'A', assignedBy: 't2', teacherName: 'Dr. Ramesh Kumar', dueDate: '2026-11-18', createdDate: '2026-11-09', instructions: 'Complete ray diagrams', maxScore: 25 },
    { id: 'h3', title: 'History Essay', subject: 'Social Studies', classId: '9', section: 'B', assignedBy: 't3', teacherName: 'Sunita Rao', dueDate: '2026-11-20', createdDate: '2026-11-08', instructions: 'Write 500 words', maxScore: 15 },
  ];

  const filtered = filterHomeworkList(list, 'optics', '10', 'Physics');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'h2');

  const filteredClass = filterHomeworkList(list, '', '10', 'all');
  assert.equal(filteredClass.length, 2);
});
