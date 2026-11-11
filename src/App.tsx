import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AuthPage } from './components/auth/AuthPage';

import { StudentAppShell } from './components/student-app/StudentAppShell';

// Dashboards
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';


// Modules
import { HomeworkModule } from './components/academic/HomeworkModule';
import { AttendanceModule } from './components/academic/AttendanceModule';
import { ExaminationsModule } from './components/academic/ExaminationsModule';
import { TimetableModule } from './components/academic/TimetableModule';
import { DigitalLibraryModule } from './components/academic/DigitalLibraryModule';
import { FeesModule } from './components/finance/FeesModule';
import { LeaveModule } from './components/services/LeaveModule';
import { CertificatesModule } from './components/services/CertificatesModule';
import { TransportModule } from './components/services/TransportModule';
import { NoticesModule } from './components/communication/NoticesModule';
import { EventsModule } from './components/communication/EventsModule';
import { MessagesModule } from './components/communication/MessagesModule';
import { UserManagementModule } from './components/admin/UserManagementModule';
import { AdmissionsModule } from './components/admin/AdmissionsModule';
import { AiTutorModule } from './components/ai/AiTutorModule';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

const AccessDeniedView: React.FC<{ moduleName: string; requiredRole: string }> = ({ moduleName, requiredRole }) => {
  const { currentUser, setPortalTab } = useSchool();
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-lg text-center animate-in fade-in zoom-in-95">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
        HTTP 403 · Access Denied
      </span>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3 mb-2">
        Restricted Portal Module
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
        You do not have permission to view <strong className="text-slate-900 dark:text-slate-200">{moduleName}</strong>. 
        This administrative module requires <strong className="text-rose-600 dark:text-rose-400">{requiredRole}</strong> authorization. 
        Your current session role is <strong className="uppercase">{currentUser.role}</strong>.
      </p>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-center gap-2">
        <Lock className="w-4 h-4 text-slate-400" />
        <span>Action logged: unauthorized access attempt prevented by SchoolDev RBAC middleware.</span>
      </div>

      <button
        onClick={() => setPortalTab('dashboard')}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Safe Dashboard</span>
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isPublicSite, currentUser, portalTab } = useSchool();

  // If loading session from cookie/token, show minimal loading splash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Verifying SchoolDev secure credentials...</p>
      </div>
    );
  }

  // Public visitor mode
  if (isPublicSite) {
    return <PublicWebsite />;
  }

  // Not logged in -> Show Authentication & User Access Management Landing Page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // PRODUCT 2: STUDENT & PARENT APP (Unified mobile-first PWA experience for Students and Parents)
  if (currentUser.role === 'student' || currentUser.role === 'parent') {
    return <StudentAppShell />;
  }

  // PRODUCT 1: SCHOOL ADMINISTRATION WEBSITE (Role-based management for Principal, Admin, Teachers, DEO)
  const renderActiveTab = () => {
    // Role-based Access Control Route Guards
    if (portalTab === 'users' && currentUser.role !== 'admin') {
      return <AccessDeniedView moduleName="User Management & Role Directory" requiredRole="Administrator" />;
    }
    if (portalTab === 'admissions' && currentUser.role !== 'admin') {
      return <AccessDeniedView moduleName="Admissions & Applicant Inquiries" requiredRole="Administrator" />;
    }

    switch (portalTab) {
      case 'dashboard':
        if (currentUser.role === 'student') return <StudentDashboard />;
        if (currentUser.role === 'teacher') return <TeacherDashboard />;
        if (currentUser.role === 'parent') return <ParentDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        return <StudentDashboard />;

      case 'homework':
        return <HomeworkModule />;

      case 'attendance':
        return <AttendanceModule />;

      case 'exams':
        return <ExaminationsModule />;

      case 'timetable':
        return <TimetableModule />;

      case 'library_resources':
        return <DigitalLibraryModule />;

      case 'fees':
        return <FeesModule />;

      case 'leaves':
        return <LeaveModule />;

      case 'certificates':
        return <CertificatesModule />;

      case 'transport':
        return <TransportModule />;

      case 'notices':
        return <NoticesModule />;

      case 'events':
        return <EventsModule />;

      case 'messages':
        return <MessagesModule />;

      case 'users':
        return <UserManagementModule />;

      case 'admissions':
        return <AdmissionsModule />;

      case 'ai_tutor':
        return <AiTutorModule />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-full overflow-hidden">
        {/* Sidebar (Desktop docked + Mobile drawer) */}
        <Sidebar />

        {/* Main Viewport Content - scaled for phone, tablet, laptop, desktop */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 sm:pb-10 overflow-y-auto max-w-7xl mx-auto w-full scroll-smooth transition-all duration-150">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phones < 640px) */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <AppContent />
      </SchoolProvider>
    </AuthProvider>
  );
}
