import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Bus, MapPin, Phone, Users, Clock, Navigation } from 'lucide-react';

export const TransportModule: React.FC = () => {
  const { transportRoutes } = useSchool();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          School Bus Fleet & Route Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daily transit schedules, bus stop milestones, driver contacts, and active route logs.
        </p>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {transportRoutes.map(route => (
          <div
            key={route.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {route.busNumber}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  On Route
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{route.routeName}</h3>

              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-semibold text-slate-800">{route.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-mono text-slate-700 font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {route.driverPhone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pickup Timing:</span>
                  <span className="font-mono text-slate-700 font-semibold">{route.timing}</span>
                </div>
              </div>

              {/* Route Stops Milestones */}
              <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Route Stops & Milestones
                </div>
                <div className="space-y-2 text-xs">
                  {route.stops.map((stop, idx) => {
                    const isCurrent = stop === route.currentStop;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'
                          }`}
                        />
                        <span className={`text-xs ${isCurrent ? 'font-bold text-blue-700' : 'text-slate-600'}`}>
                          {stop} {isCurrent && '(Current Location)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {route.totalStudents} Enrolled Students
              </span>
              <span className="text-blue-600 font-semibold">Active Fleet</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
