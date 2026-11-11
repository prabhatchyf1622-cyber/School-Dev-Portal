import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Users, Phone, Mail, Calendar, Check, Search, Filter } from 'lucide-react';
import { AdmissionInquiry } from '../../types';

export const AdmissionsModule: React.FC = () => {
  const { admissionInquiries, updateInquiryStatus } = useSchool();
  const [statusFilter, setStatusFilter] = useState<'all' | AdmissionInquiry['status']>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredInquiries = admissionInquiries.filter(
    inq => statusFilter === 'all' || inq.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Prospective Admission Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Incoming application leads submitted through the public SchoolDev portal website.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(['all', 'new', 'contacted', 'enrolled', 'closed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Inquiries Cards */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No inquiries matching the selected filter.
          </div>
        ) : (
          filteredInquiries.map(inq => (
            <div
              key={inq.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">{inq.studentName}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {inq.appliedGrade}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-mono text-slate-500">{inq.date}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <span>Parent: <strong className="text-slate-800">{inq.parentName}</strong></span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {inq.phone}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {inq.email}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 italic">
                  "{inq.message}"
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={inq.status}
                  onChange={e => {
                    updateInquiryStatus(inq.id, e.target.value as any);
                    showToast(`Inquiry for ${inq.studentName} updated to ${e.target.value}.`);
                  }}
                  className="text-xs p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted Parent</option>
                  <option value="enrolled">Enrolled & Admitted</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
