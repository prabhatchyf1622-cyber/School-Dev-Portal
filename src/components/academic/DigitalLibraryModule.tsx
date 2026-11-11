import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  CheckCircle2,
  Check,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';

export const DigitalLibraryModule: React.FC = () => {
  const {
    currentUser,
    studyMaterials,
    uploadStudyMaterial,
    incrementDownload,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Mathematics');
  const [matClass, setMatClass] = useState('10');
  const [matType, setMatType] = useState<'pdf' | 'notes' | 'paper' | 'syllabus'>('pdf');
  const [matDesc, setMatDesc] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredMaterials = studyMaterials.filter(m => {
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !subjectFilter || subjectFilter === 'all' || m.subject === subjectFilter;
    const matchesType = !typeFilter || typeFilter === 'all' || m.fileType === typeFilter;
    return matchesSearch && matchesSubject && matchesType;
  });

  const handleDownload = (id: string, title: string) => {
    incrementDownload(id);
    showToast(`Downloading: "${title}" (Simulated educational PDF document download)`);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadStudyMaterial({
      title: matTitle,
      subject: matSubject,
      classId: matClass,
      fileType: matType,
      fileSize: '3.4 MB',
      teacherName: currentUser.name,
      description: matDesc,
    });

    setShowUpload(false);
    setMatTitle('');
    setMatDesc('');
    showToast(`Study resource "${matTitle}" published to Digital Library!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Learning Commons & Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Download curriculum syllabi, chapter-wise notes, and solved question banks.
          </p>
        </div>

        {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Upload Study Material
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
            placeholder="Search notes, board papers, syllabus..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
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

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-300"
            >
              <option value="all">All Resource Types</option>
              <option value="pdf">Handbooks (PDF)</option>
              <option value="notes">Lecture Notes</option>
              <option value="paper">Solved Papers</option>
              <option value="syllabus">Official Syllabus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {mat.subject} · Grade {mat.classId}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {mat.fileSize} · {mat.uploadDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{mat.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{mat.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                <span>By {mat.teacherName}</span>
                <span className="mx-1.5">·</span>
                <span className="font-mono text-slate-600 font-semibold">{mat.downloadCount} downloads</span>
              </div>

              <button
                onClick={() => handleDownload(mat.id, mat.title)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Digital Learning Resource</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={e => setMatTitle(e.target.value)}
                  placeholder="e.g. CBSE Grade 10 Trigonometric Identities Formula Sheet"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={matSubject}
                    onChange={e => setMatSubject(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={matClass}
                    onChange={e => setMatClass(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="7">Class 7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={matType}
                    onChange={e => setMatType(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="pdf">Handbook PDF</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="paper">Solved Paper</option>
                    <option value="syllabus">Syllabus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={matDesc}
                  onChange={e => setMatDesc(e.target.value)}
                  placeholder="Describe the topics covered in this document..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
