import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Bell,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Calendar,
  Trash2,
  Check,
} from 'lucide-react';
import { Notice } from '../../types';

export const NoticesModule: React.FC = () => {
  const { currentUser, notices, publishNotice, deleteNotice } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('general');
  const [targetRole, setTargetRole] = useState<Notice['targetRole']>('all');
  const [priority, setPriority] = useState<Notice['priority']>('normal');
  const [content, setContent] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    publishNotice({
      title,
      category,
      targetRole,
      priority,
      content,
      author: currentUser.name,
    });

    setShowPublishModal(false);
    setTitle('');
    setContent('');
    showToast('Official school notice published successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notices & Official Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            School-wide announcements, exam notifications, and emergency alerts.
          </p>
        </div>

        {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Publish Notice
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
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
            placeholder="Search circulars and notices..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="exam">Examination</option>
            <option value="sports">Sports</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className={`p-5 rounded-xl border transition-all bg-white ${
              notice.priority === 'critical'
                ? 'border-rose-300 shadow-xs'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  notice.priority === 'critical'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {notice.category}
                </span>
                <span className="text-xs font-mono text-slate-400">·</span>
                <span className="text-xs text-slate-500">Target: {notice.targetRole}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {notice.date}
                </span>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1">{notice.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{notice.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Published by: {notice.author}
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Publish New Official Circular</h3>
              <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handlePublish} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Schedule of Annual Athletic Meet 2026"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="general">General</option>
                    <option value="exam">Examination</option>
                    <option value="sports">Sports</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Audience</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="all">Entire School</option>
                    <option value="student">Students</option>
                    <option value="parent">Parents</option>
                    <option value="teacher">Teachers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Detailed circular instructions..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Publish to Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
