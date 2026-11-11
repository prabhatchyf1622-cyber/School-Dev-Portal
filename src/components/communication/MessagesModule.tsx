import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Plus,
  Check,
  Search,
} from 'lucide-react';
import { InternalMessage } from '../../types';

export const MessagesModule: React.FC = () => {
  const { currentUser, messages, sendMessage, markMessageRead, allUsers } = useSchool();

  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [receiverId, setReceiverId] = useState(
    allUsers.find(u => u.id !== currentUser.id)?.id || 'tea-1'
  );
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Messages involving current user
  const myMessages = messages.filter(
    m => m.receiverId === currentUser.id || m.senderId === currentUser.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = allUsers.find(u => u.id === receiverId);
    if (!recipient) return;

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: recipient.id,
      receiverName: recipient.name,
      subject,
      message: body,
    });

    setShowCompose(false);
    setSubject('');
    setBody('');
    showToast(`Message sent to ${recipient.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Internal Academic Communication
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct secure messaging between teachers, parents, students, and administration.
          </p>
        </div>

        <button
          onClick={() => setShowCompose(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          <Send className="w-4 h-4" />
          Compose Message
        </button>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl border border-slate-200 overflow-hidden min-h-[500px]">
        {/* Left Column: Message List */}
        <div className="border-r border-slate-200 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Conversations ({myMessages.length})
          </div>

          {myMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No messages found. Click "Compose" to initiate a conversation.
            </div>
          ) : (
            <div className="space-y-2">
              {myMessages.map(msg => {
                const isSelected = selectedMessage?.id === msg.id;
                const isReceived = msg.receiverId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      markMessageRead(msg.id);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70'
                        : !msg.isRead && isReceived
                        ? 'border-blue-200 bg-blue-50/30'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        {isReceived ? msg.senderName : `To: ${msg.receiverName}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                      {msg.subject}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{msg.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Message Thread */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Subject:
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>From: <strong className="text-slate-900">{selectedMessage.senderName}</strong></span>
                  <span>·</span>
                  <span>To: <strong className="text-slate-900">{selectedMessage.receiverName}</strong></span>
                  <span>·</span>
                  <span className="font-mono">{selectedMessage.timestamp}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Select a message to view thread</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Compose New Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSend} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Send To</label>
                <select
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                >
                  {allUsers.filter(u => u.id !== currentUser.id).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.toUpperCase()}) - {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding science project guidelines"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
