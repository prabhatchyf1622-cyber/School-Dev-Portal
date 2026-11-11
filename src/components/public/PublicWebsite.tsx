import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Building,
  Check,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const { setIsPublicSite, submitAdmissionInquiry, events, theme, toggleTheme } = useSchool();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Admission inquiry form
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Grade 9 (Secondary)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Active facility tab
  const [activeFacility, setActiveFacility] = useState<'labs' | 'library' | 'sports' | 'smart'>('labs');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAdmissionInquiry({
      studentName,
      parentName,
      email,
      phone,
      appliedGrade: grade,
      message: message || 'Interested in campus visit and admission guidelines for 2027.',
    });

    setSubmitted(true);
    setStudentName('');
    setParentName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar for Public Site */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight block">
                SchoolDev Academy
              </span>
              <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Excellence in Education Since 1998 · CBSE Affiliated
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a>
            <a href="#facilities" className="hover:text-slate-900 dark:hover:text-white transition-colors">Facilities</a>
            <a href="#academics" className="hover:text-slate-900 dark:hover:text-white transition-colors">Academics</a>
            <a href="#achievements" className="hover:text-slate-900 dark:hover:text-white transition-colors">Achievements</a>
            <a href="#admissions" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admissions</a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#admissions"
              className="hidden md:inline-flex px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Apply Online
            </a>

            {/* Top Right Light/Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setIsPublicSite(false)}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span className="hidden sm:inline">Access Student / Staff Portal</span>
              <span className="sm:hidden">Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Nav Toggle Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={isMobileNavOpen ? 'Close public menu' : 'Open public menu'}
            >
              {isMobileNavOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Public Mobile Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 pb-2">
              <a
                href="#about"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                About Us
              </a>
              <a
                href="#facilities"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Facilities
              </a>
              <a
                href="#academics"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Academics
              </a>
              <a
                href="#achievements"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Achievements
              </a>
              <a
                href="#admissions"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Admissions
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Contact
              </a>
            </div>
            <a
              href="#admissions"
              onClick={() => setIsMobileNavOpen(false)}
              className="block w-full py-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            >
              Apply Online for 2027 Admissions
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
              <span>Nurturing Leaders of Tomorrow</span>
              <span aria-hidden="true">·</span>
              <span>Admissions Open 2027</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Inspiring Curious Minds, Shaping Global Futures
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              SchoolDev International Academy integrates rigorous CBSE academic curricula with robotics innovation, Olympic sports infrastructure, and holistic character development.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#admissions"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <span>Admission Inquiry Form</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsPublicSite(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              >
                Sign In to Operating Portal
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl">
              <img
                src="/src/assets/images/school_campus_exterior_1794234913815.jpg"
                alt="SchoolDev Campus Grounds"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4-Column KPI Stats Strip */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-extrabold font-mono text-blue-400 tabular-nums">99.4%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Board Exam Distinction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">1 : 14</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Student to Teacher Mentorship</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">40+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Acres Green Eco-Campus</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-indigo-400 tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Smart Digital Workstations</div>
          </div>
        </div>
      </section>

      {/* About & Principal's Message */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                alt="Dr. Sunita Kulkarni"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Dr. Sunita Kulkarni</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Principal & Chief Academic Officer</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Ph.D. Education, Cambridge Fellow</p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Principal’s Welcome Note</h2>
            <blockquote className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-blue-600 pl-4 my-3">
              "At SchoolDev, we view education as a transformative journey. Beyond textbooks and examinations, we cultivate resilience, ethical leadership, and scientific skepticism in our students. We welcome you to experience our vibrant community."
            </blockquote>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Our Vision</span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 block">
                  To be an internationally recognized center of academic rigour and human values.
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Our Mission</span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 block">
                  To provide every learner with an individualized, experiential, and inquiry-led education.
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Why SchoolDev</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
              Holistic Education Built on Four Pillars
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Our campus blends traditional discipline with state-of-the-art interactive teaching systems, fostering intellectual autonomy and empathetic character.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">CBSE Affiliated Excellence</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Consistently ranked amongst the top 5 schools in academic board results and competitive entrance benchmarks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Innovation & AI Integration</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Advanced STEM makerspaces, robotics clubs, and digital academic portals for round-the-clock learning.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Olympic Standard Sports Complex</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    All-weather synthetic athletic track, FIFA standard football turf, indoor badminton courts, and certified coaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section id="facilities" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">World-Class Infrastructure</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Campus Facilities & Learning Spaces
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Designed to foster hands-on experimentation, deep focus, and collaborative projects.
            </p>

            <div className="flex items-center justify-center gap-2 mt-6">
              {[
                { id: 'labs', label: 'STEM & Science Labs' },
                { id: 'library', label: 'Digital Library & Commons' },
                { id: 'sports', label: 'Sports Arena' },
                { id: 'smart', label: 'Smart Classrooms' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveFacility(t.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeFacility === t.id
                      ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-800/40 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-72 sm:h-80">
              <img
                src={
                  activeFacility === 'labs'
                    ? '/src/assets/images/school_science_lab_1794234914923.jpg'
                    : '/src/assets/images/school_library_hall_1794234914799.jpg'
                }
                alt="Facility View"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {activeFacility === 'labs' ? 'Innovation & Scientific Discovery' : 'Curated Learning Environment'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeFacility === 'labs'
                  ? 'Advanced Physics, Chemistry & Robotics Laboratories'
                  : 'Spacious Multi-Tier Digital Library & Commons'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeFacility === 'labs'
                  ? 'Equipped with precision compound microscopes, spectroscopic analyzers, IoT microcontrollers, and 3D printing equipment. Each student conducts individual hands-on practical experiments under expert faculty guidance.'
                  : 'Over 25,000 print volumes, national journal archives, digital research workstations with JSTOR access, and quiet soundproof study pods for deep individual academic revision.'}
              </p>

              <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Safety Protocol</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">100% OSHA safety certified</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Digital Integration</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Smart interactive screens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Application Form */}
      <section id="admissions" className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Academic Year 2027</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Apply for School Admission
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Begin your child's journey at SchoolDev. Fill out the preliminary inquiry form, and our admissions directorate will contact you for a campus tour and interaction schedule.
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Transparent merit-based admission guidelines</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Merit scholarships for outstanding academic & sports performers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct integration with our parent portal upon enrollment</span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
              <strong className="block font-bold">Helpline for Admissions:</strong>
              <div className="mt-1 font-mono text-xs">+91 11 2948 2000 / +91 99000 11223</div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">admissions@schooldev.edu</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Online Admission Inquiry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Complete the form below to receive brochure & prospectus</p>

            {submitted && (
              <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thank you! Your admission inquiry has been submitted. Our admissions counselor will contact you.</span>
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Aryan Gupta"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Rakesh Gupta"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Grade Seeking Admission For</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Grade 11 (Science STEM)">Grade 11 (Science / STEM & Robotics)</option>
                  <option value="Grade 11 (Commerce & Economics)">Grade 11 (Commerce & Economics)</option>
                  <option value="Grade 10 (Secondary)">Grade 10 (Secondary)</option>
                  <option value="Grade 9 (Secondary)">Grade 9 (Secondary)</option>
                  <option value="Grade 7 (Middle School)">Grade 7 (Middle School)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message / Specific Inquiries</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Inquire about curriculum, bus routes, or sports facilities..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Submit Admission Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span>SchoolDev Academy</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Institutional Area, Knowledge Park, Phase II, New Delhi - 110001
            </p>
            <p className="mt-2 text-slate-400 text-[11px]">
              CBSE Affiliation # 830114 · School Code 20491
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Direct Contacts</div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Phone: +91 11 2948 2000</div>
              <div>Admissions: +91 99000 11223</div>
              <div>Email: principal@schooldev.edu</div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Operating Hours</div>
            <div className="space-y-1 text-[11px]">
              <div>Monday - Friday: 08:00 AM - 04:30 PM</div>
              <div>Saturday: 08:30 AM - 01:30 PM</div>
              <div>Sunday: Closed</div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Platform Access</div>
            <p className="text-[11px] text-slate-400 mb-3">
              Students, teachers, and registered guardians can log into the central operating portal.
            </p>
            <button
              onClick={() => setIsPublicSite(false)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
            >
              Sign In to Portal
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 SchoolDev Operating System. All rights reserved.</div>
          <div>One School · One Platform · Complete Digital Management</div>
        </div>
      </footer>
    </div>
  );
};
