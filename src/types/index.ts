export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  isEmailVerified?: boolean;
  isApproved?: boolean;
  authProvider?: 'local' | 'google';
  // Student specific
  studentId?: string;
  classId?: string;
  section?: string;
  rollNumber?: string;
  parentContact?: string;
  parentId?: string;
  // Teacher specific
  teacherId?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  designation?: string;
  // Parent specific
  childrenIds?: string[];
  linkedStudentId?: string;
  // Status
  isActive: boolean;
  joinedDate: string;
}

export type AuthView =
  | 'signin'
  | 'signup'
  | 'verify'
  | 'forgot'
  | 'reset'
  | 'pending_approval'
  | 'access_denied'
  | 'session_expired';

export interface CaptchaChallenge {
  challengeId: string;
  prompt: string;
  expiresAt: number;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  classId: string;
  section: string;
  assignedBy: string;
  teacherName: string;
  dueDate: string;
  createdDate: string;
  instructions: string;
  maxScore: number;
  totalSubmissions?: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  status: 'submitted' | 'graded' | 'late';
  grade?: string;
  score?: number;
  feedback?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'excused';
  classId: string;
  section: string;
  remarks?: string;
}

export interface Examination {
  id: string;
  title: string;
  term: 'Quarterly' | 'Midterm' | 'Pre-Board' | 'Annual';
  classId: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  roomNumber: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

export interface TimetablePeriod {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface TimetableDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  classId: string;
  fileType: 'pdf' | 'doc' | 'notes' | 'syllabus' | 'paper';
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  teacherName: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'general' | 'academic' | 'exam' | 'holiday' | 'urgent' | 'event' | 'sports';
  date: string;
  targetRole: 'all' | 'student' | 'teacher' | 'parent';
  targetClass?: string;
  content: string;
  author: string;
  priority: 'normal' | 'high' | 'critical';
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'sports' | 'cultural' | 'annual' | 'academic' | 'workshop';
  date: string;
  time: string;
  location: string;
  description: string;
  registeredUsers: string[];
  maxSeats: number;
  coverImage?: string;
}

export interface FeeBreakdown {
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  transportFee: number;
  activityFee: number;
}

export interface FeeRecord {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  classId: string;
  term: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  breakdown: FeeBreakdown;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'student' | 'teacher';
  applicantClass?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reviewerRemarks?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  studentId: string;
  studentName: string;
  title: string;
  category: 'merit' | 'sports' | 'attendance' | 'leadership';
  issueDate: string;
  issuedBy: string;
  description: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  currentStop: string;
  stops: string[];
  timing: string;
  totalStudents: number;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface AdmissionInquiry {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  appliedGrade: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'enrolled' | 'closed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'homework' | 'fee' | 'attendance' | 'notice' | 'exam' | 'message';
  read: boolean;
  linkTab?: string;
}
