import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { INITIAL_CERTIFICATES } from '../../data/mockData';
import { Award, Printer, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';
import { Certificate } from '../../types';

export const CertificatesModule: React.FC = () => {
  const { currentUser, selectedChild } = useSchool();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const activeStudent = currentUser.role === 'student' ? currentUser : selectedChild;
  const certificates = INITIAL_CERTIFICATES.filter(c => c.studentId === (activeStudent?.id || 'stu-1'));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Certificates & Honors
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official merit, athletic, and co-curricular credentials issued by SchoolDev.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map(cert => (
          <div
            key={cert.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {cert.certificateNo}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{cert.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cert.description}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Issued: {cert.issueDate}</span>
              <button
                onClick={() => setSelectedCert(cert)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
              >
                View & Print Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Print View Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border-4 border-amber-600/30 my-8">
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-mono text-slate-500">{selectedCert.certificateNo}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Certificate
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Certificate Layout */}
            <div className="border-4 border-double border-slate-800 p-8 text-center space-y-5 bg-stone-50/50">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-8 h-8 text-slate-900" />
                <h2 className="text-xl font-extrabold tracking-widest uppercase text-slate-900">
                  SchoolDev International Academy
                </h2>
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                Certificate of Academic & Co-Curricular Recognition
              </p>

              <div className="py-4">
                <p className="text-xs text-slate-600 italic">This is proudly presented to</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-serif underline decoration-amber-500 underline-offset-8">
                  {selectedCert.studentName}
                </h3>
              </div>

              <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                {selectedCert.description}
              </p>

              <div className="pt-8 flex items-end justify-between text-xs px-4">
                <div>
                  <div className="font-serif italic text-slate-800">{selectedCert.issueDate}</div>
                  <div className="w-32 border-t border-slate-800 pt-1 font-bold">Date of Issuance</div>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-amber-600/60 bg-amber-50 flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>

                <div>
                  <div className="font-serif italic text-slate-800">Dr. Sunita Kulkarni</div>
                  <div className="w-32 border-t border-slate-800 pt-1 font-bold">Principal & Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
