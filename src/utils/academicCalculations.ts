import { AttendanceRecord, ExamResult, FeeRecord, Homework } from '../types';

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export function calculateAttendanceStats(records: AttendanceRecord[]): AttendanceStats {
  if (!records || records.length === 0) {
    return { total: 0, present: 0, absent: 0, late: 0, excused: 0, percentage: 0 };
  }

  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const excused = records.filter(r => r.status === 'excused').length;
  const total = records.length;

  // late counts as present for percentage
  const effectivePresent = present + late * 0.5 + excused;
  const percentage = Math.round((effectivePresent / total) * 100);

  return {
    total,
    present,
    absent,
    late,
    excused,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

export interface GradeInfo {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  point: number;
  remarks: string;
}

export function calculateGradeFromPercentage(percentage: number): GradeInfo {
  if (percentage >= 90) return { grade: 'A+', point: 4.0, remarks: 'Outstanding' };
  if (percentage >= 80) return { grade: 'A', point: 3.7, remarks: 'Excellent' };
  if (percentage >= 70) return { grade: 'B+', point: 3.3, remarks: 'Very Good' };
  if (percentage >= 60) return { grade: 'B', point: 3.0, remarks: 'Good' };
  if (percentage >= 50) return { grade: 'C', point: 2.0, remarks: 'Average' };
  if (percentage >= 40) return { grade: 'D', point: 1.0, remarks: 'Pass' };
  return { grade: 'F', point: 0.0, remarks: 'Needs Improvement' };
}

export interface OverallResultSummary {
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  overallGrade: string;
  passed: boolean;
  subjectCount: number;
}

export function calculateOverallResultSummary(results: ExamResult[]): OverallResultSummary {
  if (!results || results.length === 0) {
    return {
      totalMarks: 0,
      marksObtained: 0,
      percentage: 0,
      overallGrade: 'N/A',
      passed: false,
      subjectCount: 0,
    };
  }

  const totalMarks = results.reduce((sum, r) => sum + r.totalMarks, 0);
  const marksObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
  const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
  const { grade } = calculateGradeFromPercentage(percentage);
  const allPassed = results.every(r => (r.marksObtained / r.totalMarks) >= 0.35);

  return {
    totalMarks,
    marksObtained,
    percentage,
    overallGrade: grade,
    passed: allPassed && percentage >= 40,
    subjectCount: results.length,
  };
}

export interface FeeSummary {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  pendingCount: number;
  overdueCount: number;
}

export function calculateFeeSummary(records: FeeRecord[]): FeeSummary {
  if (!records || records.length === 0) {
    return { totalAmount: 0, totalPaid: 0, totalPending: 0, pendingCount: 0, overdueCount: 0 };
  }

  let totalAmount = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  for (const record of records) {
    totalAmount += record.amount;
    if (record.status === 'paid') {
      totalPaid += record.amount;
    } else {
      totalPending += record.amount;
      if (record.status === 'overdue') {
        overdueCount++;
      } else {
        pendingCount++;
      }
    }
  }

  return {
    totalAmount,
    totalPaid,
    totalPending,
    pendingCount,
    overdueCount,
  };
}

export function filterHomeworkList(
  list: Homework[],
  searchQuery: string,
  classFilter: string,
  subjectFilter: string
): Homework[] {
  return list.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = !classFilter || classFilter === 'all' || item.classId === classFilter;
    const matchesSubject = !subjectFilter || subjectFilter === 'all' || item.subject === subjectFilter;

    return matchesSearch && matchesClass && matchesSubject;
  });
}
