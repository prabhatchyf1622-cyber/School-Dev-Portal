import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Clock, Calendar, MapPin, User, BookOpen } from 'lucide-react';
import { TimetableDay } from '../../types';

export const TimetableModule: React.FC = () => {
  const { timetable, currentUser } = useSchool();
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [selectedClass, setSelectedClass] = useState('10-A');

  const activeDaySchedule = timetable.find(t => t.day === selectedDay) || timetable[0];

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Timetable & Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly class schedule, subject allocation, faculty slots, and laboratory sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Class:</span>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white"
          >
            <option value="10-A">Grade 10 - Section A</option>
            <option value="9-B">Grade 9 - Section B</option>
            <option value="7-B">Grade 7 - Section B</option>
          </select>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              selectedDay === d
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Periods Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedDay}'s Class Routine · {selectedClass}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">6 Academic Periods · 2 Practical Lab Sessions</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded self-start sm:self-auto">
            Session: 08:30 AM - 02:00 PM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {activeDaySchedule.periods.map(period => (
            <div
              key={period.period}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    Period {period.period}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {period.time}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{period.subject}</h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{period.teacher}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{period.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
