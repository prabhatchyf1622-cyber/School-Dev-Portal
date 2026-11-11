import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Check,
  Sparkles,
} from 'lucide-react';

export const EventsModule: React.FC = () => {
  const { currentUser, events, registerForEvent } = useSchool();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRegister = (eventId: string, title: string) => {
    registerForEvent(eventId, currentUser.id);
    showToast(`You have registered for "${title}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          School Events & Activities
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Co-curricular competitions, cultural festivals, sports meets, and educational workshops.
        </p>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map(ev => {
          const isRegistered = ev.registeredUsers.includes(currentUser.id);
          const availableSeats = ev.maxSeats - ev.registeredUsers.length;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all"
            >
              <div>
                {ev.coverImage && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {ev.category}
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-mono">
                  {ev.registeredUsers.length}/{ev.maxSeats} registered
                </span>

                {isRegistered ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                  </span>
                ) : (
                  <button
                    onClick={() => handleRegister(ev.id, ev.title)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
