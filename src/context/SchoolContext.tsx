import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Homework,
  HomeworkSubmission,
  AttendanceRecord,
  Examination,
  ExamResult,
  TimetableDay,
  StudyMaterial,
  Notice,
  SchoolEvent,
  FeeRecord,
  LeaveRequest,
  TransportRoute,
  LibraryBook,
  InternalMessage,
  AdmissionInquiry,
  NotificationItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HOMEWORKS,
  INITIAL_SUBMISSIONS,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_TIMETABLE,
  INITIAL_STUDY_MATERIALS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_FEES,
  INITIAL_LEAVES,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_BOOKS,
  INITIAL_MESSAGES,
  INITIAL_ADMISSIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface SchoolContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRolePersona: (role: UserRole, userId?: string) => void;
  allUsers: User[];
  registerUser: (newUser: Omit<User, 'id' | 'joinedDate'>) => void;
  toggleUserStatus: (userId: string) => void;

  // Parent child selector
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  selectedChild: User | undefined;

  // View state
  isPublicSite: boolean;
  setIsPublicSite: (isPublic: boolean) => void;
  portalTab: string;
  setPortalTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Academic Modules
  homeworks: Homework[];
  createHomework: (hw: Omit<Homework, 'id' | 'createdDate' | 'totalSubmissions'>) => void;
  deleteHomework: (id: string) => void;
  submissions: HomeworkSubmission[];
  submitHomework: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => void;
  gradeSubmission: (subId: string, score: number, grade: string, feedback: string) => void;

  attendance: AttendanceRecord[];
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  bulkMarkAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  exams: Examination[];
  results: ExamResult[];
  enterExamResult: (result: Omit<ExamResult, 'id'>) => void;
  timetable: TimetableDay[];

  studyMaterials: StudyMaterial[];
  uploadStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>) => void;
  incrementDownload: (id: string) => void;

  notices: Notice[];
  publishNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;

  events: SchoolEvent[];
  registerForEvent: (eventId: string, userId: string) => void;

  fees: FeeRecord[];
  payFee: (feeId: string, paymentMethod: string) => FeeRecord | null;

  leaves: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected', remarks?: string) => void;

  transportRoutes: TransportRoute[];
  books: LibraryBook[];
  borrowBook: (bookId: string) => boolean;
  returnBook: (bookId: string) => void;

  messages: InternalMessage[];
  sendMessage: (msg: Omit<InternalMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;

  admissionInquiries: AdmissionInquiry[];
  submitAdmissionInquiry: (inquiry: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => void;
  updateInquiryStatus: (inquiryId: string, status: AdmissionInquiry['status']) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
}

import { useAuth } from './AuthContext';

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();

  // Load initial states or localStorage
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`schooldev_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [allUsers, setAllUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (authUser) return authUser;
    const saved = loadStored<User | null>('currentUser', null);
    if (saved && allUsers.some(u => u.id === saved.id)) return saved;
    return allUsers.find(u => u.role === 'student') || allUsers[0];
  });

  // Keep currentUser in sync when authenticated user changes
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      setAllUsers(prev => {
        const index = prev.findIndex(u => u.id === authUser.id || u.email === authUser.email);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...authUser };
          return updated;
        }
        return [authUser, ...prev];
      });
    }
  }, [authUser]);

  const [selectedChildId, setSelectedChildId] = useState<string>('stu-1');
  const [isPublicSite, setIsPublicSite] = useState<boolean>(false);
  const [portalTab, setPortalTabRaw] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const setPortalTab = (tab: string) => {
    setPortalTabRaw(tab);
    setIsMobileMenuOpen(false);
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('schooldev_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('schooldev_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const [homeworks, setHomeworks] = useState<Homework[]>(() => loadStored('homeworks', INITIAL_HOMEWORKS));
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => loadStored('submissions', INITIAL_SUBMISSIONS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadStored('attendance', INITIAL_ATTENDANCE));
  const [exams] = useState<Examination[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<ExamResult[]>(() => loadStored('results', INITIAL_RESULTS));
  const [timetable] = useState<TimetableDay[]>(INITIAL_TIMETABLE);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => loadStored('studyMaterials', INITIAL_STUDY_MATERIALS));
  const [notices, setNotices] = useState<Notice[]>(() => loadStored('notices', INITIAL_NOTICES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => loadStored('events', INITIAL_EVENTS));
  const [fees, setFees] = useState<FeeRecord[]>(() => loadStored('fees', INITIAL_FEES));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadStored('leaves', INITIAL_LEAVES));
  const [transportRoutes] = useState<TransportRoute[]>(INITIAL_TRANSPORT_ROUTES);
  const [books, setBooks] = useState<LibraryBook[]>(() => loadStored('books', INITIAL_BOOKS));
  const [messages, setMessages] = useState<InternalMessage[]>(() => loadStored('messages', INITIAL_MESSAGES));
  const [admissionInquiries, setAdmissionInquiries] = useState<AdmissionInquiry[]>(() => loadStored('admissions', INITIAL_ADMISSIONS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('schooldev_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('schooldev_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('schooldev_homeworks', JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem('schooldev_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('schooldev_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('schooldev_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('schooldev_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('schooldev_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('schooldev_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('schooldev_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('schooldev_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('schooldev_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('schooldev_admissions', JSON.stringify(admissionInquiries));
  }, [admissionInquiries]);

  // Derived selected child for Parent view
  const selectedChild = allUsers.find(u => u.id === selectedChildId);

  // Switch role helper
  const switchRolePersona = (role: UserRole, userId?: string) => {
    let target: User | undefined;
    if (userId) {
      target = allUsers.find(u => u.id === userId);
    }
    if (!target) {
      target = allUsers.find(u => u.role === role);
    }
    if (target) {
      setCurrentUser(target);
      setPortalTab('dashboard');
    }
  };

  const registerUser = (newUser: Omit<User, 'id' | 'joinedDate'>) => {
    const id = `usr-${Date.now()}`;
    const user: User = {
      ...newUser,
      id,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setAllUsers(prev => [user, ...prev]);
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const createHomework = (hw: Omit<Homework, 'id' | 'createdDate' | 'totalSubmissions'>) => {
    const id = `hw-${Date.now()}`;
    const newHw: Homework = {
      ...hw,
      id,
      createdDate: new Date().toISOString().split('T')[0],
      totalSubmissions: 0,
    };
    setHomeworks(prev => [newHw, ...prev]);

    // Push notification for students
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Homework Assigned',
      message: `${hw.teacherName} assigned "${hw.title}" for ${hw.subject}. Due: ${hw.dueDate}`,
      time: 'Just now',
      type: 'homework',
      read: false,
      linkTab: 'homework',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteHomework = (id: string) => {
    setHomeworks(prev => prev.filter(h => h.id !== id));
  };

  const submitHomework = (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => {
    const id = `sub-${Date.now()}`;
    const dateStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newSub: HomeworkSubmission = {
      ...submission,
      id,
      submittedAt: dateStr,
      status: 'submitted',
    };
    setSubmissions(prev => [newSub, ...prev.filter(s => !(s.homeworkId === submission.homeworkId && s.studentId === submission.studentId))]);

    // update count
    setHomeworks(prev =>
      prev.map(h => (h.id === submission.homeworkId ? { ...h, totalSubmissions: (h.totalSubmissions || 0) + 1 } : h))
    );
  };

  const gradeSubmission = (subId: string, score: number, grade: string, feedback: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === subId ? { ...s, score, grade, feedback, status: 'graded' } : s))
    );
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const id = `att-${Date.now()}-${Math.random()}`;
    setAttendance(prev => {
      // replace if existing for same student on same date
      const filtered = prev.filter(r => !(r.studentId === record.studentId && r.date === record.date));
      return [{ ...record, id }, ...filtered];
    });
  };

  const bulkMarkAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`,
      date: r.date || today,
    }));

    setAttendance(prev => {
      const studentIds = new Set(records.map(r => r.studentId));
      const targetDate = records[0]?.date || today;
      const filtered = prev.filter(r => !(studentIds.has(r.studentId) && r.date === targetDate));
      return [...newRecords, ...filtered];
    });
  };

  const enterExamResult = (result: Omit<ExamResult, 'id'>) => {
    const id = `res-${Date.now()}`;
    setResults(prev => {
      const filtered = prev.filter(r => !(r.examId === result.examId && r.studentId === result.studentId));
      return [{ ...result, id }, ...filtered];
    });
  };

  const uploadStudyMaterial = (material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const id = `mat-${Date.now()}`;
    const newMat: StudyMaterial = {
      ...material,
      id,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };
    setStudyMaterials(prev => [newMat, ...prev]);
  };

  const incrementDownload = (id: string) => {
    setStudyMaterials(prev =>
      prev.map(m => (m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
  };

  const publishNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const id = `not-${Date.now()}`;
    const newNotice: Notice = {
      ...notice,
      id,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices(prev => [newNotice, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'School Notice Published',
      message: notice.title,
      time: 'Just now',
      type: 'notice',
      read: false,
      linkTab: 'notices',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const registerForEvent = (eventId: string, userId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        if (ev.registeredUsers.includes(userId)) return ev;
        return {
          ...ev,
          registeredUsers: [...ev.registeredUsers, userId],
        };
      })
    );
  };

  const payFee = (feeId: string, paymentMethod: string): FeeRecord | null => {
    let updatedRecord: FeeRecord | null = null;
    setFees(prev =>
      prev.map(f => {
        if (f.id === feeId) {
          updatedRecord = {
            ...f,
            status: 'paid',
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod,
            transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
          };
          return updatedRecord;
        }
        return f;
      })
    );
    return updatedRecord;
  };

  const applyLeave = (leave: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const id = `lev-${Date.now()}`;
    const newLeave: LeaveRequest = {
      ...leave,
      id,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected', remarks?: string) => {
    setLeaves(prev =>
      prev.map(l => (l.id === leaveId ? { ...l, status, reviewerRemarks: remarks || `Leave ${status}` } : l))
    );
  };

  const borrowBook = (bookId: string): boolean => {
    let success = false;
    setBooks(prev =>
      prev.map(b => {
        if (b.id === bookId && b.availableCopies > 0) {
          success = true;
          return { ...b, availableCopies: b.availableCopies - 1 };
        }
        return b;
      })
    );
    return success;
  };

  const returnBook = (bookId: string) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id === bookId && b.availableCopies < b.totalCopies) {
          return { ...b, availableCopies: b.availableCopies + 1 };
        }
        return b;
      })
    );
  };

  const sendMessage = (msg: Omit<InternalMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const id = `msg-${Date.now()}`;
    const dateStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newMsg: InternalMessage = {
      ...msg,
      id,
      timestamp: dateStr,
      isRead: false,
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const submitAdmissionInquiry = (inquiry: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => {
    const id = `inq-${Date.now()}`;
    const newInq: AdmissionInquiry = {
      ...inquiry,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setAdmissionInquiries(prev => [newInq, ...prev]);
  };

  const updateInquiryStatus = (inquiryId: string, status: AdmissionInquiry['status']) => {
    setAdmissionInquiries(prev =>
      prev.map(i => (i.id === inquiryId ? { ...i, status } : i))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setHomeworks(INITIAL_HOMEWORKS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setAttendance(INITIAL_ATTENDANCE);
    setResults(INITIAL_RESULTS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setNotices(INITIAL_NOTICES);
    setEvents(INITIAL_EVENTS);
    setFees(INITIAL_FEES);
    setLeaves(INITIAL_LEAVES);
    setBooks(INITIAL_BOOKS);
    setMessages(INITIAL_MESSAGES);
    setAdmissionInquiries(INITIAL_ADMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRolePersona,
        allUsers,
        registerUser,
        toggleUserStatus,
        selectedChildId,
        setSelectedChildId,
        selectedChild,
        isPublicSite,
        setIsPublicSite,
        portalTab,
        setPortalTab,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        theme,
        toggleTheme,
        homeworks,
        createHomework,
        deleteHomework,
        submissions,
        submitHomework,
        gradeSubmission,
        attendance,
        markAttendance,
        bulkMarkAttendance,
        exams,
        results,
        enterExamResult,
        timetable,
        studyMaterials,
        uploadStudyMaterial,
        incrementDownload,
        notices,
        publishNotice,
        deleteNotice,
        events,
        registerForEvent,
        fees,
        payFee,
        leaves,
        applyLeave,
        updateLeaveStatus,
        transportRoutes,
        books,
        borrowBook,
        returnBook,
        messages,
        sendMessage,
        markMessageRead,
        admissionInquiries,
        submitAdmissionInquiry,
        updateInquiryStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
