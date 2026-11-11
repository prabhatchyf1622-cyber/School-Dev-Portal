import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isStandalone, isIOS, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running standalone or dismissed, hide the banner
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await promptInstall();
      if (installed) {
        setInstallSuccess(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 shadow-lg shadow-blue-500/20 border border-blue-400/30 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-blue-100 mb-1">
              <span>Android & iOS Ready</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold leading-tight">Install School Parent & Student App</h4>
            <p className="text-xs text-blue-100/90 mt-0.5">
              Instant mobile home screen access, offline timetable & real-time updates.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>{isInstallable ? 'Install Android App' : 'Add to Home Screen'}</span>
        </button>

        <button
          onClick={() => setShowInstructions(prev => !prev)}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-colors border border-white/10"
        >
          {showInstructions ? 'Hide Guide' : 'How it works'}
        </button>

        {installSuccess && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4" /> App installed!
          </span>
        )}
      </div>

      {showInstructions && (
        <div className="mt-3.5 pt-3 border-t border-white/15 text-xs text-blue-50 space-y-2 animate-in fade-in">
          {isIOS ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-white">To install on iPhone / iPad (Safari):</p>
              <div className="flex items-center gap-2 text-blue-100">
                <Share2 className="w-4 h-4 text-white shrink-0" />
                <span>1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <PlusSquare className="w-4 h-4 text-white shrink-0" />
                <span>2. Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="font-semibold text-white">To install on Android (Chrome / Brave / Edge):</p>
              <p>1. Tap the <strong>"Install Android App"</strong> button above, or tap the three dots <strong>(⋮)</strong> in Chrome.</p>
              <p>2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              <p>3. The official SchoolDev App icon will appear in your app drawer and home screen!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
